import { type ErrorObject } from "ajv";
import { type SchemaKey, SCHEMAS, SCHEMA_KEYS } from "./schemas";
import { getValidator } from "./validator";

export type { SchemaKey };
export { SCHEMA_KEYS };

export function get(schema: SchemaKey): string {
	return SCHEMAS[schema];
}

export function validate(
	schema: SchemaKey,
	data: unknown,
): true | ErrorObject[] {
	const validator = getValidator(schema);
	const valid = validator(data);
	if (valid) return true;
	return validator.errors ?? [];
}
