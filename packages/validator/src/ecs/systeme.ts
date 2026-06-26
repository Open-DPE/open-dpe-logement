import type { ecs } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateSysteme(data: unknown): IsValid | IsInvalid {
	return validate(ID.ecsSysteme, data);
}

export function isSysteme(data: unknown): data is ecs.systeme.Systeme {
	return validateSysteme(data).isValid;
}
