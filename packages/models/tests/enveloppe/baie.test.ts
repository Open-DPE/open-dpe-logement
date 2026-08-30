import { describe, expect, it } from "vitest";
import {
	Baie,
	BaieWithData,
	BaieBriqueVerre,
	BaiePolycarbonate,
	BaieFenetreOuPorteFenetre,
	Position,
	isPositionMitoyenneteLocalNonChauffe,
	isPositionMitoyenneteAutres,
	isPositionVerticale,
	isPositionHorizontale,
	isBaieBriqueVerre,
	isBaiePolycarbonate,
	isBaieFenetreOuPorteFenetre,
	isVitrageSimple,
	isVitrageComplexe,
	isVitrageBriqueVerre,
	isVitragePolycarbonate,
	isVitrageInconnu,
	type PositionBase,
	type VitrageBase,
	type BaieBase,
} from "../../src/enveloppe/baie/index.js";

const POSITION_VERTICALE_EXTERIEUR: Position = {
	surface: 2,
	mitoyennete: "exterieur",
	local_non_chauffe_id: null,
	paroi_id: null,
	baie_id: null,
	type_pose: "nu_interieur",
	inclinaison: 90,
	orientation: "nord",
	masques: [],
};

const POSITION_HORIZONTALE_LNC: Position = {
	surface: 1.5,
	mitoyennete: "local_non_chauffe",
	local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
	paroi_id: null,
	baie_id: null,
	type_pose: "nu_interieur",
	inclinaison: 0,
	orientation: "horizontale",
	masques: [],
};

const BAIE_FENETRE: BaieFenetreOuPorteFenetre = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Fenêtre battante",
	type: "fenetre_battante",
	presence_protection_solaire: false,
	type_fermeture: "sans_fermeture",
	annee_installation: 2010,
	ug: 1.1,
	uw: 1.3,
	ujn: null,
	sw: 0.6,
	position: POSITION_VERTICALE_EXTERIEUR,
	menuiserie: {
		materiau: "pvc",
		largeur_dormant: null,
		presence_soubassement: false,
		presence_joint: null,
		presence_retour_isolation: null,
		presence_rupteur_pont_thermique: null,
	},
	vitrage: { type: "double_vitrage", nature_lame: "air", epaisseur_lame: 12 },
	survitrage: null,
};

const BAIE_BRIQUE_VERRE: BaieBriqueVerre = {
	...BAIE_FENETRE,
	id: "550e8400-e29b-41d4-a716-446655440002",
	type: "brique_verre_pleine",
	position: POSITION_HORIZONTALE_LNC,
	vitrage: { type: "brique_verre", nature_lame: null, epaisseur_lame: null },
	menuiserie: null,
};

const BAIE_POLYCARBONATE: BaiePolycarbonate = {
	...BAIE_FENETRE,
	id: "550e8400-e29b-41d4-a716-446655440003",
	type: "polycarbonate",
	vitrage: { type: "polycarbonate", nature_lame: null, epaisseur_lame: null },
	menuiserie: null,
};

describe("Baie — chaque branche de l'union valide (safeParse)", () => {
	it.each([
		["BaieBriqueVerre", BaieBriqueVerre, BAIE_BRIQUE_VERRE],
		["BaiePolycarbonate", BaiePolycarbonate, BAIE_POLYCARBONATE],
		["BaieFenetreOuPorteFenetre", BaieFenetreOuPorteFenetre, BAIE_FENETRE],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(Baie.safeParse(fixture).success).toBe(true);
	});
});

describe("Baie — non_applicable forcé sur menuiserie (brique de verre / polycarbonate)", () => {
	it("rejette BaieBriqueVerre avec menuiserie renseignée", () => {
		const invalide = { ...BAIE_BRIQUE_VERRE, menuiserie: BAIE_FENETRE.menuiserie };
		expect(BaieBriqueVerre.safeParse(invalide).success).toBe(false);
		expect(Baie.safeParse(invalide).success).toBe(false);
	});

	it("rejette BaiePolycarbonate avec menuiserie renseignée", () => {
		const invalide = { ...BAIE_POLYCARBONATE, menuiserie: BAIE_FENETRE.menuiserie };
		expect(BaiePolycarbonate.safeParse(invalide).success).toBe(false);
	});

	it("rejette BaieFenetreOuPorteFenetre avec menuiserie=null (requise pour cette branche)", () => {
		const invalide = { ...BAIE_FENETRE, menuiserie: null };
		expect(BaieFenetreOuPorteFenetre.safeParse(invalide).success).toBe(false);
	});
});

