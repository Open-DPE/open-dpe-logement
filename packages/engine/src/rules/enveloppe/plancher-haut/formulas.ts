import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import { ValeurForfaitaireError } from "#utils/errors.js";
import * as climat from "#rules/climat/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as paroi from "#rules/enveloppe/paroi/formulas.js";
export * from "#rules/enveloppe/paroi/formulas.js";

/**
 * @doctrine enveloppe.plancher_haut.isolation_aiu
 * @param props.isolation : État d'isolation saisi du plancher haut donnant sur un local non chauffé
 * @param props.annee_construction : Année de construction du bâtiment
 * @return État d'isolation de plancher haut donnant sur un local non chauffé
 */
export function calcule_isolation_aiu(props: {
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	return props.isolation ?? props.annee_construction > 1974;
}

/**
 * @doctrine enveloppe.plancher_haut.u
 * @props props.u_saisi : Coefficient de transmission thermique du plancher haut saisi en W/m².K
 * @props props.configuration : Configuration du plancher haut
 * @props props.isolation : Etat de l'isolation du plancher haut
 * @props props.type_isolation : Type d'isolation du plancher haut
 * @props props.epaisseur_isolation : Epaisseur de l'isolation du plancher haut en mm
 * @props props.resistance_thermique_isolation : Résistance thermique de l'isolation du plancher haut en m².K/W
 * @props props.annee_isolation : Année d'isolation du plancher haut
 * @see abaques.enveloppe.plancherHaut.uph
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du plancher haut en W/m².K
 */
export function calcule_u(props: {
	u_saisi: number | null;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	effet_joule: ReturnType<typeof chauffage.calcule_effet_joule>;
	configuration: models.enveloppe.plancherHaut.Configuration;
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

	const abaque = abaques.enveloppe.plancherHaut.uph;
	const query = {
		zone_climatique: props.zone_climatique,
		effet_joule: props.effet_joule,
		configuration: props.configuration,
		annee_construction_isolation,
	};
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return Math.min(match.u, u0);
}

/**
 * @doctrine enveloppe.plancher_haut.u0
 * @props props.u0_saisi : Coefficient de transmission thermique du plancher haut nu saisi en W/m².K
 * @param props.type_plancher_haut : Type de plancher haut
 * @see abaques.enveloppe.plancherHaut.uph0
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du plancher haut nu en W/m².K
 */
export function calcule_u0(props: {
	u0_saisi: number | null;
	type_plancher_haut: models.enveloppe.plancherHaut.TypePlancherHaut | null;
}): number {
	const { u0_saisi, type_plancher_haut } = props;

	if (u0_saisi) return u0_saisi;
	if (type_plancher_haut === null) return 2.5;

	const abaque = abaques.enveloppe.plancherHaut.uph0;
	const match = abaque.search({ type_plancher_haut }, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.u0;
}

/**
 * @param props.isolation : État d'isolation saisie
 * @return État d'isolation retenu
 */
export function set_isolation(props: {
	isolation: boolean | null;
	annee_construction: ReturnType<typeof paroi.set_annee_construction>;
}): boolean {
	if (props.isolation !== null) return props.isolation;
	return props.annee_construction > 1974;
}
