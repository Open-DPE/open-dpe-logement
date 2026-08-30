import { describe, expect, it } from "vitest";
import {
	Production,
	ProductionData,
	ProductionWithData,
	UsageElectriciteEnum,
	panneauPhotovoltaique,
} from "../../src/production/index.js";
import type {
	Production as ProductionType,
	ProductionWithData as ProductionWithDataType,
} from "../../src/production/index.js";
import type {
	PanneauPhotovoltaique as PanneauPhotovoltaiqueType,
	PanneauPhotovoltaiqueWithData as PanneauPhotovoltaiqueWithDataType,
} from "../../src/production/panneau-photovoltaique/index.js";

const {
	PanneauPhotovoltaique,
	PanneauPhotovoltaiqueData,
	PanneauPhotovoltaiqueWithData,
} = panneauPhotovoltaique;

// ---------------------------------------------------------------------------
// Le domaine `production` (photovoltaïque) ne comporte ni union de branches,
// ni guards, ni helpers (`src/production/` n'expose que enums.ts, types.ts et
// panneau-photovoltaique/types.ts). Les tests ci-dessous couvrent donc :
//  - le seul enum du domaine (UsageElectriciteEnum),
//  - les contraintes numériques/enum du schéma feuille PanneauPhotovoltaique,
//  - les schémas composites Production / ProductionWithData / *WithData,
// sans forcer le motif it.each par branche qui n'a pas lieu d'être ici.
// ---------------------------------------------------------------------------

const PANNEAU_PHOTOVOLTAIQUE: PanneauPhotovoltaiqueType = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Panneau toiture sud",
	orientation: "sud",
	inclinaison: 30,
	modules: 12,
	surface: 20,
	installation_collective: false,
};

const PANNEAU_PHOTOVOLTAIQUE_WITH_DATA: PanneauPhotovoltaiqueWithDataType = {
	...PANNEAU_PHOTOVOLTAIQUE,
	data: {
		kpv: 0.95,
		ppv: 3.6,
	},
};

const PRODUCTION: ProductionType = {
	panneaux_photovoltaiques: [PANNEAU_PHOTOVOLTAIQUE],
};

const PRODUCTION_WITH_DATA: ProductionWithDataType = {
	panneaux_photovoltaiques: [PANNEAU_PHOTOVOLTAIQUE_WITH_DATA],
	data: {
		ppv: 3.6,
		celec_ac: 3.4,
		tapl: 0.9,
	},
};

// ---------------------------------------------------------------------------
// 1. UsageElectriciteEnum
// ---------------------------------------------------------------------------

describe("UsageElectriciteEnum", () => {
	it.each([
		"chauffage",
		"refroidissement",
		"ecs",
		"eclairage",
		"auxiliaires_ventilation",
		"auxiliaires_distribution",
		"autres",
	])("accepte la valeur '%s'", (valeur) => {
		expect(UsageElectriciteEnum.safeParse(valeur).success).toBe(true);
	});

	it("rejette une valeur hors énumération", () => {
		expect(UsageElectriciteEnum.safeParse("chauffe_eau").success).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 2. PanneauPhotovoltaique — schéma feuille
// ---------------------------------------------------------------------------

describe("PanneauPhotovoltaique — validation de base", () => {
	it("accepte un panneau valide", () => {
		expect(
			PanneauPhotovoltaique.safeParse(PANNEAU_PHOTOVOLTAIQUE).success,
		).toBe(true);
	});

	it("rejette un panneau sans installation_collective", () => {
		const { installation_collective, ...invalide } = PANNEAU_PHOTOVOLTAIQUE;
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});
});

describe("PanneauPhotovoltaique.orientation", () => {
	it.each([
		"nord",
		"sud",
		"est",
		"ouest",
		"nord_est",
		"sud_est",
		"nord_ouest",
		"sud_ouest",
	])("accepte l'orientation '%s'", (orientation) => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, orientation };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("rejette une orientation hors énumération", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, orientation: "sud_sud_est" };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});
});

describe("PanneauPhotovoltaique.inclinaison — bornes [0, 90]", () => {
	it("accepte la borne basse 0", () => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, inclinaison: 0 };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("accepte la borne haute 90", () => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, inclinaison: 90 };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("rejette -1 (juste sous la borne basse)", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, inclinaison: -1 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});

	it("rejette 91 (juste au-dessus de la borne haute)", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, inclinaison: 91 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});

	it("rejette une valeur non entière", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, inclinaison: 45.5 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});
});

describe("PanneauPhotovoltaique.modules — bornes [1, 1000]", () => {
	it("accepte la borne basse 1", () => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, modules: 1 };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("accepte la borne haute 1000", () => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, modules: 1000 };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("rejette 0 (juste sous la borne basse)", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, modules: 0 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});

	it("rejette 1001 (juste au-dessus de la borne haute)", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, modules: 1001 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});

	it("rejette une valeur non entière", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, modules: 12.5 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});
});

