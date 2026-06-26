import type { refroidissement } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateGenerateur(data: unknown): IsValid | IsInvalid {
	return validate(ID.refroidissementGenerateur, data);
}

export function isGenerateur(
	data: unknown,
): data is refroidissement.generateur.Generateur {
	return validateGenerateur(data).isValid;
}
