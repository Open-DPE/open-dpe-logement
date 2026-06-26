import type { ventilation } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export { isInstallation, validateInstallation } from "./installation.js";

export function validateVentilation(data: unknown): IsValid | IsInvalid {
	return validate(ID.ventilation, data);
}

export function isVentilation(
	data: unknown,
): data is ventilation.Ventilation {
	return validateVentilation(data).isValid;
}
