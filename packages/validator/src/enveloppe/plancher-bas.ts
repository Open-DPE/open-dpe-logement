import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validatePlancherBas(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppePlancherBas, data);
}

export function isPlancherBas(
	data: unknown,
): data is enveloppe.plancherBas.PlancherBas {
	return validatePlancherBas(data).isValid;
}
