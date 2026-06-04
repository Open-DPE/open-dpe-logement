import { common } from "@open-dpe-logement/models";
import { abaques } from "@open-dpe-logement/abaques";

export function calcule_cef(props: {
	cef_base: number;
	celec_ac: number;
}): number {
	const { cef_base, celec_ac } = props;
	return Math.max(0, cef_base - celec_ac);
}

/**
 * @see Arrêté 15 septembre 2006 – Annexe 4
 * @param props.cef - Consommation d'énergie finale en kWh
 * @param props.energie - Type d'énergie consommée
 * @return Consommation d'énergie primaire en kWh
 */
export function calcule_cep(props: {
	cef: number;
	energie: common.Energie;
}): number {
	const { cef, energie } = props;
	switch (energie) {
		case common.EnergieEnum.electricite:
			return cef * 1.9;
		default:
			return cef;
	}
}

/**
 * @see Arrêté 15 septembre 2006 – Annexe 4
 * @param props.cef - Consommation d'énergie finale en kWh
 * @param props.usage - Usage de l'énergie consommée
 * @param props.energie - Type d'énergie consommée
 * @param props.reseau_id - ID du réseau de chaleur ou de froid (optionnel)
 * @return Emissions de gaz à effet de serre en kgCO2eq
 */
export function calcule_eges(props: {
	cef: number;
	usage: common.Usage;
	energie: common.Energie;
	reseau_id?: string | null;
}): number {
	const { cef, usage, energie, reseau_id } = props;

	// Cas des réseaux de chaleur ou de froid : on utilise le contenu en CO2 ACV du réseau
	if (reseau_id) {
		const abaque = abaques.performance.reseau.load();
		const query = { id: reseau_id };
		const matches = abaques.performance.reseau.search(query, abaque);
		const reseau = matches.at(0) ?? null;

		if (reseau) {
			return cef * reseau.contenu_co2_acv;
		}
	}

	// Cas de l'électricité
	if (energie === common.EnergieEnum.electricite) {
		switch (usage) {
			case common.UsageEnum.chauffage:
				return cef * 0.079;
			case common.UsageEnum.ecs:
				return cef * 0.065;
			case common.UsageEnum.refroidissement:
				return cef * 0.064;
			case common.UsageEnum.eclairage:
			case common.UsageEnum.auxiliaire:
				return cef * 0.069;
		}
	}

	switch (energie) {
		case common.EnergieEnum.electricite_renouvelable:
			return cef * 0;
		case common.EnergieEnum.gaz_naturel:
			return cef * 0.227;
		case common.EnergieEnum.gpl:
			return cef * 0.272;
		case common.EnergieEnum.fioul:
			return cef * 0.324;
		case common.EnergieEnum.charbon:
			return cef * 0.385;
		case common.EnergieEnum.bois_buche:
		case common.EnergieEnum.bois_granule:
			return cef * 0.03;
		case common.EnergieEnum.bois_plaquette:
			return cef * 0.024;
		case common.EnergieEnum.reseau_chaleur:
		case common.EnergieEnum.reseau_froid:
			return cef * 0.385;
	}
}

/**
 * @return Facteur de conversion PCI/PCS
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
