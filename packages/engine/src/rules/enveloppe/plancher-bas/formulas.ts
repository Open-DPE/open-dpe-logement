import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as climat from "#rules/climat/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as paroi from "#rules/enveloppe/paroi/formulas.js";
export * from "#rules/enveloppe/paroi/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import { bilinearInterpolate } from "#utils/math.js";

/**
 * @doctrine enveloppe.plancher_bas.isolation_aiu
 * @param props.isolation : État d'isolation saisi du plancher bas donnant sur un local non chauffé
 * @param props.annee_construction : Année de construction du bâtiment
 * @return État d'isolation de plancher bas donnant sur un local non chauffé
 */
export function calcule_isolation_aiu(props: {
	isolation: boolean | null;
	mitoyennete: models.enveloppe.common.Mitoyennete;
	annee_construction: number;
}): boolean {
	if (props.isolation !== null) return props.isolation;
	return props.mitoyennete ===
		models.enveloppe.common.MitoyenneteEnum.terre_plein
		? props.annee_construction >= 2001
		: props.annee_construction >= 1975;
}

/**
 * @doctrine enveloppe.plancher_bas.u
 * @return Coefficient de transmission thermique du plancher bas en W/m².K
 */
export function calcule_u(props: {
	uint: ReturnType<typeof calcule_uint>;
	ue: ReturnType<typeof calcule_ue> | null;
}): number {
	return props.ue ?? props.uint;
}

/**
 * @props props.u_saisi : Coefficient de transmission thermique du plancher bas saisi en W/m².K
 * @props props.isolation : Etat de l'isolation du plancher bas
 * @props props.type_isolation : Type d'isolation du plancher bas
 * @props props.epaisseur_isolation : Epaisseur de l'isolation du plancher bas en mm
 * @props props.resistance_thermique_isolation : Résistance thermique de l'isolation du plancher bas en m².K/W
 * @props props.annee_isolation : Année d'isolation du plancher bas
 * @see abaques.enveloppe.plancherBas.uph
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique intermédiaire du plancher bas en W/m².K
 */
export function calcule_uint(props: {
	u_saisi: number | null;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	effet_joule: ReturnType<typeof chauffage.calcule_effet_joule>;
	u0: ReturnType<typeof calcule_u0>;
	isolation: boolean | null;
	type_isolation: models.enveloppe.common.TypeIsolation | null;
	epaisseur_isolation: number | null;
	resistance_thermique_isolation: number | null;
	annee_isolation: number | null;
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
}): number {
	const { u_saisi, isolation, u0 } = props;

	if (u_saisi) return u_saisi;
	if (isolation === false) return u0;

	if (isolation) {
		const { resistance_thermique_isolation, epaisseur_isolation } = props;

		if (resistance_thermique_isolation)
			return 1 / (1 / u0 + resistance_thermique_isolation);
		if (epaisseur_isolation)
			return 1 / (1 / u0 + epaisseur_isolation / 1000 / 0.042);
	}

	const { annee_construction, annee_isolation } = props;
	const annee_construction_isolation =
		annee_isolation ?? (annee_construction <= 1974 ? 1976 : annee_construction);

	const abaque = abaques.enveloppe.plancherBas.upb;
	const query = {
		zone_climatique: props.zone_climatique,
		effet_joule: props.effet_joule,
		annee_construction_isolation,
	};
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return Math.min(match.u, u0);
}

/**
 * @props props.surface_ue : Surface du plancher du bâtiment ou du lot sur terre-plein, vide sanitaire ou sous-sol non chauffé en m²
 * @props props.perimetre_ue : Périmètre du plancher du bâtiment ou du lot sur terre-plein, vide sanitaire ou sous-sol non chauffé en m
 * @see abaques.enveloppe.plancherBas.ue
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du plancher bas en W/m².K
 */
export function calcule_ue(props: {
	mitoyennete:
		| typeof models.enveloppe.common.MitoyenneteEnum.terre_plein
		| typeof models.enveloppe.common.MitoyenneteEnum.vide_sanitaire
		| typeof models.enveloppe.common.MitoyenneteEnum.sous_sol_non_chauffe;
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
	u: ReturnType<typeof calcule_u>;
	surface_ue: number;
	perimetre_ue: number;
}): number {
	const { u, surface_ue, perimetre_ue, ...query } = props;
	const _2sp = Math.round((2 * surface_ue) / perimetre_ue);
	const abaque = abaques.enveloppe.plancherBas.ue;
	const matches = abaque.search(query, abaque.load());
	const match = abaque.search({ u, "2s/p": _2sp }, matches).at(0);

	if (match) return match.ue;
	if (matches.length === 0) throw new ValeurForfaitaireError(props);

	const points = matches.map((match) => ({
		x: match["2s/p"],
		y: match.u,
		q: match.ue,
	}));
	return bilinearInterpolate(_2sp, u, points);
}

/**
 * @props props.mitoyennete : Mitoyenneté du plancher bas
 * @returns Indique si la méthode de calcul Ue est applicable pour le plancher bas
 */
export function calcule_ue_applicable(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
}): boolean {
	const scopes: models.enveloppe.common.Mitoyennete[] = [
		models.enveloppe.common.MitoyenneteEnum.terre_plein,
		models.enveloppe.common.MitoyenneteEnum.vide_sanitaire,
		models.enveloppe.common.MitoyenneteEnum.sous_sol_non_chauffe,
	];
	return scopes.includes(props.mitoyennete);
}

/**
 * @doctrine enveloppe.plancher_bas.u0
 * @props props.u0_saisi : Coefficient de transmission thermique du plancher bas nu saisi en W/m².K
 * @param props.type_plancher_bas : Type de plancher bas
 * @see abaques.enveloppe.plancherBas.upb0
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du plancher bas nu en W/m².K
 */
export function calcule_u0(props: {
	u0_saisi: number | null;
	type_plancher_bas: models.enveloppe.plancherBas.TypePlancherBas | null;
}): number {
	const { u0_saisi, type_plancher_bas } = props;

	if (u0_saisi) return u0_saisi;
	if (type_plancher_bas === null) return 2;
	const abaque = abaques.enveloppe.plancherBas.upb0;
	const match = abaque.search({ type_plancher_bas }, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.u0;
}

/**
 * @param props.isolation : État d'isolation bas saisi
 * @param props.annee_construction : Année de construction
 * @returns État d'isolation retenu
 */
export function set_isolation(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	if (props.isolation !== null) return props.isolation;
	return props.mitoyennete ===
		models.enveloppe.common.MitoyenneteEnum.terre_plein
		? props.annee_construction >= 2001
		: props.annee_construction >= 1975;
}
