import { TYPES_CHAUFFAGE } from "../enums.js";
import { TYPES_DISTRIBUTION } from "./enums.js";
import {
	SystemeBase,
	Systeme,
	SystemeCentral,
	SystemeDivise,
	ReseauBase,
	Reseau,
	ReseauHydraulique,
	ReseauAeraulique,
} from "./types.js";

export function isSysteme(value: SystemeBase): value is Systeme {
	return isSystemeCentral(value) || isSystemeDivise(value);
}

export function isSystemeCentral(value: SystemeBase): value is SystemeCentral {
	return value.type === TYPES_CHAUFFAGE.central;
}

export function isSystemeDivise(value: SystemeBase): value is SystemeDivise {
	return value.type === TYPES_CHAUFFAGE.divise;
}

export function isReseau(value: ReseauBase): value is Reseau {
	return isReseauHydraulique(value) || isReseauAeraulique(value);
}

export function isReseauHydraulique(
	value: ReseauBase,
): value is ReseauHydraulique {
	return value.type_distribution === TYPES_DISTRIBUTION.hydraulique;
}

export function isReseauAeraulique(
	value: ReseauBase,
): value is ReseauAeraulique {
	return value.type_distribution === TYPES_DISTRIBUTION.aeraulique;
}
