import { describe, expect, it } from "vitest";
import {
	Porte,
	PorteWithData,
	Position,
	Vitrage,
	isPositionLocalNonChauffe,
	isPositionAutres,
	isVitrageSansVitrage,
	isVitrageAvecVitrage,
	type PositionBase,
	type VitrageBase,
} from "../../src/enveloppe/porte/index.js";

const POSITION_EXTERIEUR: Position = {
	surface: 2,
	mitoyennete: "exterieur",
	local_non_chauffe_id: null,
	paroi_id: null,
	presence_sas: false,
	type_pose: "nu_interieur",
};

const POSITION_LNC: Position = {
	surface: 1.8,
	mitoyennete: "local_non_chauffe",
	local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
	paroi_id: null,
	presence_sas: true,
	type_pose: "nu_interieur",
};

const VITRAGE_SANS: Vitrage = { surface: 0, type: null };
const VITRAGE_AVEC: Vitrage = { surface: 0.5, type: "simple_vitrage" };

const PORTE_VALIDE: Porte = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Porte d'entrée",
	isolation: true,
	materiau: "pvc",
	annee_installation: 2015,
	u: 1.5,
	position: POSITION_EXTERIEUR,
	menuiserie: { largeur_dormant: null, presence_joint: null, presence_retour_isolation: null },
	vitrage: VITRAGE_SANS,
};

const PORTE_LNC: Porte = {
	...PORTE_VALIDE,
	id: "550e8400-e29b-41d4-a716-446655440002",
	position: POSITION_LNC,
};

describe("Porte.position — branches LocalNonChauffe / Autres", () => {
	it.each([
		["local_non_chauffe", PORTE_LNC],
		["autres mitoyennetés", PORTE_VALIDE],
	] as const)("%s valide", (_label, fixture) => {
		expect(Porte.safeParse(fixture).success).toBe(true);
	});

	it("rejette mitoyennete=local_non_chauffe avec local_non_chauffe_id=null", () => {
		const invalide = { ...PORTE_LNC, position: { ...POSITION_LNC, local_non_chauffe_id: null } };
		expect(Porte.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=exterieur avec local_non_chauffe_id renseigné (non_applicable non respecté)", () => {
		const invalide = {
			...PORTE_VALIDE,
			position: { ...POSITION_EXTERIEUR, local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099" },
		};
		expect(Porte.safeParse(invalide).success).toBe(false);
	});
});

describe("Porte.vitrage — branches SansVitrage / AvecVitrage", () => {
	it.each([
		["sans vitrage (surface=0)", VITRAGE_SANS],
		["avec vitrage (surface>0)", VITRAGE_AVEC],
	] as const)("%s valide", (_label, vitrage) => {
		expect(Porte.safeParse({ ...PORTE_VALIDE, vitrage }).success).toBe(true);
	});

	it("rejette surface=0 avec un type renseigné (non_applicable non respecté)", () => {
		const invalide = { ...PORTE_VALIDE, vitrage: { surface: 0, type: "simple_vitrage" } };
		expect(Porte.safeParse(invalide).success).toBe(false);
	});

	it("rejette surface négative", () => {
		const invalide = { ...PORTE_VALIDE, vitrage: { surface: -1, type: null } };
		expect(Porte.safeParse(invalide).success).toBe(false);
	});
});

describe("Guards Porte", () => {
	it("isPositionLocalNonChauffe / isPositionAutres", () => {
		expect(isPositionLocalNonChauffe(POSITION_LNC as PositionBase)).toBe(true);
		expect(isPositionAutres(POSITION_LNC as PositionBase)).toBe(false);
		expect(isPositionAutres(POSITION_EXTERIEUR as PositionBase)).toBe(true);
	});

	it("isVitrageSansVitrage / isVitrageAvecVitrage", () => {
		expect(isVitrageSansVitrage(VITRAGE_SANS as VitrageBase)).toBe(true);
		expect(isVitrageAvecVitrage(VITRAGE_SANS as VitrageBase)).toBe(false);
		expect(isVitrageAvecVitrage(VITRAGE_AVEC as VitrageBase)).toBe(true);
	});
});

describe("Porte — champs propres", () => {
	it("accepte materiau/isolation nuls", () => {
		expect(Porte.safeParse({ ...PORTE_VALIDE, materiau: null, isolation: null }).success).toBe(true);
	});

	it("rejette materiau hors enum", () => {
		expect(Porte.safeParse({ ...PORTE_VALIDE, materiau: "invalide" }).success).toBe(false);
	});

	it("rejette u négatif ou nul", () => {
		expect(Porte.safeParse({ ...PORTE_VALIDE, u: 0 }).success).toBe(false);
	});
});

describe("PorteWithData", () => {
	it("accepte une Porte avec data complet", () => {
		const valide = { ...PORTE_VALIDE, data: { sdep: 2, b: 1, dp: 0, u: 1.5 } };
		expect(PorteWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette une Porte sans data", () => {
		expect(PorteWithData.safeParse(PORTE_VALIDE).success).toBe(false);
	});
});
