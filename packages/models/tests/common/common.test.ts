import { describe, expect, it } from "vitest";
import {
	mergeParMois,
	reduceConsommations,
	reduceConsommationsParEnergie,
	reduceConsommationsParUsage,
	mergeConsommations,
	isGaz,
	isBois,
	type ParMois,
	type Consommations,
} from "../../src/common/index.js";

describe("mergeParMois", () => {
	it("additionne les valeurs mois par mois", () => {
		const a: ParMois<number> = {
			"01": 1, "02": 1, "03": 1, "04": 1, "05": 1, "06": 1,
			"07": 1, "08": 1, "09": 1, "10": 1, "11": 1, "12": 1,
		};
		const b: ParMois<number> = {
			"01": 10, "02": 0, "03": 0, "04": 0, "05": 0, "06": 0,
			"07": 0, "08": 0, "09": 0, "10": 0, "11": 0, "12": 0,
		};
		const result = mergeParMois([a, b]);
		expect(result["01"]).toBe(11);
		expect(result["02"]).toBe(1);
	});

	it("retourne des zéros pour une liste vide", () => {
		const result = mergeParMois([]);
		expect(result["01"]).toBe(0);
		expect(result["12"]).toBe(0);
	});
});

describe("reduceConsommations", () => {
	it("aggrège toutes les consommations usage/énergie confondus", () => {
		const consommations: Consommations = {
			chauffage: {
				electricite: { cef: 100, cep: 230, eges: 5 },
				gaz_naturel: { cef: 50, cep: 50, eges: 10 },
			},
			ecs: {
				electricite: { cef: 20, cep: 46, eges: 1 },
			},
		};
		expect(reduceConsommations(consommations)).toEqual({
			cef: 170,
			cep: 326,
			eges: 16,
		});
	});

	it("retourne zéro pour un objet vide", () => {
		expect(reduceConsommations({})).toEqual({ cef: 0, cep: 0, eges: 0 });
	});
});

describe("reduceConsommationsParEnergie", () => {
	it("aggrège par énergie en additionnant les usages", () => {
		const consommations: Consommations = {
			chauffage: { electricite: { cef: 100, cep: 230, eges: 5 } },
			ecs: { electricite: { cef: 20, cep: 46, eges: 1 } },
		};
		expect(reduceConsommationsParEnergie(consommations)).toEqual({
			electricite: { cef: 120, cep: 276, eges: 6 },
		});
	});
});

describe("reduceConsommationsParUsage", () => {
	it("aggrège par usage en additionnant les énergies", () => {
		const consommations: Consommations = {
			chauffage: {
				electricite: { cef: 100, cep: 230, eges: 5 },
				gaz_naturel: { cef: 50, cep: 50, eges: 10 },
			},
		};
		expect(reduceConsommationsParUsage(consommations)).toEqual({
			chauffage: { cef: 150, cep: 280, eges: 15 },
		});
	});
});

describe("mergeConsommations", () => {
	it("fusionne plusieurs jeux de consommations par usage et énergie", () => {
		const a: Consommations = {
			chauffage: { electricite: { cef: 100, cep: 230, eges: 5 } },
		};
		const b: Consommations = {
			chauffage: { electricite: { cef: 10, cep: 23, eges: 1 } },
			ecs: { gaz_naturel: { cef: 5, cep: 5, eges: 1 } },
		};
		expect(mergeConsommations(a, b)).toEqual({
			chauffage: { electricite: { cef: 110, cep: 253, eges: 6 } },
			ecs: { gaz_naturel: { cef: 5, cep: 5, eges: 1 } },
		});
	});

	it("retourne un objet vide sans arguments", () => {
		expect(mergeConsommations()).toEqual({});
	});
});

describe("isGaz / isBois", () => {
	it("identifie correctement les énergies gaz", () => {
		expect(isGaz("gaz_naturel")).toBe(true);
		expect(isGaz("gpl")).toBe(true);
		expect(isGaz("electricite")).toBe(false);
	});

	it("identifie correctement les énergies bois", () => {
		expect(isBois("bois_buche")).toBe(true);
		expect(isBois("bois_granule")).toBe(true);
		expect(isBois("fioul")).toBe(false);
	});
});

// `isEnergieCombustion` et `toNonEmptyArray` ont été retirés de
// `@open-dpe-logement/models` lors de la migration zod (2026-08) : le premier
// est redevenu un calcul local à chaque domaine (cf. `ENERGIES_COMBUSTION`
// dans `chauffage/generateur/guards.ts`, potentiellement différent d'un
// domaine à l'autre) plutôt qu'une notion générique côté `common` ; le second
// est un utilitaire TS générique sans lien avec un schéma public, réintroduit
// localement côté `ademe-mapper` (`from-ademe/common.ts`) plutôt qu'ici.
