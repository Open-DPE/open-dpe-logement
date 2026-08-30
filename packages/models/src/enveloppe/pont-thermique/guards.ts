import { TYPES_LIAISON } from "./enums.js";
import {
	LiaisonBase,
	Liaison,
	LiaisonPlancher,
	LiaisonMenuiserie,
	LiaisonRefendOuIntermediaire,
} from "./types.js";

export function isLiaison(value: LiaisonBase): value is Liaison {
	return (
		isLiaisonPlancher(value) ||
		isLiaisonMenuiserie(value) ||
		isLiaisonRefendOuIntermediaire(value)
	);
}

export function isLiaisonPlancher(
	value: LiaisonBase,
): value is LiaisonPlancher {
	return (
		value.type === TYPES_LIAISON.plancher_bas_mur ||
		value.type === TYPES_LIAISON.plancher_haut_mur
	);
}

export function isLiaisonMenuiserie(
	value: LiaisonBase,
): value is LiaisonMenuiserie {
	return (
		value.type === TYPES_LIAISON.porte_mur ||
		value.type === TYPES_LIAISON.baie_mur
	);
}

export function isLiaisonRefendOuIntermediaire(
	value: LiaisonBase,
): value is LiaisonRefendOuIntermediaire {
	return (
		value.type === TYPES_LIAISON.plancher_intermediaire_mur ||
		value.type === TYPES_LIAISON.refend_mur
	);
}
