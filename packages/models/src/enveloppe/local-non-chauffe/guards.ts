import type {
	LocalNonChauffeBase,
	EspaceTamponSolarise,
	LocalNonChauffeAutre,
} from "./types.js";
import { TYPES_LNC } from "./enums.js";

export function isEspaceTamponSolarise(
	value: LocalNonChauffeBase,
): value is EspaceTamponSolarise {
	return value.type === TYPES_LNC.espace_tampon_solarise;
}

export function isLocalNonChauffeAutre(
	value: LocalNonChauffeBase,
): value is LocalNonChauffeAutre {
	return value.type !== TYPES_LNC.espace_tampon_solarise;
}
