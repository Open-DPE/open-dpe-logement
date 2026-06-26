import type { ecs } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateGenerateur(data: unknown): IsValid | IsInvalid {
	return validate(ID.ecsGenerateur, data);
}

export function isGenerateur(data: unknown): data is ecs.generateur.Generateur {
	return validateGenerateur(data).isValid;
}
