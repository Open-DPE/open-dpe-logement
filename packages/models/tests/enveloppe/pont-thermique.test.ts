import { describe, expect, it } from "vitest";
import {
	PontThermique,
	PontThermiqueWithData,
	LiaisonPlancher,
	LiaisonMenuiserie,
	LiaisonRefendOuIntermediaire,
	isLiaisonPlancher,
	isLiaisonMenuiserie,
	isLiaisonRefendOuIntermediaire,
	type LiaisonBase,
} from "../../src/enveloppe/pont-thermique/index.js";

const LIAISON_PLANCHER: LiaisonPlancher = {
	type: "plancher_bas_mur",
	mur_id: "550e8400-e29b-41d4-a716-446655440001",
	plancher_id: "550e8400-e29b-41d4-a716-446655440002",
	ouverture_id: null,
	pont_thermique_partiel: false,
};

const LIAISON_MENUISERIE: LiaisonMenuiserie = {
	type: "baie_mur",
	mur_id: "550e8400-e29b-41d4-a716-446655440001",
	plancher_id: null,
	ouverture_id: "550e8400-e29b-41d4-a716-446655440003",
	pont_thermique_partiel: false,
};

const LIAISON_REFEND: LiaisonRefendOuIntermediaire = {
	type: "refend_mur",
	mur_id: "550e8400-e29b-41d4-a716-446655440001",
	plancher_id: null,
	ouverture_id: null,
	pont_thermique_partiel: false,
};

const PONT_THERMIQUE_VALIDE: PontThermique = {
	id: "550e8400-e29b-41d4-a716-446655440010",
	description: "Liaison plancher bas / mur",
	longueur: 12,
	kpt: 0.5,
	liaison: LIAISON_PLANCHER,
};

describe("PontThermique.liaison — chaque branche de l'union valide (safeParse)", () => {
	it.each([
		["LiaisonPlancher", LiaisonPlancher, LIAISON_PLANCHER],
		["LiaisonMenuiserie", LiaisonMenuiserie, LIAISON_MENUISERIE],
		["LiaisonRefendOuIntermediaire", LiaisonRefendOuIntermediaire, LIAISON_REFEND],
	] as const)("%s", (_label, schema, liaison) => {
		expect(schema.safeParse(liaison).success).toBe(true);
		expect(PontThermique.safeParse({ ...PONT_THERMIQUE_VALIDE, liaison }).success).toBe(true);
	});
});

describe("Liaison — non_applicable croisés selon le type", () => {
	it("rejette LiaisonPlancher avec ouverture_id renseigné", () => {
		const invalide = { ...LIAISON_PLANCHER, ouverture_id: "550e8400-e29b-41d4-a716-446655440003" };
		expect(LiaisonPlancher.safeParse(invalide).success).toBe(false);
	});

	it("rejette LiaisonPlancher avec plancher_id=null (requis pour cette branche)", () => {
		expect(LiaisonPlancher.safeParse({ ...LIAISON_PLANCHER, plancher_id: null }).success).toBe(false);
	});

	it("rejette LiaisonMenuiserie avec plancher_id renseigné", () => {
		const invalide = { ...LIAISON_MENUISERIE, plancher_id: "550e8400-e29b-41d4-a716-446655440002" };
		expect(LiaisonMenuiserie.safeParse(invalide).success).toBe(false);
	});

	it("rejette LiaisonMenuiserie avec ouverture_id=null (requis pour cette branche)", () => {
		expect(LiaisonMenuiserie.safeParse({ ...LIAISON_MENUISERIE, ouverture_id: null }).success).toBe(
			false,
		);
	});

	it("rejette LiaisonRefendOuIntermediaire avec plancher_id ou ouverture_id renseignés", () => {
		expect(
			LiaisonRefendOuIntermediaire.safeParse({
				...LIAISON_REFEND,
				plancher_id: "550e8400-e29b-41d4-a716-446655440002",
			}).success,
		).toBe(false);
		expect(
			LiaisonRefendOuIntermediaire.safeParse({
				...LIAISON_REFEND,
				ouverture_id: "550e8400-e29b-41d4-a716-446655440003",
			}).success,
		).toBe(false);
	});
});

describe("Liaison.pont_thermique_partiel — contraint par type (régression §8.5 du rapport correctifs)", () => {
	it.each([
		["LiaisonPlancher", LiaisonPlancher, LIAISON_PLANCHER],
		["LiaisonMenuiserie", LiaisonMenuiserie, LIAISON_MENUISERIE],
	] as const)("rejette %s avec pont_thermique_partiel=true (seul false est autorisé)", (_label, schema, liaison) => {
		expect(schema.safeParse({ ...liaison, pont_thermique_partiel: true }).success).toBe(false);
	});

	it.each([true, false] as const)(
		"accepte LiaisonRefendOuIntermediaire avec pont_thermique_partiel=%s (seule variante à accepter un booléen réel)",
		(pont_thermique_partiel) => {
			expect(
				LiaisonRefendOuIntermediaire.safeParse({ ...LIAISON_REFEND, pont_thermique_partiel }).success,
			).toBe(true);
		},
	);
});

describe("Guards Liaison", () => {
	it("distingue les 3 branches par type", () => {
		expect(isLiaisonPlancher(LIAISON_PLANCHER as LiaisonBase)).toBe(true);
		expect(isLiaisonMenuiserie(LIAISON_MENUISERIE as LiaisonBase)).toBe(true);
		expect(isLiaisonRefendOuIntermediaire(LIAISON_REFEND as LiaisonBase)).toBe(true);
		expect(isLiaisonPlancher(LIAISON_MENUISERIE as LiaisonBase)).toBe(false);
	});
});

describe("PontThermique — champs propres", () => {
	it("rejette longueur négative ou nulle", () => {
		expect(PontThermique.safeParse({ ...PONT_THERMIQUE_VALIDE, longueur: 0 }).success).toBe(false);
	});

	it("accepte kpt=null", () => {
		expect(PontThermique.safeParse({ ...PONT_THERMIQUE_VALIDE, kpt: null }).success).toBe(true);
	});
});

describe("PontThermiqueWithData", () => {
	it("accepte un PontThermique avec data complet", () => {
		const valide: PontThermiqueWithData = { ...PONT_THERMIQUE_VALIDE, data: { pt: 0.5, kpt: 6 } };
		expect(PontThermiqueWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette un PontThermique sans data", () => {
		expect(PontThermiqueWithData.safeParse(PONT_THERMIQUE_VALIDE).success).toBe(false);
	});
});
