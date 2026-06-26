import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { type ErrorObject } from "ajv";
import { schemas } from "./schemas.js";

export type IsValid = {
	isValid: true;
};

export type IsInvalid = {
	isValid: false;
	errors: ErrorObject[];
};

function createValidator() {
	const ajv = new Ajv2020({
		strict: false,
		allErrors: true,
		useDefaults: true,
		multipleOfPrecision: 2,
	});

	addFormats(ajv);
	ajv.addKeyword("x-enum");

	// Bootstrap : enregistre tous les schémas (publics et privés) avant toute
	// compilation, pour que la résolution des $ref croisés ne dépende jamais
	// de l'ordre d'appel des validateXXX/isXXX par le consommateur.
	for (const schema of schemas.values()) {
		ajv.addSchema(schema);
	}

	return ajv;
}

const ajv = createValidator();

export function validate($id: string, input: unknown): IsValid | IsInvalid {
	const validator = ajv.getSchema($id);
	if (!validator) {
		throw new Error(`Schéma introuvable dans le registre : ${$id}`);
	}

	const valid = validator(input);
	if (valid) return { isValid: true } as const;
	return { isValid: false, errors: validator.errors ?? [] } as const;
}
