import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateMasque(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppeMasque, data);
}

export function isMasque(data: unknown): data is enveloppe.masque.Masque {
	return validateMasque(data).isValid;
}
