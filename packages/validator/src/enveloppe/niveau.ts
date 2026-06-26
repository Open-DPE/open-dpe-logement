import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateNiveau(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppeNiveau, data);
}

export function isNiveau(data: unknown): data is enveloppe.niveau.Niveau {
	return validateNiveau(data).isValid;
}
