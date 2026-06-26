import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validatePlancherHaut(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppePlancherHaut, data);
}

export function isPlancherHaut(
	data: unknown,
): data is enveloppe.plancherHaut.PlancherHaut {
	return validatePlancherHaut(data).isValid;
}
