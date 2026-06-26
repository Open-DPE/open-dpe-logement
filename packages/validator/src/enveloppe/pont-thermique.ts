import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validatePontThermique(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppePontThermique, data);
}

export function isPontThermique(
	data: unknown,
): data is enveloppe.pontThermique.PontThermique {
	return validatePontThermique(data).isValid;
}
