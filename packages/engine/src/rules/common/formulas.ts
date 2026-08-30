import * as models from "@open-dpe-logement/models";
import { abaques } from "@open-dpe-logement/engine-abaques";
import type * as production from "../production/formulas.js";

/**
 * @returns Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	cef: number;
	cef_enr: number;
	usage: models.common.UsageEnum;
	energie: models.common.EnergieEnum;
	reseau_id: string | null;
}): models.common.Consommations {
	const { cef_enr, usage, energie, reseau_id } = props;
	const cef = Math.max(props.cef - cef_enr, 0);
	const consommations: models.common.Consommations = {};

	consommations[usage] = {
		[energie]: {
			cef,
			cep: cef * calcule_fcep({ energie }),
			eges: cef * calcule_feges({ usage, energie, reseau_id }),
		},
	};
	if (cef_enr > 0 && energie === models.common.ENERGIES.electricite) {
		const enr = models.common.ENERGIES.electricite_renouvelable;
		consommations[usage][enr] = {
			cef: cef_enr,
			cep: cef_enr * calcule_fcep({ energie: enr }),
			eges: cef_enr * calcule_feges({ usage, energie: enr, reseau_id }),
		};
	}
	return consommations;
}

/**
 * @formule common.fcep
 * @param props.energie - Type d'énergie consommée
 * @returns Facteur de conversion énergie finale/énergie primaire
 */
export function calcule_fcep(props: {
	energie: models.common.EnergieEnum;
}): number {
	switch (props.energie) {
		case models.common.ENERGIES.electricite:
		case models.common.ENERGIES.electricite_renouvelable:
			return 1.9;
		default:
			return 1;
	}
}

/**
 * @formule common.feges
 * @see abaques.performance.reseau
 * @param props.usage - Usage de l'énergie consommée
 * @param props.energie - Type d'énergie consommée
 * @param props.reseau_id - ID du réseau de chaleur ou de froid (optionnel)
 * @returns Facteur de conversion énergie finale/émissions de gaz à effet de serre en kgCO2eq
 */
export function calcule_feges(props: {
	usage: models.common.UsageEnum;
	energie: models.common.EnergieEnum;
	reseau_id?: string | null;
}): number {
	const { usage, energie, reseau_id } = props;

	// Cas des réseaux de chaleur ou de froid : on utilise le contenu en CO2 ACV du réseau
	if (reseau_id) {
		const abaque = abaques.performance.reseau.load();
		const query = { id: reseau_id };
		const matches = abaques.performance.reseau.search(query, abaque);
		const reseau = matches.at(0) ?? null;
		if (reseau) return reseau.contenu_co2_acv;
	}

	// Cas de l'électricité
	if (energie === models.common.ENERGIES.electricite) {
		switch (usage) {
			case models.common.USAGES.chauffage:
				return 0.079;
			case models.common.USAGES.ecs:
				return 0.065;
			case models.common.USAGES.refroidissement:
				return 0.064;
			case models.common.USAGES.eclairage:
			case models.common.USAGES.auxiliaire:
				return 0.069;
		}
	}

	switch (energie) {
		case models.common.ENERGIES.electricite_renouvelable:
			return 0;
		case models.common.ENERGIES.gaz_naturel:
			return 0.227;
		case models.common.ENERGIES.gpl:
			return 0.272;
		case models.common.ENERGIES.fioul:
			return 0.324;
		case models.common.ENERGIES.charbon:
			return 0.385;
		case models.common.ENERGIES.bois_buche:
		case models.common.ENERGIES.bois_granule:
			return 0.03;
		case models.common.ENERGIES.bois_plaquette:
			return 0.024;
		case models.common.ENERGIES.reseau_chaleur:
		case models.common.ENERGIES.reseau_froid:
			return 0.385;
	}
}

/**
 * @formule common.kpcs
 * @returns Facteur de conversion PCI/PCS
 */
export function calcule_kpcs(props: {
	energie: models.common.EnergieEnum;
}): number {
	switch (props.energie) {
		case models.common.ENERGIES.gaz_naturel:
			return 1.11;
		case models.common.ENERGIES.gpl:
			return 1.09;
		case models.common.ENERGIES.fioul:
			return 1.07;
		case models.common.ENERGIES.charbon:
			return 1.04;
		case models.common.ENERGIES.bois_buche:
		case models.common.ENERGIES.bois_plaquette:
		case models.common.ENERGIES.bois_granule:
			return 1.08;
		default:
			return 1;
	}
}

/**
 * @returns Consommation d'électricité renouvelable en kWh/an
 */
export function calcule_cener(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	usage: models.production.UsageElectricite;
	cef: number;
}): number {
	const { cef, usage } = props;
	const celec = props.celec[usage];
	const celec_ac = props.celec_ac[usage];
	const p_celec_ac = celec ? cef / celec : 0;
	return celec_ac * p_celec_ac;
}

/**
 * @returns Consommation d'électricité en kWh/an
 */
export function calcule_celec(props: {
	cef: number;
	energie: models.common.EnergieEnum;
}): number {
	return props.energie === models.common.ENERGIES.electricite ? props.cef : 0;
}
