import type { BatimentBase, Batiment, Maison, Immeuble } from "./types.js";
import { TYPES_BATIMENT } from "./enums.js";

export function isBatiment(value: BatimentBase): value is Batiment {
	return isMaison(value) || isImmeuble(value);
}

export function isMaison(value: BatimentBase): value is Maison {
	return value.type === TYPES_BATIMENT.maison;
}

export function isImmeuble(value: BatimentBase): value is Immeuble {
	return value.type === TYPES_BATIMENT.immeuble;
}
