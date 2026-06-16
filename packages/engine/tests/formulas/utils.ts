import { load as loadYaml } from "js-yaml";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

export type Tests = Record<
	string,
	{
		rule: string;
		cases: Array<{
			title: string;
			with: Input;
			expect?: Expect;
			expectError?: boolean;
		}>;
	}
>;

export type Input = Record<string, unknown>;
export type Expect =
	| number
	| string
	| Record<string, unknown>
	| Array<unknown>
	| null;
export type Formulas = Record<string, Function>;

export function runTests(path: string, formulas: Formulas) {
	const tests = loadTests(path);
	Object.keys(tests).forEach((id) => {
		const test = tests[id];
		describe(id, () => {
			it.each(test.cases)(
				"$title",
				({ title: _, with: input, expect: expected, expectError }) => {
					if (expectError) {
						expect(() => formulas[test.rule](input)).toThrow();
					} else if (expected !== undefined) {
						if (typeof expected === "number") {
							expect(formulas[test.rule](input)).toBeCloseTo(expected);
						} else {
							expect(formulas[test.rule](input)).toEqual(expected);
						}
					}
				},
			);
		});
	});
}

export function loadTests(path: string): Tests {
	const fullPath = resolve(import.meta.dirname, path);
	if (!existsSync(fullPath))
		throw new Error(`Fichier introuvable : ${fullPath}`);

	const raw = loadYaml(readFileSync(fullPath, "utf8"));
	return raw as any;
}
