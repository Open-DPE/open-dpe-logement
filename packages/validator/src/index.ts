import type { ValidationError, ValidationResponse } from "./types.js";
import { MAP, type Key } from "./schemas.js";
import { ajv } from "./services.js";

export { MAP, type Key };

export type { ValidationError, ValidationResponse };

export function validate<T>(key: Key, input: unknown): ValidationResponse<T> {
	const $id = MAP[key];
	const validator = ajv.getSchema($id);

	if (!validator) {
		throw new Error(`Schéma introuvable dans le registre : ${$id}`);
	}
	const valid = validator(input);
	return valid
		? { valid: true, data: input as T }
		: {
				valid: false,
				errors: (validator.errors ?? []).map((error) => ({
					field: error.instancePath,
					message: error.message ?? "Erreur de validation",
					type: "json-schema",
					details: error,
				})),
			};
}
