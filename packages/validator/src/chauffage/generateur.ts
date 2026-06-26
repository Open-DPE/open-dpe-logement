import type { chauffage } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateGenerateur(data: unknown): IsValid | IsInvalid {
	return validate(ID.chauffageGenerateur, data);
}

export function isGenerateur(
	data: unknown,
): data is chauffage.generateur.Generateur {
	return validateGenerateur(data).isValid;
}
