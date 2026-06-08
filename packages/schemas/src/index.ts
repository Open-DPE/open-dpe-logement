import { type ErrorObject } from "ajv";
import { type Schema, type SchemaKey, SCHEMAS } from "./schemas";
import { getValidator } from "./validator";

export type { SchemaKey };

export function get(schemaKey: SchemaKey): Schema {
	return SCHEMAS[schemaKey];
}

type IsValid = {
	isValid: true;
};

type IsInvalid = {
	isValid: false;
	errors: ErrorObject[];
};

export function validate(
	schemaKey: SchemaKey,
	data: unknown,
): IsValid | IsInvalid {
	const schema = get(schemaKey);
	const validator = getValidator(schema);
	const valid = validator(data);
	if (valid) return { isValid: true };
	return { isValid: false, errors: validator.errors ?? [] };
}
