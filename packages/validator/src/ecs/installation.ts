import type { ecs } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateInstallation(data: unknown): IsValid | IsInvalid {
	return validate(ID.ecsInstallation, data);
}

export function isInstallation(
	data: unknown,
): data is ecs.installation.Installation {
	return validateInstallation(data).isValid;
}
