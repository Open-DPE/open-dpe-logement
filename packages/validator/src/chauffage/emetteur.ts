import type { chauffage } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateEmetteur(data: unknown): IsValid | IsInvalid {
	return validate(ID.chauffageEmetteur, data);
}

export function isEmetteur(
	data: unknown,
): data is chauffage.emetteur.Emetteur {
	return validateEmetteur(data).isValid;
}
