import type { batiment } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export { isAppartement, validateAppartement } from "./appartement.js";

export function validateBatiment(data: unknown): IsValid | IsInvalid {
	return validate(ID.batiment, data);
}

export function isBatiment(data: unknown): data is batiment.Batiment {
	return validateBatiment(data).isValid;
}
