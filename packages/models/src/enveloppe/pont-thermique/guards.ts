import { TypeLiaison } from "./enums.js";
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
		value.type === TypeLiaison.enum.plancher_bas_mur ||
		value.type === TypeLiaison.enum.plancher_haut_mur
	);
}

export function isLiaisonMenuiserie(
	value: LiaisonBase,
): value is LiaisonMenuiserie {
	return (
		value.type === TypeLiaison.enum.porte_mur ||
		value.type === TypeLiaison.enum.baie_mur
	);
}

export function isLiaisonRefendOuIntermediaire(
	value: LiaisonBase,
): value is LiaisonRefendOuIntermediaire {
	return (
		value.type === TypeLiaison.enum.plancher_intermediaire_mur ||
		value.type === TypeLiaison.enum.refend_mur
	);
}
