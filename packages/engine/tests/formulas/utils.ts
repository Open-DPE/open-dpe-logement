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
			expectPartial?: Expect;
			expectError?: boolean;
		}>;
	}
>;

export type Input = Record<string, unknown>;
export type Expect =
	number | string | Record<string, unknown> | Array<unknown> | null;
export type Formulas = Record<string, Function>;

export function runTests(path: string, formulas: Formulas) {
	const tests = loadTests(path);
	Object.keys(tests).forEach((id) => {
		const test = tests[id];
		describe(id, () => {
			it.each(test.cases)(
				"$title",
				({
					title: _,
					with: input,
					expect: expected,
					expectPartial,
					expectError,
				}) => {
					if (expectError) {
						expect(() => formulas[test.rule](input)).toThrow();
					} else if (expected !== undefined) {
						expect(formulas[test.rule](input)).toEqual(
							toCloseMatcher(expected),
						);
					} else if (expectPartial !== undefined) {
						expect(formulas[test.rule](input)).toEqual(
							toPartialMatcher(expectPartial),
						);
					}
				},
			);
		});
	});
}

/**
 * Transforme récursivement une valeur attendue (nombre, objet ou tableau) en
 * structure équivalente où chaque nombre est remplacé par un matcher de
 * proximité (expect.closeTo). Nécessaire car les résultats des formules 3CL
 * sont des flottants (divisions, coefficients abaques, etc.) : une égalité
 * stricte (toEqual) sur un objet contenant un flottant échoue presque
 * toujours à cause des imprécisions de calcul, y compris quand la valeur
 * est correcte au nombre de décimales significatif pour le DPE.
 */
function toCloseMatcher(expected: Expect): unknown {
	if (typeof expected === "number") return expect.closeTo(expected);
	if (Array.isArray(expected)) return expected.map(toCloseMatcher);
	if (expected !== null && typeof expected === "object") {
		return Object.fromEntries(
			Object.entries(expected).map(([key, value]) => [
				key,
				toCloseMatcher(value as Expect),
			]),
		);
	}
	return expected;
}

/**
 * Variante de {@link toCloseMatcher} qui n'impose que les clés déclarées :
 * chaque objet devient un `expect.objectContaining`. Utile pour les formules
 * qui retournent des structures larges (sollicitations climatiques mensuelles,
 * consommations par usage et par énergie) dont seules quelques valeurs sont
 * significatives pour le cas de test.
 */
function toPartialMatcher(expected: Expect): unknown {
	if (typeof expected === "number") return expect.closeTo(expected);
	if (Array.isArray(expected)) return expected.map(toPartialMatcher);
	if (expected !== null && typeof expected === "object") {
		return expect.objectContaining(
			Object.fromEntries(
				Object.entries(expected).map(([key, value]) => [
					key,
					toPartialMatcher(value as Expect),
				]),
			),
		);
	}
	return expected;
}

export function loadTests(path: string): Tests {
	const fullPath = resolve(import.meta.dirname, path);
	if (!existsSync(fullPath))
		throw new Error(`Fichier introuvable : ${fullPath}`);

	const raw = loadYaml(readFileSync(fullPath, "utf8"));
	return raw as any;
}
