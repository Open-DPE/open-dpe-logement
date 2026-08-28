import { listDpeFixtures } from "@open-dpe-logement/ademe-fixtures";
import { parse } from "@open-dpe-logement/ademe-parser";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dpe } from "../src/index.js";

/**
 * Contrat testé ici, propre à `ademe-models` : `dpe.DPELogementExistant`
 * valide sans lever d'erreur l'intégralité du corpus réel de fixtures — la
 * garantie d'exhaustivité du schéma face aux données réelles de
 * l'observatoire DPE-Audit.
 *
 * `parse()` (`ademe-parser`) est appelé ici en précondition, pas comme objet
 * de test : la robustesse du parsing lui-même (XML → objet JS) est testée
 * indépendamment dans `ademe-parser` (`tests/fixtures.test.ts`), sur le même
 * corpus. Si ce test échoue à l'étape `parse()`, le test équivalent
 * d'`ademe-parser` l'aura déjà isolé séparément.
 *
 * `it.each` (plutôt qu'une boucle dans une unique `it`) pour que le rapport
 * de test nomme précisément le `numero_dpe` en échec.
 */
describe("dpe.DPELogementExistant.parse() — corpus de fixtures DPE réelles", () => {
	const fixtures = listDpeFixtures();

	it(`couvre au moins une fixture (corpus non vide)`, () => {
		expect(fixtures.length).toBeGreaterThan(0);
	});

	it.each(fixtures)(
		"$numero_dpe (v$version_dpe) : valide sans lever d'erreur",
		({ path }) => {
			const xml = readFileSync(path, "utf-8");
			const parsed = parse(xml);

			expect(() => dpe.DPELogementExistant.parse(parsed)).not.toThrow();
		},
	);
});
