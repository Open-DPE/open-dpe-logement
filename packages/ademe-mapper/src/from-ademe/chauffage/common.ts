import type { GenerateurChauffage } from "./types.js";

/**
 * Partie PAC d'une PAC Hybride si enum_type_generateur_ch_id ∈ [145;147] ∪ [162;170]
 */
export function isPACHybridePartiePAC(props: GenerateurChauffage): boolean {
	switch (props.donnee_entree.enum_type_generateur_ch_id) {
		case "145":
		case "146":
		case "147":
		case "162":
		case "163":
		case "164":
		case "165":
		case "166":
		case "167":
		case "168":
		case "169":
		case "170":
			return true;
		default:
			return false;
	}
}

/**
 * Partie Chaudière d'une PAC Hybride si enum_type_generateur_ch_id ∈ [148;161]
 */
export function isPACHybridePartieChaudiere(
	props: GenerateurChauffage,
): boolean {
	switch (props.donnee_entree.enum_type_generateur_ch_id) {
		case "148":
		case "149":
		case "150":
		case "151":
		case "152":
		case "153":
		case "154":
		case "155":
		case "156":
		case "157":
		case "158":
		case "159":
		case "160":
		case "161":
			return true;
		default:
			return false;
	}
}
