import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import type { Schema } from "./schemas";

export function createValidator() {
	const ajv = new Ajv2020({
		strict: false,
		allErrors: true,
		useDefaults: true,
	});

	addFormats(ajv);
	ajv.addKeyword("x-enum");
	return ajv;
}

const ajv = createValidator();
const compiled = new Map<string, ReturnType<typeof ajv.compile>>();

export function getValidator(schema: Schema): ReturnType<typeof ajv.compile> {
	const cached = compiled.get(schema.$id);
	if (cached) return cached;

	const existing = ajv.getSchema<unknown>(schema.$id);

	if (existing) {
		compiled.set(schema.$id, existing);
		return existing;
	}

	const validator = ajv.compile(schema);
	compiled.set(schema.$id, validator);
	return validator;
}
