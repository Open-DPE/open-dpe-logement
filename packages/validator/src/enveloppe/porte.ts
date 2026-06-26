import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validatePorte(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppePorte, data);
}

export function isPorte(data: unknown): data is enveloppe.porte.Porte {
	return validatePorte(data).isValid;
}