describe("PanneauPhotovoltaique.surface — nullable, positive, défaut null", () => {
	it("accepte une surface positive", () => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, surface: 15.5 };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("accepte explicitement null", () => {
		const valide = { ...PANNEAU_PHOTOVOLTAIQUE, surface: null };
		expect(PanneauPhotovoltaique.safeParse(valide).success).toBe(true);
	});

	it("rejette une surface nulle (0, hors de gt(0))", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, surface: 0 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});

	it("rejette une surface négative", () => {
		const invalide = { ...PANNEAU_PHOTOVOLTAIQUE, surface: -5 };
		expect(PanneauPhotovoltaique.safeParse(invalide).success).toBe(false);
	});

	it("applique le défaut null quand le champ est absent", () => {
		const { surface, ...sansSurface } = PANNEAU_PHOTOVOLTAIQUE;
		const resultat = PanneauPhotovoltaique.parse(sansSurface);
		expect(resultat.surface).toBeNull();
	});
});

// ---------------------------------------------------------------------------
// 3. Production — schéma racine
// ---------------------------------------------------------------------------

describe("Production — schéma racine", () => {
	it("accepte une production avec un panneau", () => {
		expect(Production.safeParse(PRODUCTION).success).toBe(true);
	});

	it("accepte un tableau de panneaux vide (aucune contrainte de cardinalité minimale)", () => {
		expect(
			Production.safeParse({ panneaux_photovoltaiques: [] }).success,
		).toBe(true);
	});

	it("rejette un panneau invalide dans le tableau (propagation de l'erreur enfant)", () => {
		const invalide = {
			panneaux_photovoltaiques: [
				{ ...PANNEAU_PHOTOVOLTAIQUE, modules: 0 },
			],
		};
		expect(Production.safeParse(invalide).success).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 4. ProductionData / PanneauPhotovoltaiqueData — schémas de données calculées
// ---------------------------------------------------------------------------

describe("ProductionData", () => {
	it("accepte ppv/celec_ac/tapl numériques", () => {
		expect(
			ProductionData.safeParse({ ppv: 3.6, celec_ac: 3.4, tapl: 0.9 })
				.success,
		).toBe(true);
	});

	it("rejette une valeur non numérique", () => {
		expect(
			ProductionData.safeParse({ ppv: "3.6", celec_ac: 3.4, tapl: 0.9 })
				.success,
		).toBe(false);
	});
});

describe("PanneauPhotovoltaiqueData", () => {
	it("accepte kpv/ppv numériques", () => {
		expect(
			PanneauPhotovoltaiqueData.safeParse({ kpv: 0.95, ppv: 3.6 }).success,
		).toBe(true);
	});

	it("rejette kpv manquant", () => {
		expect(PanneauPhotovoltaiqueData.safeParse({ ppv: 3.6 }).success).toBe(
			false,
		);
	});
});

// ---------------------------------------------------------------------------
// 5. PanneauPhotovoltaiqueWithData — intersection panneau + données calculées
// ---------------------------------------------------------------------------

describe("PanneauPhotovoltaiqueWithData", () => {
	it("accepte un panneau valide augmenté de ses données calculées", () => {
		expect(
			PanneauPhotovoltaiqueWithData.safeParse(PANNEAU_PHOTOVOLTAIQUE_WITH_DATA)
				.success,
		).toBe(true);
	});

	it("rejette le panneau seul, sans la clé data (intersection non satisfaite)", () => {
		expect(
			PanneauPhotovoltaiqueWithData.safeParse(PANNEAU_PHOTOVOLTAIQUE).success,
		).toBe(false);
	});

	it("rejette des données calculées incomplètes (ppv manquant)", () => {
		const invalide = {
			...PANNEAU_PHOTOVOLTAIQUE,
			data: { kpv: 0.95 },
		};
		expect(PanneauPhotovoltaiqueWithData.safeParse(invalide).success).toBe(
			false,
		);
	});

	it("rejette un panneau de base invalide même si data est valide", () => {
		const invalide = {
			...PANNEAU_PHOTOVOLTAIQUE,
			modules: 0,
			data: { kpv: 0.95, ppv: 3.6 },
		};
		expect(PanneauPhotovoltaiqueWithData.safeParse(invalide).success).toBe(
			false,
		);
	});
});

// ---------------------------------------------------------------------------
// 6. ProductionWithData — schéma racine augmenté des données calculées
// ---------------------------------------------------------------------------

describe("ProductionWithData", () => {
	it("accepte une production complète avec données calculées", () => {
		expect(ProductionWithData.safeParse(PRODUCTION_WITH_DATA).success).toBe(
			true,
		);
	});

	it("rejette une production sans la clé data racine", () => {
		const { data, ...invalide } = PRODUCTION_WITH_DATA;
		expect(ProductionWithData.safeParse(invalide).success).toBe(false);
	});

	it("rejette un panneau sans données calculées dans panneaux_photovoltaiques (le champ est surchargé par extend, pas fusionné)", () => {
		const invalide = {
			...PRODUCTION_WITH_DATA,
			panneaux_photovoltaiques: [PANNEAU_PHOTOVOLTAIQUE],
		};
		expect(ProductionWithData.safeParse(invalide).success).toBe(false);
	});
});
