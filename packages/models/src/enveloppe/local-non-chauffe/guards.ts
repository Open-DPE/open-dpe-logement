import type {
	LocalNonChauffeBase,
	EspaceTamponSolarise,
	LocalNonChauffeAutre,
} from "./types.js";
import { TypeLocalNonChauffe } from "./enums.js";

export function isEspaceTamponSolarise(
	value: LocalNonChauffeBase,
): value is EspaceTamponSolarise {
	return value.type === TypeLocalNonChauffe.enum.espace_tampon_solarise;
}

export function isLocalNonChauffeAutre(
	value: LocalNonChauffeBase,
): value is LocalNonChauffeAutre {
	return value.type !== TypeLocalNonChauffe.enum.espace_tampon_solarise;
}
