import { describe, expect, it } from "vitest";
import {
	PlancherBas,
	PlancherBasWithData,
	Position,
	isPositionMitoyenneteLocalNonChauffe,
	isPositionMitoyenneteAutres,
	isPositionTerrePlein,
	isPositionAutres,
	type PositionBase,
} from "../../src/enveloppe/plancher-bas/index.js";

const POSITION_EXTERIEUR: Position = {
	surface: 40,
	mitoyennete: "exterieur",
	local_non_chauffe_id: null,
	surface_ue: null,
	perimetre_ue: null,
};

const POSITION_LNC: Position = {
	surface: 12,
	mitoyennete: "local_non_chauffe",
	local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
	surface_ue: null,
	perimetre_ue: null,
};

const POSITION_ENTERRE: Position = {
	surface: 40,
	mitoyennete: "enterre",
	local_non_chauffe_id: null,
	surface_ue: 40,
	perimetre_ue: 25,
};

const PLANCHER_BAS_VALIDE: PlancherBas = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Plancher bas sur extérieur",
	type: "dalle_beton",
	inertie: "lourde",
	annee_construction: 1975,
	annee_renovation: null,
	u0: 1.2,
	u: 1,
	position: POSITION_EXTERIEUR,
	isolation: {
		etat: false,
		type: null,
		annee_installation: null,
		epaisseur: null,
		resistance_thermique: null,
	},
};

describe("PlancherBas.position — produit cartésien mitoyennete × surface_ue/perimetre_ue", () => {
	it.each([
		["exterieur (Ue non applicable)", POSITION_EXTERIEUR],
		["local_non_chauffe (Ue non applicable)", POSITION_LNC],
		["enterre (Ue requis)", POSITION_ENTERRE],
	] as const)("%s valide", (_label, position) => {
		expect(PlancherBas.safeParse({ ...PLANCHER_BAS_VALIDE, position }).success).toBe(true);
	});

	it("rejette mitoyennete=exterieur avec surface_ue renseignée (non_applicable non respecté)", () => {
		const invalide = { ...PLANCHER_BAS_VALIDE, position: { ...POSITION_EXTERIEUR, surface_ue: 40 } };
		expect(PlancherBas.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=enterre avec surface_ue=null (requise pour cette branche)", () => {
		const invalide = { ...PLANCHER_BAS_VALIDE, position: { ...POSITION_ENTERRE, surface_ue: null } };
		expect(PlancherBas.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=enterre avec perimetre_ue=null (requise pour cette branche)", () => {
		const invalide = { ...PLANCHER_BAS_VALIDE, position: { ...POSITION_ENTERRE, perimetre_ue: null } };
		expect(PlancherBas.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=local_non_chauffe avec local_non_chauffe_id=null", () => {
		const invalide = { ...PLANCHER_BAS_VALIDE, position: { ...POSITION_LNC, local_non_chauffe_id: null } };
		expect(PlancherBas.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=exterieur avec local_non_chauffe_id renseigné (non_applicable non respecté)", () => {
		const invalide = {
			...PLANCHER_BAS_VALIDE,
			position: { ...POSITION_EXTERIEUR, local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099" },
		};
		expect(PlancherBas.safeParse(invalide).success).toBe(false);
	});
});

describe("Guards PlancherBas.position", () => {
	it("isPositionMitoyenneteLocalNonChauffe / isPositionMitoyenneteAutres", () => {
		expect(isPositionMitoyenneteLocalNonChauffe(POSITION_LNC as PositionBase)).toBe(true);
		expect(isPositionMitoyenneteAutres(POSITION_LNC as PositionBase)).toBe(false);
		expect(isPositionMitoyenneteAutres(POSITION_ENTERRE as PositionBase)).toBe(true);
	});

	it("isPositionTerrePlein / isPositionAutres — partition par groupe de mitoyennetés", () => {
		expect(isPositionTerrePlein(POSITION_ENTERRE as PositionBase)).toBe(true);
		expect(isPositionAutres(POSITION_ENTERRE as PositionBase)).toBe(false);
		expect(isPositionAutres(POSITION_EXTERIEUR as PositionBase)).toBe(true);
		expect(isPositionAutres(POSITION_LNC as PositionBase)).toBe(true);
	});
});

describe("PlancherBas — champs propres", () => {
	it("accepte type=null (nullable)", () => {
		expect(PlancherBas.safeParse({ ...PLANCHER_BAS_VALIDE, type: null }).success).toBe(true);
	});

	it("rejette u0/u négatifs ou nuls", () => {
		expect(PlancherBas.safeParse({ ...PLANCHER_BAS_VALIDE, u0: 0 }).success).toBe(false);
		expect(PlancherBas.safeParse({ ...PLANCHER_BAS_VALIDE, u: -1 }).success).toBe(false);
	});

	it("rejette annee_construction non entière", () => {
		expect(PlancherBas.safeParse({ ...PLANCHER_BAS_VALIDE, annee_construction: 1975.2 }).success).toBe(
			false,
		);
	});
});

describe("PlancherBasWithData", () => {
	it("accepte un PlancherBas avec data complet", () => {
		const valide: PlancherBasWithData = {
			...PLANCHER_BAS_VALIDE,
			data: { sdep: 40, b: 1, dp: 0, u: 1, u0: 1.2 },
		};
		expect(PlancherBasWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette un PlancherBas sans data", () => {
		expect(PlancherBasWithData.safeParse(PLANCHER_BAS_VALIDE).success).toBe(false);
	});
});
