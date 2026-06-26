import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateMur(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppeMur, data);
}

export function isMur(data: unknown): data is enveloppe.mur.Mur {
	return validateMur(data).isValid;
}
