import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import type * as climat from "../../climat/formulas.js";
import type * as chauffage from "../../chauffage/formulas.js";
import type * as paroi from "../paroi/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";

/**
 * @formule enveloppe.mur.dp
 * @returns Déperditions thermiques du mur en W/K
 */
export function calcule_dp(props: {
	sdep: ReturnType<typeof paroi.calcule_sdep>;
	b: paroi.b;
	u: ReturnType<typeof calcule_u>;
}): number {
	const { sdep, b, u } = props;
	return sdep * b * u;
}

/**
 * @formule enveloppe.mur.isolation_aiu
 * @param props.isolation : État d'isolation saisi du mur donnant sur un local non chauffé
 * @param props.annee_construction : Année de construction du bâtiment
 * @returns État d'isolation du mur donnant sur un local non chauffé
 */
export function calcule_isolation_aiu(props: {
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	return props.isolation ?? props.annee_construction > 1974;
}

/**
 * @formule enveloppe.mur.u
 * @props props.u_saisi : Coefficient de transmission thermique du mur saisi en W/m².K
 * @props props.isolation : Etat de l'isolation du mur
 * @props props.type_isolation : Type d'isolation du mur
 * @props props.epaisseur_isolation : Epaisseur de l'isolation du mur en mm
 * @props props.resistance_thermique_isolation : Résistance thermique de l'isolation du mur en m².K/W
 * @props props.annee_isolation : Année d'isolation du mur
 * @see abaques.enveloppe.mur.uph
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du mur en W/m².K
 */
export function calcule_u(props: {
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

		if (resistance_thermique_isolation) {
			return 1 / (1 / u0 + resistance_thermique_isolation);
		} else if (epaisseur_isolation) {
			return 1 / (1 / u0 + epaisseur_isolation / 1000 / 0.04);
		}
	}

	const { annee_construction, annee_isolation } = props;
	const annee_construction_isolation =
		annee_isolation ?? (annee_construction <= 1974 ? 1976 : annee_construction);

	const abaque = abaques.enveloppe.mur.umur;
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
 * @formule enveloppe.mur.u0
 * @see https://github.com/dpe-audit/dpe-logement/issues/41
 * @see https://github.com/dpe-audit/dpe-logement/issues/47
 * @props props.u0_saisi : Coefficient de transmission thermique du mur nu saisi en W/m².K
 * @props props.structures : Structures du mur
 * @props props.structures[].materiau : Matériau de la structure du mur
 * @props props.structures[].epaisseur : Epaisseur de la structure du mur en mm
 * @see abaques.enveloppe.mur.umur0
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du mur nu en W/m².K
 */
export function calcule_u0(props: {
	u0_saisi: number | null;
	u0_enduit_isolant: ReturnType<typeof calcule_u0_enduit_isolant>;
	u0_doublage: ReturnType<typeof calcule_u0_doublage>;
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
	structures: {
		materiau: models.enveloppe.mur.MateriauMur | null;
		epaisseur: number | null;
	}[];
}): number {
	const { u0_saisi, u0_enduit_isolant, u0_doublage, annee_construction } =
		props;

	if (u0_saisi) return Math.min(u0_saisi, 2.5);

	const abaque = abaques.enveloppe.mur.umur0;
	const data = abaque.load();
	const u0s = props.structures
		.map(({ materiau, epaisseur }) => {
			if (!materiau || !epaisseur) return null;
			const query = {
				type_mur: materiau,
				epaisseur_mur: epaisseur,
				annee_construction,
			};
			const match = abaque.search(query, data).at(0);
			if (!match) throw new ValeurForfaitaireError(query);
			return match.u0;
		})
		.filter((u0) => u0 !== null);

	let u0 =
		u0s.length > 0 ? 1 / u0s.reduce((acc, value) => acc + 1 / value, 0) : 2.5;

	if (u0_enduit_isolant) u0 = 1 / (1 / u0 + 1 / u0_enduit_isolant);
	if (u0_doublage) u0 = 1 / (1 / u0 + 1 / u0_doublage);
	return Math.min(u0, 2.5);
}

/**
 * @returns Mur composé de matéraux anciens
 */
export function calcule_paroi_ancienne(props: {
	structures: {
		materiau_ancien: boolean | null;
	}[];
}): boolean {
	return props.structures.some((i) => i.materiau_ancien);
}

/**
 * Coefficient de transmission thermique additionnel dû à la présence d'un enduit isolant
 * sur une paroi ancienne en W/m².K
 */
export function calcule_u0_enduit_isolant(props: {
	paroi_ancienne: ReturnType<typeof calcule_paroi_ancienne>;
	presence_enduit_isolant: boolean | null;
}): number {
	const { paroi_ancienne, presence_enduit_isolant } = props;
	if (null === paroi_ancienne) return 0;
	if (null === presence_enduit_isolant) return 0;
	return paroi_ancienne && presence_enduit_isolant ? 1 / 0.7 : 0;
}

/**
 * Coefficient de transmission thermique additionnel dû au doublage en W/m².K
 */
export function calcule_u0_doublage(props: {
	type_doublage: models.enveloppe.mur.TypeDoublage | null;
}): number {
	switch (props.type_doublage) {
		case models.enveloppe.mur.TypeDoublageEnum.sans_doublage:
			return 0;
		case models.enveloppe.mur.TypeDoublageEnum.indetermine:
			return 10;
		case models.enveloppe.mur.TypeDoublageEnum.lame_air_inferieur_15mm:
			return 10;
		case models.enveloppe.mur.TypeDoublageEnum.lame_air_superieur_15mm:
			return 21;
		case models.enveloppe.mur.TypeDoublageEnum.materiaux_connu:
			return 21;
		default:
			return 0;
	}
}

/**
 * @param props.isolation : État d'isolation saisie
 * @returns État d'isolation retenu
 */
export function set_isolation(props: {
	isolation: boolean | null;
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
}): boolean {
	return props.isolation ?? props.annee_construction > 1974;
}
