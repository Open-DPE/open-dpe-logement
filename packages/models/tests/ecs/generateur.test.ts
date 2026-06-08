import { describe, expect, expectTypeOf, it } from "vitest";
import {
	isGenerateur,
	type Generateur,
	type ChauffeEauElectrique,
	type ReseauChaleur,
	type ChauffeEauThermodynamique,
} from "../../src/ecs/generateur.js";
import { UUID } from "../helpers.js";

// ─── Types ───────────────────────────────────────────────────────────────────

describe("Generateur ECS — types", () => {
	it("est une union de variantes", () => {
		expectTypeOf<Generateur>().toEqualTypeOf<Generateur>();
	});

	it("ChauffeEauElectrique a energie electricite", () => {
		expectTypeOf<
			ChauffeEauElectrique["energie"]
		>().toEqualTypeOf<"electricite">();
	});

	it("ReseauChaleur a energie reseau_chaleur", () => {
		expectTypeOf<ReseauChaleur["energie"]>().toEqualTypeOf<"reseau_chaleur">();
	});
});

// ─── Guards ──────────────────────────────────────────────────────────────────

const BASE_SIGNALETIQUE = {
	pn: null,
	cop: null,
	label: null,
	mode_combustion: null,
	presence_ventouse: null,
	pveilleuse: null,
	qp0: null,
	rpn: null,
};

const VALID_CHAUFFE_EAU_ELECTRIQUE: unknown = {
	id: UUID,
	description: "Chauffe-eau électrique vertical",
	type: "chauffe_eau",
	energie: "electricite",
	bienergie: null,
	annee_installation: 2015,
	position: {
		position_chauffe_eau: "chauffe_eau_vertical",
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: null,
	signaletique: { ...BASE_SIGNALETIQUE, pn: 2.5 },
};

const VALID_RESEAU_CHALEUR: unknown = {
	id: UUID,
	description: "Réseau de chaleur ECS",
	type: "reseau_chaleur",
	energie: "reseau_chaleur",
	bienergie: null,
	annee_installation: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: true,
		generateur_multi_batiment: true,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: null,
	signaletique: { ...BASE_SIGNALETIQUE },
};

const VALID_CET_AIR_AMBIANT: unknown = {
	id: UUID,
	description: "Chauffe-eau thermodynamique air ambiant",
	type: "cet_air_ambiant",
	energie: "electricite",
	bienergie: null,
	annee_installation: 2020,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: null,
	signaletique: { ...BASE_SIGNALETIQUE, cop: 2.8 },
};

describe("isGenerateur ECS — guard", () => {
	it("accepte un chauffe-eau électrique valide", () => {
		expect(isGenerateur(VALID_CHAUFFE_EAU_ELECTRIQUE)).toBe(true);
	});

	it("accepte un réseau de chaleur ECS valide", () => {
		expect(isGenerateur(VALID_RESEAU_CHALEUR)).toBe(true);
	});

	it("accepte un chauffe-eau thermodynamique air ambiant valide", () => {
		expect(isGenerateur(VALID_CET_AIR_AMBIANT)).toBe(true);
	});

	it("rejette si type est invalide", () => {
		expect(
			isGenerateur({
				...(VALID_CHAUFFE_EAU_ELECTRIQUE as object),
				type: "ballon_thermodynamique",
			}),
		).toBe(false);
	});

	it("rejette si id est absent", () => {
		const { id: _, ...rest } = VALID_CHAUFFE_EAU_ELECTRIQUE as { id: unknown };
		expect(isGenerateur(rest)).toBe(false);
	});

	it("rejette null", () => {
		expect(isGenerateur(null)).toBe(false);
	});
});
