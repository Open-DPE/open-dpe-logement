import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as climat from "#rules/climat/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as paroi from "#rules/enveloppe/paroi/formulas.js";
export * from "#rules/enveloppe/paroi/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";

/**
 * @doctrine enveloppe.mur.isolation_aiu
 * @param props.isolation : État d'isolation saisi du mur donnant sur un local non chauffé
 * @param props.annee_construction : Année de construction du bâtiment
 * @return État d'isolation du mur donnant sur un local non chauffé
 */
export function calcule_isolation_aiu(props: {
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	return props.isolation ?? props.annee_construction > 1974;
}

/**
 * @doctrine enveloppe.mur.u
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
 * @doctrine enveloppe.mur.u0
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
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
	structures: {
		materiau: models.enveloppe.mur.MateriauMur | null;
		epaisseur: number | null;
	}[];
}): number {
	const { u0_saisi, annee_construction } = props;

	if (u0_saisi) return Math.min(u0_saisi, 2.5);

	const structures = props.structures.filter((structure) => structure.materiau);
	if (structures.length === 0) return 2.5;

	const abaque = abaques.enveloppe.mur.umur0;
	const data = abaque.load();

	const values: number[] = structures.map((structure) => {
		const query = {
			type_mur: structure.materiau,
			epaisseur_mur: structure.epaisseur ?? 0,
			annee_construction,
		};
		const match = abaque.search(query, data).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.u0;
	});

	const u0 = values.reduce((acc, value) => 1 / (1 / acc + 1 / value));
	return Math.min(u0, 2.5);
}

/**
 * @param props.isolation : État d'isolation saisie
 * @return État d'isolation retenu
 */
export function set_isolation(props: {
	isolation: boolean | null;
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
}): boolean {
	return props.isolation ?? props.annee_construction > 1974;
}