describe("Baie.position — produit cartésien mitoyennete × orientation/inclinaison", () => {
	it("accepte une position verticale sur mitoyennete=exterieur", () => {
		expect(BaieFenetreOuPorteFenetre.safeParse(BAIE_FENETRE).success).toBe(true);
	});

	it("accepte une position horizontale sur mitoyennete=local_non_chauffe", () => {
		expect(BaieBriqueVerre.safeParse(BAIE_BRIQUE_VERRE).success).toBe(true);
	});

	it("rejette mitoyennete=local_non_chauffe avec local_non_chauffe_id=null", () => {
		const invalide = {
			...BAIE_BRIQUE_VERRE,
			position: { ...POSITION_HORIZONTALE_LNC, local_non_chauffe_id: null },
		};
		expect(BaieBriqueVerre.safeParse(invalide).success).toBe(false);
	});

	it("rejette mitoyennete=exterieur avec local_non_chauffe_id renseigné (non_applicable non respecté)", () => {
		const invalide = {
			...BAIE_FENETRE,
			position: {
				...POSITION_VERTICALE_EXTERIEUR,
				local_non_chauffe_id: "550e8400-e29b-41d4-a716-446655440099",
			},
		};
		expect(BaieFenetreOuPorteFenetre.safeParse(invalide).success).toBe(false);
	});

	it("rejette inclinaison=0 avec une orientation cardinale (ni verticale ni horizontale)", () => {
		const invalide = {
			...BAIE_FENETRE,
			position: { ...POSITION_VERTICALE_EXTERIEUR, inclinaison: 0, orientation: "nord" },
		};
		expect(BaieFenetreOuPorteFenetre.safeParse(invalide).success).toBe(false);
	});

	it("rejette inclinaison>0 avec orientation=horizontale", () => {
		const invalide = {
			...BAIE_FENETRE,
			position: { ...POSITION_VERTICALE_EXTERIEUR, inclinaison: 45, orientation: "horizontale" },
		};
		expect(BaieFenetreOuPorteFenetre.safeParse(invalide).success).toBe(false);
	});

	it("rejette une inclinaison non entière", () => {
		const invalide = {
			...BAIE_FENETRE,
			position: { ...POSITION_VERTICALE_EXTERIEUR, inclinaison: 45.5 },
		};
		expect(BaieFenetreOuPorteFenetre.safeParse(invalide).success).toBe(false);
	});

	it("rejette une inclinaison hors [0, 90]", () => {
		const invalide = {
			...BAIE_FENETRE,
			position: { ...POSITION_VERTICALE_EXTERIEUR, inclinaison: 91 },
		};
		expect(BaieFenetreOuPorteFenetre.safeParse(invalide).success).toBe(false);
	});
});

describe("Baie.vitrage — sw plafonné à 1", () => {
	it("accepte sw=1", () => {
		expect(BaieFenetreOuPorteFenetre.safeParse({ ...BAIE_FENETRE, sw: 1 }).success).toBe(true);
	});

	it("rejette sw>1", () => {
		expect(BaieFenetreOuPorteFenetre.safeParse({ ...BAIE_FENETRE, sw: 1.01 }).success).toBe(false);
	});
});

describe("Guards Baie", () => {
	it("distingue les 3 branches par type", () => {
		expect(isBaieBriqueVerre(BAIE_BRIQUE_VERRE as BaieBase)).toBe(true);
		expect(isBaiePolycarbonate(BAIE_POLYCARBONATE as BaieBase)).toBe(true);
		expect(isBaieFenetreOuPorteFenetre(BAIE_FENETRE as BaieBase)).toBe(true);
		expect(isBaieBriqueVerre(BAIE_FENETRE as BaieBase)).toBe(false);
	});

	it("isPositionMitoyenneteLocalNonChauffe / isPositionMitoyenneteAutres", () => {
		expect(isPositionMitoyenneteLocalNonChauffe(POSITION_HORIZONTALE_LNC as PositionBase)).toBe(true);
		expect(isPositionMitoyenneteAutres(POSITION_HORIZONTALE_LNC as PositionBase)).toBe(false);
		expect(isPositionMitoyenneteAutres(POSITION_VERTICALE_EXTERIEUR as PositionBase)).toBe(true);
	});

	it("isPositionVerticale / isPositionHorizontale", () => {
		expect(isPositionVerticale(POSITION_VERTICALE_EXTERIEUR as PositionBase)).toBe(true);
		expect(isPositionHorizontale(POSITION_VERTICALE_EXTERIEUR as PositionBase)).toBe(false);
		expect(isPositionHorizontale(POSITION_HORIZONTALE_LNC as PositionBase)).toBe(true);
	});

	it("distingue les branches de Vitrage entre elles", () => {
		const vSimple = { type: "simple_vitrage", nature_lame: null, epaisseur_lame: null } as VitrageBase;
		const vComplexe = { type: "double_vitrage", nature_lame: "air", epaisseur_lame: 12 } as VitrageBase;
		const vBriqueVerre = { type: "brique_verre", nature_lame: null, epaisseur_lame: null } as VitrageBase;
		const vPolycarbonate = { type: "polycarbonate", nature_lame: null, epaisseur_lame: null } as VitrageBase;
		const vInconnu = { type: null, nature_lame: null, epaisseur_lame: null } as VitrageBase;

		expect(isVitrageSimple(vSimple)).toBe(true);
		expect(isVitrageComplexe(vComplexe)).toBe(true);
		expect(isVitrageBriqueVerre(vBriqueVerre)).toBe(true);
		expect(isVitragePolycarbonate(vPolycarbonate)).toBe(true);
		expect(isVitrageInconnu(vInconnu)).toBe(true);
		expect(isVitrageSimple(vComplexe)).toBe(false);
	});
});

describe("BaieWithData", () => {
	it("accepte une Baie avec data complet", () => {
		const valide: BaieWithData = {
			...BAIE_FENETRE,
			data: { sdep: 2, b: 1, dp: 0, u: 1.3, deltar: 0, uw: 1.3, ug: 1.1, sse: 0, sw: 0.6, fe: 1 },
		};
		expect(BaieWithData.safeParse(valide).success).toBe(true);
	});

	it("rejette une Baie sans data", () => {
		expect(BaieWithData.safeParse(BAIE_FENETRE).success).toBe(false);
	});
});
