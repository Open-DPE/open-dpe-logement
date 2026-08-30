import { describe, expect, it } from "vitest";
import {
	Masque,
	MasqueLointainHomogene,
	MasqueLointainNonHomogene,
	MasqueProcheParoiLaterale,
	MasqueProcheFondBalconOuLoggias,
	MasqueProcheBalconOuAuvent,
	isMasqueLointainHomogene,
	isMasqueLointainNonHomogene,
	isMasqueProcheParoiLaterale,
	isMasqueProcheFondBalconOuLoggias,
	isMasqueProcheBalconOuAuvent,
	type MasqueBase,
} from "../../src/enveloppe/masque/index.js";

const HOMOGENE: MasqueLointainHomogene = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Masque lointain homogène",
	type: "homogene",
	hauteur: 20,
	profondeur: null,
	secteur: null,
};

const NON_HOMOGENE: MasqueLointainNonHomogene = {
	...HOMOGENE,
	id: "550e8400-e29b-41d4-a716-446655440002",
	type: "non_homogene",
	secteur: "central",
};

const PAROI_LATERALE: MasqueProcheParoiLaterale = {
	id: "550e8400-e29b-41d4-a716-446655440003",
	description: "Paroi latérale sans obstacle au sud",
	type: "paroi_laterale_sans_obstacle_au_sud",
	hauteur: null,
	profondeur: null,
	secteur: null,
};

const FOND_BALCON: MasqueProcheFondBalconOuLoggias = {
	id: "550e8400-e29b-41d4-a716-446655440004",
	description: "Fond de balcon",
	type: "fond_balcon",
	hauteur: null,
	profondeur: 1.5,
	secteur: null,
};

const BALCON_OU_AUVENT: MasqueProcheBalconOuAuvent = {
	id: "550e8400-e29b-41d4-a716-446655440005",
	description: "Balcon ou auvent",
	type: "balcon_ou_auvent",
	hauteur: null,
	profondeur: 1,
	secteur: null,
};

describe("Masque — chaque branche de l'union valide (safeParse)", () => {
	it.each([
		["MasqueLointainHomogene", MasqueLointainHomogene, HOMOGENE],
		["MasqueLointainNonHomogene", MasqueLointainNonHomogene, NON_HOMOGENE],
		["MasqueProcheParoiLaterale", MasqueProcheParoiLaterale, PAROI_LATERALE],
		["MasqueProcheFondBalconOuLoggias", MasqueProcheFondBalconOuLoggias, FOND_BALCON],
		["MasqueProcheBalconOuAuvent", MasqueProcheBalconOuAuvent, BALCON_OU_AUVENT],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(Masque.safeParse(fixture).success).toBe(true);
	});
});

describe("Masque — hauteur bornée en ]0, 90[", () => {
	it("accepte hauteur=89.9", () => {
		expect(MasqueLointainHomogene.safeParse({ ...HOMOGENE, hauteur: 89.9 }).success).toBe(true);
	});

	it("rejette hauteur=90 (borne exclusive)", () => {
		expect(MasqueLointainHomogene.safeParse({ ...HOMOGENE, hauteur: 90 }).success).toBe(false);
	});

	it("rejette hauteur=0 (nombre_positif exclut 0)", () => {
		expect(MasqueLointainHomogene.safeParse({ ...HOMOGENE, hauteur: 0 }).success).toBe(false);
	});
});

describe("Masque — profondeur strictement positive", () => {
	it("rejette profondeur=0", () => {
		expect(MasqueProcheFondBalconOuLoggias.safeParse({ ...FOND_BALCON, profondeur: 0 }).success).toBe(
			false,
		);
	});

	it("rejette profondeur négative", () => {
		expect(MasqueProcheBalconOuAuvent.safeParse({ ...BALCON_OU_AUVENT, profondeur: -1 }).success).toBe(
			false,
		);
	});
});

describe("Masque — non_applicable forcés par branche", () => {
	it("rejette MasqueLointainHomogene avec profondeur renseignée", () => {
		expect(MasqueLointainHomogene.safeParse({ ...HOMOGENE, profondeur: 1 }).success).toBe(false);
	});

	it("rejette MasqueLointainHomogene avec secteur renseigné", () => {
		expect(MasqueLointainHomogene.safeParse({ ...HOMOGENE, secteur: "central" }).success).toBe(false);
	});

	it("rejette MasqueLointainNonHomogene sans secteur (requis pour cette branche)", () => {
		expect(MasqueLointainNonHomogene.safeParse({ ...NON_HOMOGENE, secteur: null }).success).toBe(false);
	});

	it("rejette MasqueProcheParoiLaterale avec hauteur renseignée", () => {
		expect(MasqueProcheParoiLaterale.safeParse({ ...PAROI_LATERALE, hauteur: 10 }).success).toBe(false);
	});

	it("rejette MasqueProcheFondBalconOuLoggias avec hauteur renseignée", () => {
		expect(MasqueProcheFondBalconOuLoggias.safeParse({ ...FOND_BALCON, hauteur: 10 }).success).toBe(
			false,
		);
	});

	it("rejette MasqueProcheBalconOuAuvent sans profondeur (requise pour cette branche)", () => {
		expect(MasqueProcheBalconOuAuvent.safeParse({ ...BALCON_OU_AUVENT, profondeur: null }).success).toBe(
			false,
		);
	});
});

describe("Guards Masque", () => {
	it("distingue les 5 branches par type", () => {
		expect(isMasqueLointainHomogene(HOMOGENE as MasqueBase)).toBe(true);
		expect(isMasqueLointainNonHomogene(NON_HOMOGENE as MasqueBase)).toBe(true);
		expect(isMasqueProcheParoiLaterale(PAROI_LATERALE as MasqueBase)).toBe(true);
		expect(isMasqueProcheFondBalconOuLoggias(FOND_BALCON as MasqueBase)).toBe(true);
		expect(isMasqueProcheBalconOuAuvent(BALCON_OU_AUVENT as MasqueBase)).toBe(true);
		expect(isMasqueLointainHomogene(NON_HOMOGENE as MasqueBase)).toBe(false);
	});
});
