import { listDpeFixtures } from "@open-dpe-logement/ademe-fixtures";
import { parse } from "@open-dpe-logement/ademe-parser";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { dpe } from "../src/index.js";

/**
 * Complément à `tests/fixtures.test.ts` : là où le test exhaustif garantit
 * "ne lève pas d'erreur" (couvre les échecs structurels), celui-ci garantit
 * "produit exactement cette valeur" pour un DPE réel connu, par version —
 * seul un deepEqual attrape une perte ou une coercion silencieuse de valeur
 * (champ mal typé dans le schéma, `.optional()` qui masque une absence...)
 * qu'un simple "ne lève pas" ne peut pas voir.
 *
 * Snapshot plutôt qu'un objet "golden" écrit à la main : un DPE réel compte
 * ~200-290 champs, intraitable à saisir/maintenir manuellement sans erreur.
 * Le snapshot initial doit être généré puis relu avec soin (en le
 * confrontant si besoin au XML source de la fixture) avant d'être commité —
 * c'est cette relecture, une fois par version, qui vaut garantie "on sait
 * valide". Toute divergence ultérieure (schéma, parser) fait échouer le
 * test : ne jamais ré-approuver un diff de snapshot sans le lire.
 *
 * Une fixture par version réellement présente dans le corpus (2 et 2.1
 * partagent le même XSD/schéma mais restent deux valeurs de version
 * distinctes dans les données réelles — testées séparément à dessein).
 */
const SUPPORTED_DPE_VERSIONS = ["2", "2.1", "2.2", "2.3", "2.4", "2.5", "2.6"];

describe("dpe.DPELogementExistant.parse() — objet de référence par version (snapshot)", () => {
	it.each(SUPPORTED_DPE_VERSIONS)("version %s", (version) => {
		const [fixture] = listDpeFixtures({ version });
		expect(
			fixture,
			`aucune fixture disponible pour la version ${version}`,
		).toBeDefined();
		if (!fixture) return;

		const xml = readFileSync(fixture.path, "utf-8");
		const parsed = parse(xml);
		const result = dpe.DPELogementExistant.parse(parsed);

		expect(result).toMatchSnapshot();
	});
});
