import { TypeGenerateur, TypeGenerateurPac } from "./enums.js";

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
	return value.type === TypeGenerateur.enum.autre;
}

export function isGenerateurReseauFroid(
	value: GenerateurBase,
): value is GenerateurReseauFroid {
	return value.type === TypeGenerateur.enum.reseau_froid;
}

export function isTypeGenerateurPac(
	value: TypeGenerateur,
): value is TypeGenerateurPac {
	return (
		value === TypeGenerateur.enum.pac_air_air ||
		value === TypeGenerateur.enum.pac_air_eau ||
		value === TypeGenerateur.enum.pac_eau_eau ||
		value === TypeGenerateur.enum.pac_eau_glycolee_eau ||
		value === TypeGenerateur.enum.pac_geothermique ||
		value === TypeGenerateur.enum.autre_systeme_thermodynamique
	);
}
