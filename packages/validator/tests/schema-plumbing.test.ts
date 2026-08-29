/**
 * Couche A : plomberie manifeste (clé) -> schéma -> Ajv.
 *
 * On ne teste PAS ici la cohérence interne des schémas eux-mêmes (Ajv fait
 * déjà foi) : uniquement que `validate()` accepte une entrée valide pour
 * CHAQUE clé publique de `MAP`, de façon data-driven (`it.each` sur
 * `Object.keys(MAP)`) — pas un test écrit à la main par clé, pour que
 * l'ajout d'un futur schéma sans fixture correspondante fasse échouer la
 * suite plutôt que d'être silencieusement ignoré.
 */

import { describe, expect, it } from "vitest";
import { MAP, validate, type Key } from "../src/index.js";
import { FIXTURES } from "./fixtures.js";

const KEYS = Object.keys(MAP) as Key[];

describe("validate() — couche A (plomberie manifeste -> schéma -> Ajv)", () => {
	it("FIXTURES couvre exactement les clés de MAP (ni orpheline, ni manquante)", () => {
		expect(Object.keys(FIXTURES).sort()).toEqual(KEYS.slice().sort());
	});

	it.each(KEYS)("valide une fixture correcte pour la clé %s", (key) => {
		if (!(key in FIXTURES)) {
			throw new Error(
				`Aucune fixture définie dans tests/fixtures.ts pour la clé ${key} : ` +
					"ajoute une entrée à FIXTURES avant d'enregistrer ce schéma dans MAP.",
			);
		}

		const response = validate(key, FIXTURES[key]);

		expect(response.valid, JSON.stringify("errors" in response ? response.errors : [])).toBe(true);
	});

	describe("rejette un objet vide pour un échantillon de clés représentatives", () => {
		const echantillon: Key[] = ["/diagnostic", "/batiment", "/enveloppe/mur", "/chauffage/generateur"];

		it.each(echantillon)("`{}` est invalide pour %s", (key) => {
			const response = validate(key, {});

			expect(response.valid).toBe(false);
		});
	});
});
