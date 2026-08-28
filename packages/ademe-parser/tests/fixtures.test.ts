import { listDpeFixtures } from "@open-dpe-logement/ademe-fixtures";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { parse } from "../src/parser.js";

/**
 * Contrat testé ici, propre à `ademe-parser` : `parse()` survit au XML réel
 * de l'observatoire DPE-Audit (encodages, valeurs limites, XML mal formé
 * éventuel...) et retourne un objet JS non vide.
 *
 * Ce test ne vérifie PAS la conformité du résultat à un schéma : c'est la
 * responsabilité de `ademe-models` (`tests/fixtures.test.ts`), qui appelle
 * ce même `parse()` en précondition puis valide le résultat avec Zod. Les
 * deux tests partagent le même corpus mais isolent chacun sa propre couche
 * de responsabilité — un échec ici pointe directement vers un bug de
 * parsing, indépendamment de toute question de schéma.
 *
 * `it.each` (plutôt qu'une boucle dans une unique `it`) pour que le rapport
 * de test nomme précisément le `numero_dpe` en échec.
 */
describe("parse() — corpus de fixtures DPE réelles", () => {
	const fixtures = listDpeFixtures();

	it(`couvre au moins une fixture (corpus non vide)`, () => {
		expect(fixtures.length).toBeGreaterThan(0);
	});

	it.each(fixtures)(
		"$numero_dpe (v$version_dpe) : parse() ne lève pas et retourne un objet non vide",
		({ path }) => {
			const xml = readFileSync(path, "utf-8");

			const result = parse(xml);

			expect(result).not.toBeNull();
			expect(typeof result).toBe("object");
			expect(Object.keys(result as object).length).toBeGreaterThan(0);
		},
	);
});
