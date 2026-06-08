import { describe, expect, expectTypeOf, it } from "vitest";
import {
	isGenerateur,
	type Generateur,
	type PAC,
	type ReseauChaleur,
	type PoeleBouilleur,
} from "../../src/chauffage/generateur.js";
import { UUID } from "../helpers.js";

// ─── Types ───────────────────────────────────────────────────────────────────

describe("Generateur chauffage — types", () => {
	it("est une union de variantes", () => {
		expectTypeOf<Generateur>().toEqualTypeOf<Generateur>();
	});

	it("PAC a energie electricite", () => {
		expectTypeOf<PAC["energie"]>().toEqualTypeOf<"electricite">();
	});

	it("ReseauChaleur a energie reseau_chaleur", () => {
		expectTypeOf<ReseauChaleur["energie"]>().toEqualTypeOf<"reseau_chaleur">();
	});

	it("PoeleBouilleur a energie bois", () => {
		expectTypeOf<PoeleBouilleur["energie"]>().toEqualTypeOf<
			"bois_buche" | "bois_plaquette" | "bois_granule"
		>();
	});
});

// ─── Fixtures ────────────────────────────────────────────────────────────────

const BASE_POSITION = {
	cascade: null,
	position_chaudiere: null,
	generateur_collectif: false,
	generateur_multi_batiment: false,
	position_volume_chauffe: false,
	generateur_mixte_id: null,
	reseau_chaleur_id: null,
};

const BASE_SIGNALETIQUE = {
	pn: null,
	label: null,
	scop: null,
	mode_combustion: null,
	presence_ventouse: null,
	presence_regulation: null,
	pveilleuse: null,
	qp0: null,
	rpn: null,
	rpint: null,
	tfonc30: null,
	tfonc100: null,
};

const VALID_PAC: unknown = {
	id: UUID,
	description: "PAC air/eau",
	type: "pac_air_eau",
	energie: "electricite",
	bienergie: null,
	annee_installation: 2015,
	position: { ...BASE_POSITION },
	signaletique: { ...BASE_SIGNALETIQUE, scop: 3.5, pn: 8 },
};

const VALID_RESEAU_CHALEUR: unknown = {
	id: UUID,
	description: "Réseau de chaleur urbain",
	type: "reseau_chaleur",
	energie: "reseau_chaleur",
	bienergie: null,
	annee_installation: null,
	position: {
		...BASE_POSITION,
		generateur_collectif: true,
		generateur_multi_batiment: true,
		position_volume_chauffe: false,
	},
	signaletique: { ...BASE_SIGNALETIQUE },
};

const VALID_POELE_BOIS: unknown = {
	id: UUID,
	description: "Poêle bouilleur bois",
	type: "poele_bouilleur",
	energie: "bois_granule",
	bienergie: null,
	annee_installation: 2018,
	position: {
		...BASE_POSITION,
		cascade: null,
		position_chaudiere: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
	},
	signaletique: { ...BASE_SIGNALETIQUE, pn: 15 },
};

// ─── Guards ──────────────────────────────────────────────────────────────────

describe("isGenerateur chauffage — guard", () => {
	it("accepte une PAC valide", () => {
		expect(isGenerateur(VALID_PAC)).toBe(true);
	});

	it("accepte un réseau de chaleur valide", () => {
		expect(isGenerateur(VALID_RESEAU_CHALEUR)).toBe(true);
	});

	it("accepte un poêle bouilleur bois valide", () => {
		expect(isGenerateur(VALID_POELE_BOIS)).toBe(true);
	});

	it("rejette si type est invalide", () => {
		expect(isGenerateur({ ...(VALID_PAC as object), type: "cheminee" })).toBe(
			false,
		);
	});

	it("rejette si id est absent", () => {
		const { id: _, ...rest } = VALID_PAC as { id: unknown };
		expect(isGenerateur(rest)).toBe(false);
	});

	it("rejette si position est absent", () => {
		const { position: _, ...rest } = VALID_PAC as { position: unknown };
		expect(isGenerateur(rest)).toBe(false);
	});

	it("rejette si energie est invalide", () => {
		expect(isGenerateur({ ...(VALID_PAC as object), energie: "vapeur" })).toBe(
			false,
		);
	});

	it("rejette null", () => {
		expect(isGenerateur(null)).toBe(false);
	});
});
