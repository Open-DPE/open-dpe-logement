import type { chauffage } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateSysteme(data: unknown): IsValid | IsInvalid {
	return validate(ID.chauffageSysteme, data);
}

export function isSysteme(data: unknown): data is chauffage.systeme.Systeme {
	return validateSysteme(data).isValid;
}
