import type { refroidissement } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export { isGenerateur, validateGenerateur } from "./generateur.js";
export { isInstallation, validateInstallation } from "./installation.js";

export function validateRefroidissement(data: unknown): IsValid | IsInvalid {
	return validate(ID.refroidissement, data);
}

export function isRefroidissement(
	data: unknown,
): data is refroidissement.Refroidissement {
	return validateRefroidissement(data).isValid;
}
