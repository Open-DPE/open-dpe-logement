import { describe, expect, it } from "vitest";
import { SCHEMAS, Schema } from "../src/schemas.js";
import { createValidator } from "../src/validator.js";

describe("Schéma de données publiques", () => {
	const schemas = Object.values(SCHEMAS) as Schema[];

	schemas.forEach((schema) => {
		const validator = createValidator();
		it(`[${schema.$id}] est valide et compilable par AJV`, () => {
			expect(() => validator.compile(schema)).not.toThrow();
		});
	});
});
