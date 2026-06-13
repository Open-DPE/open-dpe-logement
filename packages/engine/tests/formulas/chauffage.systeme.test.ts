import { describe, it, expect } from "vitest";
import { loadTests } from "./utils.js";
import * as formulas from "../../src/rules/chauffage/systeme/formulas.js";

const MAP: Record<string, Function> = {
	calcule_rg_combustion: formulas.calcule_rg_combustion,
};

const tests = loadTests("chauffage.systeme.test.yaml");

Object.keys(tests).forEach((id) => {
	const test = tests[id];
	describe(id, () => {
		it.each(test.cases)(
			"$title",
			({ title: _, with: input, expect: expected, expectError }) => {
				if (expectError) {
					expect(() => MAP[test.run](input)).toThrow();
				} else {
					expect(MAP[test.run](input)).toEqual(expected);
				}
			},
		);
	});
});
