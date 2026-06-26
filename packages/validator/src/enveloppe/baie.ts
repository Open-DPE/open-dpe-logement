import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateBaie(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppeBaie, data);
}

export function isBaie(data: unknown): data is enveloppe.baie.Baie {
	return validateBaie(data).isValid;
}
