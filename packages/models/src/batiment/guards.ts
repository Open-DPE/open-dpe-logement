import type { BatimentBase, Batiment, Maison, Immeuble } from "./types.js";
import { TypeBatiment } from "./enums.js";

export function isBatiment(value: BatimentBase): value is Batiment {
	return isMaison(value) || isImmeuble(value);
}

export function isMaison(value: BatimentBase): value is Maison {
	return value.type === TypeBatiment.enum.maison;
}

export function isImmeuble(value: BatimentBase): value is Immeuble {
	return value.type === TypeBatiment.enum.immeuble;
}
