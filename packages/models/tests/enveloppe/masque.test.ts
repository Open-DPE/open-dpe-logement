import { describe, expect, expectTypeOf, it } from "vitest";
import {
	isMasque,
	type Masque,
	type TypeMasque,
	type MasqueLointainNonHomogene,
} from "../../src/enveloppe/masque.js";

// ─── Types ───────────────────────────────────────────────────────────────────

describe("Masque — types", () => {
	it("type est requis", () => {
		expectTypeOf<Masque["type"]>().toEqualTypeOf<TypeMasque>();
	});

	it("hauteur est nullable", () => {
		expectTypeOf<Masque["hauteur"]>().toEqualTypeOf<number | null>();
	});

	it("MasqueLointainNonHomogene a secteur obligatoire", () => {
		expectTypeOf<MasqueLointainNonHomogene["secteur"]>().not.toBeNull();
		expectTypeOf<
			MasqueLointainNonHomogene["hauteur"]
		>().toEqualTypeOf<number>();
	});
});

// ─── Guards ──────────────────────────────────────────────────────────────────

const VALID_MASQUE_HOMOGENE: unknown = {
	description: "Bâtiment voisin",
	type: "homogene",
	hauteur: 10,
	profondeur: null,
	secteur: null,
};

const VALID_MASQUE_PAROI_LATERALE: unknown = {
	description: "Paroi latérale",
	type: "paroi_laterale_sans_obstacle_au_sud",
	hauteur: null,
	profondeur: null,
	secteur: null,
};

const VALID_MASQUE_NON_HOMOGENE: unknown = {
	description: "Masque non homogène",
	type: "non_homogene",
	hauteur: 8,
	profondeur: null,
	secteur: "central",
};

describe("isMasque — guard", () => {
	it("accepte un masque lointain homogène valide", () => {
		expect(isMasque(VALID_MASQUE_HOMOGENE)).toBe(true);
	});

	it("accepte un masque proche paroi latérale valide", () => {
		expect(isMasque(VALID_MASQUE_PAROI_LATERALE)).toBe(true);
	});

	it("accepte un masque lointain non homogène valide", () => {
		expect(isMasque(VALID_MASQUE_NON_HOMOGENE)).toBe(true);
	});

	it("rejette si type est invalide", () => {
		expect(
			isMasque({ ...(VALID_MASQUE_HOMOGENE as object), type: "rideau_arbres" }),
		).toBe(false);
	});

	it("rejette si type est absent", () => {
		const { type: _, ...rest } = VALID_MASQUE_HOMOGENE as { type: unknown };
		expect(isMasque(rest)).toBe(false);
	});

	it("rejette null", () => {
		expect(isMasque(null)).toBe(false);
	});
});
