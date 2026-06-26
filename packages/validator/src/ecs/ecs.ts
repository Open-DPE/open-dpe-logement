import type { ecs } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export { isGenerateur, validateGenerateur } from "./generateur.js";
export { isInstallation, validateInstallation } from "./installation.js";
export { isSysteme, validateSysteme } from "./systeme.js";

export function validateEcs(data: unknown): IsValid | IsInvalid {
	return validate(ID.ecs, data);
}

export function isEcs(data: unknown): data is ecs.Ecs {
	return validateEcs(data).isValid;
}
