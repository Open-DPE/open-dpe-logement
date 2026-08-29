import { MAP, type Key } from "@open-dpe-logement/schemas";
import { checkRules, type Diagnostic } from "./rules.js";
import type { ValidationError, ValidationResponse } from "./types.js";
import { ajv } from "./services.js";

export { MAP, type Key };

export type { ValidationError, ValidationResponse };
export type { Diagnostic };

export function validate<T>(key: Key, input: unknown): ValidationResponse<T> {
	const $id = MAP[key];
	const validator = ajv.getSchema($id);

	if (!validator) {
		throw new Error(`Schéma introuvable dans le registre : ${$id}`);
	}
	const valid = validator(input);
	if (!valid) {
		return {
			valid: false,
			errors: (validator.errors ?? []).map((error) => ({
				field: error.instancePath,
				message: error.message ?? "Erreur de validation",
				type: "json-schema",
				details: error,
			})),
		};
	}

	// Règles de cohérence (README.md § Règles de cohérence) : uniquement sur
	// le diagnostic complet, et seulement une fois la structure validée par
	// Ajv (cf. doc-comment de checkRules dans rules.ts).
	if (key === "/diagnostic") {
		const ruleErrors = checkRules(input as Diagnostic);
		if (ruleErrors.length > 0) {
			return { valid: false, errors: ruleErrors };
		}
	}

	return { valid: true, data: input as T };
}
