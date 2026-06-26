import type { batiment } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateAppartement(data: unknown): IsValid | IsInvalid {
	return validate(ID.batimentAppartement, data);
}

export function isAppartement(
	data: unknown,
): data is batiment.appartement.Appartement {
	return validateAppartement(data).isValid;
}
