import { describe, it, expect } from "vitest";
import * as _formulas from "../../src/rules/eclairage/formulas.js";
import { loadTests } from "./utils.js";

const formulas = _formulas as Record<string, Function>;
const tests = loadTests("eclairage.test.yaml");

Object.keys(tests).forEach((id) => {
	const test = tests[id];
	describe(id, () => {
		it.each(test.cases)(
			"$title",
			({ title: _, with: input, expect: expected, expectError }) => {
				if (expectError) {
					expect(() => formulas[test.run](input)).toThrow();
				} else {
					expect(formulas[test.run](input)).toEqual(expected);
				}
			},
		);
	});
});
