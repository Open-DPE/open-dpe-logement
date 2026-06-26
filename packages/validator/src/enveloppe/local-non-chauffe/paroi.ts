import type { enveloppe } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../../ajv.js";
import { ID } from "../../schemas.js";

export function validateParoi(data: unknown): IsValid | IsInvalid {
	return validate(ID.enveloppeLocalNonChauffeParoi, data);
}

export function isParoi(
	data: unknown,
): data is enveloppe.localNonChauffe.paroi.Paroi {
	return validateParoi(data).isValid;
}
