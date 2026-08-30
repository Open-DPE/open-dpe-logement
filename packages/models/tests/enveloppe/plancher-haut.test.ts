import { describe, expect, it } from "vitest";
import { PlancherHaut, PlancherHautWithData } from "../../src/enveloppe/plancher-haut/index.js";

const PLANCHER_HAUT_EXTERIEUR: PlancherHaut = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Combles perdus",
	configuration: "plancher",
	type: "dalle_beton",
	inertie: "lourde",
	annee_construction: 1975,
	annee_renovation: null,
	u0: 1.2,
	u: 1,
	position: { surface: 30, mitoyennete: "exterieur", local_non_chauffe_id: null },
	isolation: {
		etat: false,
		type: null,
		annee_installation: null,
		epaisseur: null,
		resistance_thermique: null,
	},
};

const PLANCHER_HAUT_LOCAL_NON_CHAUFFE: PlancherHaut = {
	...PLANCHER_HAUT_EXTERIEUR,
	id: "550e8400-e29b-41d4-a716-446655440002",
	position: {
		surface: 15,
		mitoyennete: "local_non_chauffe",
		local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
	},
};

describe("PlancherHaut.position — branches du polymorphisme Position (commun aux parois)", () => {
	it.each([
		["local_non_chauffe", PLANCHER_HAUT_LOCAL_NON_CHAUFFE],
		["autres mitoyennetés", PLANCHER_HAUT_EXTERIEUR],
	] as const)("%s valide", (_label, fixture) => {
		expect(PlancherHaut.safeParse(fixture).success).toBe(true);
	});

	it("rejette mitoyennete=local_non_chauffe avec local_non_chauffe_id=null", () => {
		const invalide = {
			...PLANCHER_HAUT_LOCAL_NON_CHAUFFE,
			position: {
				...PLANCHER_HAUT_LOCAL_NON_CHAUFFE.position,
				local_non_chauffe_id: null,
			},
		};
		expect(PlancherHaut.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=exterieur avec local_non_chauffe_id renseigné (non_applicable non respecté)", () => {
		const invalide = {
			...PLANCHER_HAUT_EXTERIEUR,
			position: {
				...PLANCHER_HAUT_EXTERIEUR.position,
				local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
			},
		};
		expect(PlancherHaut.safeParse(invalide).success).toBe(false);
	});
});

describe("PlancherHaut.isolation — branches du polymorphisme Isolation (commun aux parois)", () => {
	it.each([
		[
			"SansIsolation",
			{ etat: false, type: null, annee_installation: null, epaisseur: null, resistance_thermique: null },
		],
		[
			"IsolationInconnue",
			{ etat: null, type: null, annee_installation: null, epaisseur: null, resistance_thermique: null },
		],
		[
			"TypeIsolationInconnue",
			{ etat: true, type: null, annee_installation: null, epaisseur: null, resistance_thermique: null },
		],
		[
			"IsolationConnue",
			{ etat: true, type: "iti", annee_installation: 2018, epaisseur: 200, resistance_thermique: 6 },
		],
	] as const)("%s valide", (_label, isolation) => {
		expect(PlancherHaut.safeParse({ ...PLANCHER_HAUT_EXTERIEUR, isolation }).success).toBe(true);
	});

	it("rejette IsolationConnue sans type (type est requis, non nullable, pour cette branche)", () => {
		const invalide = {
			...PLANCHER_HAUT_EXTERIEUR,
			isolation: {
				etat: true,
				type: null,
				annee_installation: 2018,
				epaisseur: 200,
				resistance_thermique: 6,
			},
		};
		// etat=true + type=null correspond en réalité à TypeIsolationInconnue, qui force
		// epaisseur/resistance_thermique/annee_installation à non_applicable : ce document
		// ne matche donc aucune des 4 branches d'Isolation.
		expect(PlancherHaut.safeParse(invalide).success).toBe(false);
	});
});

describe("PlancherHaut — champs propres", () => {
	it("configuration est requis et hors enum est rejeté", () => {
		expect(PlancherHaut.safeParse({ ...PLANCHER_HAUT_EXTERIEUR, configuration: "invalide" }).success).toBe(
			false,
		);
		const { configuration, ...sansConfiguration } = PLANCHER_HAUT_EXTERIEUR;
		expect(PlancherHaut.safeParse(sansConfiguration).success).toBe(false);
	});

	it("accepte type=null (nullable)", () => {
		expect(PlancherHaut.safeParse({ ...PLANCHER_HAUT_EXTERIEUR, type: null }).success).toBe(true);
	});

	it("rejette u0/u négatifs ou nuls (nombre_positif)", () => {
		expect(PlancherHaut.safeParse({ ...PLANCHER_HAUT_EXTERIEUR, u0: 0 }).success).toBe(false);
		expect(PlancherHaut.safeParse({ ...PLANCHER_HAUT_EXTERIEUR, u: -0.5 }).success).toBe(false);
	});

	it("rejette annee_renovation non entière", () => {
		expect(PlancherHaut.safeParse({ ...PLANCHER_HAUT_EXTERIEUR, annee_renovation: 2001.5 }).success).toBe(
			false,
		);
	});
});

describe("PlancherHautWithData", () => {
	it("accepte un PlancherHaut avec data complet", () => {
		const valide: PlancherHautWithData = {
			...PLANCHER_HAUT_EXTERIEUR,
			data: { sdep: 30, b: 1, dp: 0, u: 1, u0: 1.2 },
		};
		expect(PlancherHautWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette un PlancherHaut sans data", () => {
		expect(PlancherHautWithData.safeParse(PLANCHER_HAUT_EXTERIEUR).success).toBe(false);
	});
});
