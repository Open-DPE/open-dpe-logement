import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { SCHEMAS } from "./schemas.js";

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
	for (const schema of SCHEMAS.values()) {
		ajv.addSchema(schema);
	}

	return ajv;
}

export const ajv = createValidator();
