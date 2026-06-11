import { common } from "@open-dpe-logement/models";
import { abaques } from "@open-dpe-logement/abaques";

/**
 * @returns Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	cef: number;
	cef_enr: number;
	usage: common.Usage;
	energie: common.Energie;
	reseau_id: string | null;
}): common.Consommations {
	const { cef_enr, usage, energie, reseau_id } = props;
	const cef = Math.max(props.cef - cef_enr, 0);
	const consommations: common.Consommations = {};

	consommations[usage] = {
		[energie]: {
			cef,
			cep: cef * calcule_fcep({ energie }),
			eges: cef * calcule_feges({ usage, energie, reseau_id }),
		},
	};
	if (cef_enr > 0 && energie === common.EnergieEnum.electricite) {
		const enr = common.EnergieEnum.electricite_renouvelable;
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
export function calcule_fcep(props: { energie: common.Energie }): number {
	switch (props.energie) {
		case common.EnergieEnum.electricite:
		case common.EnergieEnum.electricite_renouvelable:
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
	usage: common.Usage;
	energie: common.Energie;
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
	if (energie === common.EnergieEnum.electricite) {
		switch (usage) {
			case common.UsageEnum.chauffage:
				return 0.079;
			case common.UsageEnum.ecs:
				return 0.065;
			case common.UsageEnum.refroidissement:
				return 0.064;
			case common.UsageEnum.eclairage:
			case common.UsageEnum.auxiliaire:
				return 0.069;
		}
	}

	switch (energie) {
		case common.EnergieEnum.electricite_renouvelable:
			return 0;
		case common.EnergieEnum.gaz_naturel:
			return 0.227;
		case common.EnergieEnum.gpl:
			return 0.272;
		case common.EnergieEnum.fioul:
			return 0.324;
		case common.EnergieEnum.charbon:
			return 0.385;
		case common.EnergieEnum.bois_buche:
		case common.EnergieEnum.bois_granule:
			return 0.03;
		case common.EnergieEnum.bois_plaquette:
			return 0.024;
		case common.EnergieEnum.reseau_chaleur:
		case common.EnergieEnum.reseau_froid:
			return 0.385;
	}
}

/**
 * @formule common.kpcs
 * @returns Facteur de conversion PCI/PCS
 */
export function calcule_kpcs(props: { energie: common.Energie }): number {
	switch (props.energie) {
		case common.EnergieEnum.gaz_naturel:
			return 1.11;
		case common.EnergieEnum.gpl:
			return 1.09;
		case common.EnergieEnum.fioul:
			return 1.07;
		case common.EnergieEnum.charbon:
			return 1.04;
		case common.EnergieEnum.bois_buche:
		case common.EnergieEnum.bois_plaquette:
		case common.EnergieEnum.bois_granule:
			return 1.08;
		default:
			return 1;
	}
}
