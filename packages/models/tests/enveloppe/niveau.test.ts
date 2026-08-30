import { describe, expect, it } from "vitest";
import { Niveau, NiveauWithData } from "../../src/enveloppe/niveau/index.js";

const NIVEAU_VALIDE: Niveau = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "RDC",
	surface: 80,
	inertie_paroi_verticale: "lourde",
	inertie_plancher_bas: "legere",
	inertie_plancher_haut: null,
};

describe("Niveau — champs de base", () => {
	it("accepte un niveau valide", () => {
		expect(Niveau.safeParse(NIVEAU_VALIDE).success).toBe(true);
	});

	it("accepte les 3 champs d'inertie à null", () => {
		const valide = {
			...NIVEAU_VALIDE,
			inertie_paroi_verticale: null,
			inertie_plancher_bas: null,
			inertie_plancher_haut: null,
		};
		expect(Niveau.safeParse(valide).success).toBe(true);
	});

	it("rejette surface=0 (nombre_positif exclut 0)", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, surface: 0 }).success).toBe(false);
	});

	it("rejette surface négative", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, surface: -10 }).success).toBe(false);
	});

	it("accepte une surface juste au-dessus de 0", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, surface: 0.01 }).success).toBe(true);
	});

	it("rejette inertie_paroi_verticale hors enum", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, inertie_paroi_verticale: "invalide" }).success).toBe(
			false,
		);
	});

	it("rejette inertie_plancher_bas hors enum", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, inertie_plancher_bas: "invalide" }).success).toBe(false);
	});

	it("rejette inertie_plancher_haut hors enum", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, inertie_plancher_haut: "invalide" }).success).toBe(false);
	});

	it("rejette un id qui n'est pas un uuid", () => {
		expect(Niveau.safeParse({ ...NIVEAU_VALIDE, id: "pas-un-uuid" }).success).toBe(false);
	});
});

describe("NiveauWithData", () => {
	it("accepte un Niveau avec data.inertie (4 classes 3CL-DPE)", () => {
		const valide: NiveauWithData = { ...NIVEAU_VALIDE, data: { inertie: "tres_lourde" } };
		expect(NiveauWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette un Niveau sans data", () => {
		expect(NiveauWithData.safeParse(NIVEAU_VALIDE).success).toBe(false);
	});

	it("rejette data.inertie hors enum (non nullable, contrairement aux inerties par paroi)", () => {
		const invalide = { ...NIVEAU_VALIDE, data: { inertie: null } };
		expect(NiveauWithData.safeParse(invalide).success).toBe(false);
	});
});
