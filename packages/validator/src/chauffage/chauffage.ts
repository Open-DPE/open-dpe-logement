import type { chauffage } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export { isEmetteur, validateEmetteur } from "./emetteur.js";
export { isGenerateur, validateGenerateur } from "./generateur.js";
export { isInstallation, validateInstallation } from "./installation.js";
export { isSysteme, validateSysteme } from "./systeme.js";

export function validateChauffage(data: unknown): IsValid | IsInvalid {
	return validate(ID.chauffage, data);
}

export function isChauffage(data: unknown): data is chauffage.Chauffage {
	return validateChauffage(data).isValid;
}
