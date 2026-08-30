import {
	TYPES_GENERATEUR,
	TypeGenerateurEnum,
	TypeGenerateurPacEnum,
} from "./enums.js";

import {
	Generateur,
	GenerateurBase,
	GenerateurPAC,
	GenerateurClimatiseur,
	GenerateurReseauFroid,
} from "./types.js";

export function isGenerateur(value: GenerateurBase): value is Generateur {
	return (
		isGenerateurPAC(value) ||
		isGenerateurClimatiseur(value) ||
		isGenerateurReseauFroid(value)
	);
}

export function isGenerateurPAC(value: GenerateurBase): value is GenerateurPAC {
	return isTypeGenerateurPac(value.type);
}

export function isGenerateurClimatiseur(
	value: GenerateurBase,
): value is GenerateurClimatiseur {
	return value.type === TYPES_GENERATEUR.autre;
}

export function isGenerateurReseauFroid(
	value: GenerateurBase,
): value is GenerateurReseauFroid {
	return value.type === TYPES_GENERATEUR.reseau_froid;
}

export function isTypeGenerateurPac(
	value: TypeGenerateurEnum,
): value is TypeGenerateurPacEnum {
	return (
		value === TYPES_GENERATEUR.pac_air_air ||
		value === TYPES_GENERATEUR.pac_air_eau ||
		value === TYPES_GENERATEUR.pac_eau_eau ||
		value === TYPES_GENERATEUR.pac_eau_glycolee_eau ||
		value === TYPES_GENERATEUR.pac_geothermique ||
		value === TYPES_GENERATEUR.autre_systeme_thermodynamique
	);
}
