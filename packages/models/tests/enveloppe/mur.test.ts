import { describe, expect, it } from "vitest";
import { Mur, MurWithData, type Structure } from "../../src/enveloppe/mur/index.js";

const STRUCTURE: Structure = {
	materiau: "brique_creuse",
	epaisseur: 20,
	materiau_ancien: false,
};

const MUR_EXTERIEUR: Mur = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Mur extérieur",
	structures: [STRUCTURE],
	type_doublage: "sans_doublage",
	presence_enduit_isolant: false,
	inertie: "lourde",
	annee_construction: 1975,
	annee_renovation: null,
	u0: 1.2,
	u: 1,
	position: { surface: 10, mitoyennete: "exterieur", local_non_chauffe_id: null },
	isolation: {
		etat: false,
		type: null,
		annee_installation: null,
		epaisseur: null,
		resistance_thermique: null,
	},
};

const MUR_LOCAL_NON_CHAUFFE: Mur = {
	...MUR_EXTERIEUR,
	id: "550e8400-e29b-41d4-a716-446655440002",
	position: {
		surface: 8,
		mitoyennete: "local_non_chauffe",
		local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
	},
};

describe("Mur.position — branches du polymorphisme Position (commun aux parois)", () => {
	it.each([
		["local_non_chauffe", MUR_LOCAL_NON_CHAUFFE],
		["autres mitoyennetés", MUR_EXTERIEUR],
	] as const)("%s valide", (_label, fixture) => {
		expect(Mur.safeParse(fixture).success).toBe(true);
	});

	it("rejette mitoyennete=local_non_chauffe avec local_non_chauffe_id=null", () => {
		const invalide = {
			...MUR_LOCAL_NON_CHAUFFE,
			position: { ...MUR_LOCAL_NON_CHAUFFE.position, local_non_chauffe_id: null },
		};
		expect(Mur.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=exterieur avec local_non_chauffe_id renseigné (non_applicable non respecté)", () => {
		const invalide = {
			...MUR_EXTERIEUR,
			position: {
				...MUR_EXTERIEUR.position,
				local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
			},
		};
		expect(Mur.safeParse(invalide).success).toBe(false);
	});
});

describe("Mur.isolation — branches du polymorphisme Isolation (commun aux parois)", () => {
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
			{ etat: true, type: "ite", annee_installation: 2015, epaisseur: 100, resistance_thermique: 3.5 },
		],
	] as const)("%s valide", (_label, isolation) => {
		expect(Mur.safeParse({ ...MUR_EXTERIEUR, isolation }).success).toBe(true);
	});

	it("rejette TypeIsolationInconnue avec resistance_thermique renseignée (non_applicable non respecté)", () => {
		const invalide = {
			...MUR_EXTERIEUR,
			isolation: {
				etat: true,
				type: null,
				annee_installation: null,
				epaisseur: null,
				resistance_thermique: 2,
			},
		};
		expect(Mur.safeParse(invalide).success).toBe(false);
	});

	it("rejette SansIsolation avec annee_installation renseignée (non_applicable non respecté)", () => {
		const invalide = {
			...MUR_EXTERIEUR,
			isolation: {
				etat: false,
				type: null,
				annee_installation: 2000,
				epaisseur: null,
				resistance_thermique: null,
			},
		};
		expect(Mur.safeParse(invalide).success).toBe(false);
	});
});

describe("Mur.structures — contraintes du sous-schéma Structure", () => {
	it("accepte une structure avec matériau connu", () => {
		expect(Mur.safeParse(MUR_EXTERIEUR).success).toBe(true);
	});

	it("rejette une structure avec matériau hors enum", () => {
		const invalide = {
			...MUR_EXTERIEUR,
			structures: [{ ...STRUCTURE, materiau: "materiau_inconnu" }],
		};
		expect(Mur.safeParse(invalide).success).toBe(false);
	});

	it("rejette une structure avec épaisseur négative ou nulle", () => {
		const invalide = {
			...MUR_EXTERIEUR,
			structures: [{ ...STRUCTURE, epaisseur: 0 }],
		};
		expect(Mur.safeParse(invalide).success).toBe(false);
	});
});

describe("Mur — contraintes numériques", () => {
	it("rejette annee_construction non entière", () => {
		const invalide = { ...MUR_EXTERIEUR, annee_construction: 1975.5 };
		expect(Mur.safeParse(invalide).success).toBe(false);
	});

	it("accepte annee_construction et annee_renovation nulles", () => {
		const valide = { ...MUR_EXTERIEUR, annee_construction: null, annee_renovation: null };
		expect(Mur.safeParse(valide).success).toBe(true);
	});

	it("rejette u0/u négatifs ou nuls (nombre_positif)", () => {
		expect(Mur.safeParse({ ...MUR_EXTERIEUR, u0: 0 }).success).toBe(false);
		expect(Mur.safeParse({ ...MUR_EXTERIEUR, u: -1 }).success).toBe(false);
	});
});

describe("Mur — type_doublage et inertie hors enum", () => {
	it("rejette type_doublage hors enum", () => {
		expect(Mur.safeParse({ ...MUR_EXTERIEUR, type_doublage: "invalide" }).success).toBe(false);
	});

	it("rejette inertie hors enum", () => {
		expect(Mur.safeParse({ ...MUR_EXTERIEUR, inertie: "invalide" }).success).toBe(false);
	});
});

describe("MurWithData", () => {
	it("accepte un Mur avec data complet", () => {
		const valide: MurWithData = {
			...MUR_EXTERIEUR,
			data: { sdep: 10, b: 1, dp: 0, u: 1, u0: 1.2, paroi_ancienne: false },
		};
		expect(MurWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette un Mur sans data", () => {
		expect(MurWithData.safeParse(MUR_EXTERIEUR).success).toBe(false);
	});
});
