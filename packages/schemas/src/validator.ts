import Ajv2020 from "ajv/dist/2020";
import addFormats from "ajv-formats";
import { type SchemaKey, SCHEMAS } from "./schemas";

const ajv = new Ajv2020({
	strict: false,
	allErrors: true,
	useDefaults: true,
});

addFormats(ajv);

const compiled = new Map<SchemaKey, ReturnType<typeof ajv.compile>>();

export function getValidator(key: SchemaKey): ReturnType<typeof ajv.compile> {
	const cached = compiled.get(key);
	if (cached) return cached;
	const schema = JSON.parse(SCHEMAS[key]);
	const validator = ajv.compile(schema);
	compiled.set(key, validator);
	return validator;
}
