import type { diagnostic } from "@open-dpe-logement/models";
import { validate, type IsValid, type IsInvalid } from "../ajv.js";
import { ID } from "../schemas.js";

export function validateDiagnostic(data: unknown): IsValid | IsInvalid {
	return validate(ID.diagnostic, data);
}

export function isDiagnostic(data: unknown): data is diagnostic.Diagnostic {
	return validateDiagnostic(data).isValid;
}
