import { describe, expect, expectTypeOf, it } from "vitest";
import {
	isBatiment,
	type Batiment,
	type Maison,
	type Immeuble,
} from "../../src/batiment/batiment.js";
import type { PositiveNumber } from "../../src/common/common.js";
import { ADRESSE, UUID } from "../helpers.js";

// ─── Types ───────────────────────────────────────────────────────────────────

describe("Batiment — types", () => {
	it("type est une union Maison | Immeuble", () => {
		expectTypeOf<Batiment>().toEqualTypeOf<Maison | Immeuble>();
	});

	it("champ type discrimine maison ou immeuble", () => {
		expectTypeOf<Batiment["type"]>().toEqualTypeOf<"maison" | "immeuble">();
	});

	it("surface_habitable est un PositiveNumber (requis)", () => {
		expectTypeOf<
			Batiment["surface_habitable"]
		>().toEqualTypeOf<PositiveNumber>();
	});

	it("annee_renovation est nullable (requis)", () => {
		expectTypeOf<Batiment["annee_renovation"]>().toEqualTypeOf<number | null>();
	});

	it("rnb_id est nullable (requis)", () => {
		expectTypeOf<Batiment["rnb_id"]>().toEqualTypeOf<string | null>();
	});

	it("Maison a logements limité à 1 | 2", () => {
		expectTypeOf<Maison["logements"]>().toEqualTypeOf<1 | 2>();
	});
});

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_MAISON: unknown = {
	rnb_id: null,
	type: "maison",
	annee_construction: 1990,
	annee_renovation: null,
	altitude: 100,
	logements: 1,
	surface_habitable: 80,
	hauteur_sous_plafond: 2.5,
	materiaux_anciens: false,
	adresse: ADRESSE,
	appartements_visites: [],
	logement: null,
};

const VALID_IMMEUBLE: unknown = {
	rnb_id: null,
	type: "immeuble",
	annee_construction: 1970,
	annee_renovation: 2010,
	altitude: 50,
	logements: 10,
	surface_habitable: 800,
	hauteur_sous_plafond: 2.7,
	materiaux_anciens: false,
	adresse: ADRESSE,
	appartements_visites: [
		{
			id: UUID,
			description: "Appartement T2",
			surface_habitable: 50,
			hauteur_sous_plafond: 2.5,
			position: "etage_intermediaire",
			typologie: "T2",
		},
	],
	logement: null,
};

describe("isBatiment — guard", () => {
	it("accepte une maison valide", () => {
		expect(isBatiment(VALID_MAISON)).toBe(true);
	});

	it("accepte un immeuble valide", () => {
		expect(isBatiment(VALID_IMMEUBLE)).toBe(true);
	});

	it("rejette si type est absent", () => {
		expect(isBatiment({ ...(VALID_MAISON as object), type: undefined })).toBe(
			false,
		);
	});

	it("rejette si type est invalide", () => {
		expect(isBatiment({ ...(VALID_MAISON as object), type: "villa" })).toBe(
			false,
		);
	});

	it("rejette si surface_habitable est absent", () => {
		const { surface_habitable: _, ...rest } = VALID_MAISON as {
			surface_habitable: unknown;
		};
		expect(isBatiment(rest)).toBe(false);
	});

	it("rejette si adresse est absente", () => {
		const { adresse: _, ...rest } = VALID_MAISON as { adresse: unknown };
		expect(isBatiment(rest)).toBe(false);
	});

	it("rejette null", () => {
		expect(isBatiment(null)).toBe(false);
	});

	it("rejette une chaîne vide", () => {
		expect(isBatiment("")).toBe(false);
	});
});
