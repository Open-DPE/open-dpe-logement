import { describe, expect, it } from "vitest";
import {
	getSystemes,
	findGenerateur,
	findInstallation,
	findInstallationBySysteme,
	type Ecs,
} from "../../src/ecs/index.js";
import {
	isChaudiereCombustion,
	isPoeleBoisBouilleur,
	isChauffeEauGaz,
	isChaudiereElectrique,
	isChauffeEauElectrique,
	isChauffeEauThermodynamique,
	isPacDoubleService,
	isPacDoubleServiceHybride,
	isReseauChaleur,
	isGenerateurCollectifInconnu,
	isGenerateurMultiBatiment,
	ChaudiereCombustion,
	PoeleBoisBouilleur,
	ChauffeEauGaz,
	ChaudiereElectrique,
	ChauffeEauElectrique,
	ChauffeEauThermodynamique,
	PacDoubleService,
	PacDoubleServiceHybride,
	ReseauChaleur,
	GenerateurCollectifInconnu,
	Generateur,
	AvecStockage,
} from "../../src/ecs/generateur/index.js";
import { SolaireThermique } from "../../src/ecs/installation/index.js";
import type { Systeme } from "../../src/ecs/systeme/types.js";
import type { Installation } from "../../src/ecs/installation/types.js";
import { EntityNotFoundError } from "../../src/errors.js";

// ---------------------------------------------------------------------------
// Fixtures — une par branche de l'union `Generateur`, typées explicitement
// contre leur type de branche pour bénéficier du contrôle structurel du
// compilateur (tout champ manquant ou mal typé casse le build).
// ---------------------------------------------------------------------------

const CHAUDIERE_COMBUSTION: ChaudiereCombustion = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Chaudière gaz",
	annee_installation: 2005,
	type: "chaudiere",
	energie: "gaz_naturel",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: 24,
		cop: null,
		label: null,
		mode_combustion: "standard",
		presence_ventouse: true,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const POELE_BOIS_BOUILLEUR: PoeleBoisBouilleur = {
	id: "550e8400-e29b-41d4-a716-446655440002",
	description: "Poêle bouilleur bois bûche",
	annee_installation: 2012,
	type: "poele_bouilleur",
	energie: "bois_buche",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 200, type: "integre", position_volume_chauffe: true },
	signaletique: {
		pn: 12,
		cop: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const CHAUFFE_EAU_GAZ: ChauffeEauGaz = {
	id: "550e8400-e29b-41d4-a716-446655440003",
	description: "Chauffe-eau gaz",
	annee_installation: 2018,
	type: "chauffe_eau",
	energie: "gaz_naturel",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: 20,
		cop: null,
		label: null,
		mode_combustion: "standard",
		presence_ventouse: true,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const CHAUDIERE_ELECTRIQUE: ChaudiereElectrique = {
	id: "550e8400-e29b-41d4-a716-446655440004",
	description: "Chaudière électrique",
	annee_installation: 2015,
	type: "chaudiere",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: 18,
		cop: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const CHAUFFE_EAU_ELECTRIQUE: ChauffeEauElectrique = {
	id: "550e8400-e29b-41d4-a716-446655440005",
	description: "Chauffe-eau électrique",
	annee_installation: 2019,
	type: "chauffe_eau",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chauffe_eau: "chauffe_eau_vertical",
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 150, type: "integre", position_volume_chauffe: true },
	signaletique: {
		pn: 2.4,
		cop: null,
		label: "ne_performance_a",
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const CHAUFFE_EAU_THERMODYNAMIQUE: ChauffeEauThermodynamique = {
	id: "550e8400-e29b-41d4-a716-446655440006",
	description: "Chauffe-eau thermodynamique air ambiant",
	annee_installation: 2020,
	type: "cet_air_ambiant",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 200, type: "integre", position_volume_chauffe: true },
	signaletique: {
		pn: 2,
		cop: 3.2,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const PAC_DOUBLE_SERVICE: PacDoubleService = {
	id: "550e8400-e29b-41d4-a716-446655440007",
	description: "PAC air/eau double service",
	annee_installation: 2021,
	type: "pac_air_eau",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: 8,
		cop: 3.5,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const PAC_DOUBLE_SERVICE_HYBRIDE: PacDoubleServiceHybride = {
	id: "550e8400-e29b-41d4-a716-446655440008",
	description: "PAC air/eau hybride gaz",
	annee_installation: 2022,
	type: "pac_air_eau",
	energie: "electricite",
	bienergie: "gaz_naturel",
	position: {
		position_chauffe_eau: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: 8,
		cop: 3.1,
		label: null,
		mode_combustion: "standard",
		presence_ventouse: true,
		pveilleuse: null,
		qp0: 5,
		rpn: 0.85,
	},
};

const RESEAU_CHALEUR: ReseauChaleur = {
	id: "550e8400-e29b-41d4-a716-446655440009",
	description: "Sous-station réseau de chaleur",
	annee_installation: 2010,
	type: "reseau_chaleur",
	energie: "reseau_chaleur",
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: true,
		generateur_multi_batiment: true,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: "550e8400-e29b-41d4-a716-446655440099",
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: null,
		cop: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const GENERATEUR_COLLECTIF_INCONNU: GenerateurCollectifInconnu = {
	id: "550e8400-e29b-41d4-a716-446655440010",
	description: "Générateur collectif inconnu",
	annee_installation: null,
	type: null,
	energie: null,
	bienergie: null,
	position: {
		position_chauffe_eau: null,
		generateur_collectif: true,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 0, type: null, position_volume_chauffe: null },
	signaletique: {
		pn: null,
		cop: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

// ---------------------------------------------------------------------------
// 1. safeParse positif — chaque branche de l'union est effectivement acceptée
// ---------------------------------------------------------------------------

describe("Générateurs — chaque branche de l'union `Generateur` valide (safeParse)", () => {
	it.each([
		["ChaudiereCombustion", ChaudiereCombustion, CHAUDIERE_COMBUSTION],
		["PoeleBoisBouilleur", PoeleBoisBouilleur, POELE_BOIS_BOUILLEUR],
		["ChauffeEauGaz", ChauffeEauGaz, CHAUFFE_EAU_GAZ],
		["ChaudiereElectrique", ChaudiereElectrique, CHAUDIERE_ELECTRIQUE],
		["ChauffeEauElectrique", ChauffeEauElectrique, CHAUFFE_EAU_ELECTRIQUE],
		[
			"ChauffeEauThermodynamique",
			ChauffeEauThermodynamique,
			CHAUFFE_EAU_THERMODYNAMIQUE,
		],
		["PacDoubleService", PacDoubleService, PAC_DOUBLE_SERVICE],
		[
			"PacDoubleServiceHybride",
			PacDoubleServiceHybride,
			PAC_DOUBLE_SERVICE_HYBRIDE,
		],
		["ReseauChaleur", ReseauChaleur, RESEAU_CHALEUR],
		[
			"GenerateurCollectifInconnu",
			GenerateurCollectifInconnu,
			GENERATEUR_COLLECTIF_INCONNU,
		],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(Generateur.safeParse(fixture).success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 2. Guards — discrimination correcte entre branches proches
// ---------------------------------------------------------------------------

describe("Guards de générateur", () => {
	it("distingue ChaudiereCombustion de ChaudiereElectrique par l'énergie", () => {
		expect(isChaudiereCombustion(CHAUDIERE_COMBUSTION)).toBe(true);
		expect(isChaudiereCombustion(CHAUDIERE_ELECTRIQUE)).toBe(false);
	});

	it("distingue ChauffeEauGaz de ChauffeEauElectrique", () => {
		expect(isChauffeEauGaz(CHAUFFE_EAU_GAZ)).toBe(true);
		expect(isChauffeEauGaz(CHAUFFE_EAU_ELECTRIQUE)).toBe(false);
		expect(isChauffeEauElectrique(CHAUFFE_EAU_ELECTRIQUE)).toBe(true);
	});

	it("distingue PacDoubleService de PacDoubleServiceHybride par bienergie", () => {
		expect(isPacDoubleService(PAC_DOUBLE_SERVICE)).toBe(true);
		expect(isPacDoubleService(PAC_DOUBLE_SERVICE_HYBRIDE)).toBe(false);
		expect(isPacDoubleServiceHybride(PAC_DOUBLE_SERVICE_HYBRIDE)).toBe(true);
		expect(isPacDoubleServiceHybride(PAC_DOUBLE_SERVICE)).toBe(false);
	});

	it("isChauffeEauThermodynamique / isReseauChaleur / isGenerateurCollectifInconnu", () => {
		expect(isChauffeEauThermodynamique(CHAUFFE_EAU_THERMODYNAMIQUE)).toBe(
			true,
		);
		expect(isReseauChaleur(RESEAU_CHALEUR)).toBe(true);
		expect(isGenerateurCollectifInconnu(GENERATEUR_COLLECTIF_INCONNU)).toBe(
			true,
		);
	});

	it("isGenerateurMultiBatiment lit le flag position.generateur_multi_batiment", () => {
		expect(isGenerateurMultiBatiment(RESEAU_CHALEUR)).toBe(true);
		expect(isGenerateurMultiBatiment(CHAUDIERE_COMBUSTION)).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 3. Régression — bug systémique des contraintes `non_applicable` héritées
//
// Avant correction, les branches concrètes dérivaient `position`/`signaletique`
// depuis les types de base bruts au lieu du type intermédiaire déjà restreint
// de leur famille (`PositionCombustion`, `SignaletiqueCombustion`, ...), ce qui
// faisait perdre silencieusement les `non_applicable` hérités. Ces tests
// verrouillent la correction : un document qui renseigne un champ censé être
// forcé à `null` par la famille doit être rejeté.
// ---------------------------------------------------------------------------

describe("Régression — contraintes non_applicable héritées de la famille combustion", () => {
	it("rejette un ChaudiereCombustion avec reseau_chaleur_id renseigné (hérité de PositionCombustion)", () => {
		const invalide = {
			...CHAUDIERE_COMBUSTION,
			position: {
				...CHAUDIERE_COMBUSTION.position,
				reseau_chaleur_id: "550e8400-e29b-41d4-a716-446655449999",
			},
		};
		expect(ChaudiereCombustion.safeParse(invalide).success).toBe(false);
	});

	it("rejette un ChauffeEauGaz avec signaletique.cop renseigné (hérité de SignaletiqueCombustion)", () => {
		const invalide = {
			...CHAUFFE_EAU_GAZ,
			signaletique: { ...CHAUFFE_EAU_GAZ.signaletique, cop: 3.5 },
		};
		expect(ChauffeEauGaz.safeParse(invalide).success).toBe(false);
	});

	it("rejette un ChaudiereElectrique avec signaletique.label renseigné (surcharge propre à la branche)", () => {
		const invalide = {
			...CHAUDIERE_ELECTRIQUE,
			signaletique: {
				...CHAUDIERE_ELECTRIQUE.signaletique,
				label: "ne_performance_a",
			},
		};
		expect(ChaudiereElectrique.safeParse(invalide).success).toBe(false);
	});

	it("accepte toujours la version valide correspondante (pas de faux positif)", () => {
		expect(ChaudiereCombustion.safeParse(CHAUDIERE_COMBUSTION).success).toBe(
			true,
		);
		expect(ChauffeEauGaz.safeParse(CHAUFFE_EAU_GAZ).success).toBe(true);
	});
});

describe("Régression — PoeleBoisBouilleur.energie exclut charbon", () => {
	it("rejette charbon", () => {
		const invalide = { ...POELE_BOIS_BOUILLEUR, energie: "charbon" };
		expect(PoeleBoisBouilleur.safeParse(invalide).success).toBe(false);
	});

	it("accepte bois_buche / bois_plaquette / bois_granule", () => {
		for (const energie of ["bois_buche", "bois_plaquette", "bois_granule"]) {
			expect(
				PoeleBoisBouilleur.safeParse({ ...POELE_BOIS_BOUILLEUR, energie })
					.success,
			).toBe(true);
		}
	});

	it("ChaudiereCombustion, elle, accepte charbon (pas de restriction à ce niveau)", () => {
		expect(
			ChaudiereCombustion.safeParse({
				...CHAUDIERE_COMBUSTION,
				energie: "charbon",
			}).success,
		).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 4. Régression — Stockage.volume doit être un entier (ou null)
// ---------------------------------------------------------------------------

describe("Régression — AvecStockage.volume entier", () => {
	it("rejette un volume non entier", () => {
		expect(
			AvecStockage.safeParse({
				volume: 199.5,
				type: "integre",
				position_volume_chauffe: true,
			}).success,
		).toBe(false);
	});

	it("accepte un volume entier positif", () => {
		expect(
			AvecStockage.safeParse({
				volume: 200,
				type: "integre",
				position_volume_chauffe: true,
			}).success,
		).toBe(true);
	});

	it("accepte un volume null", () => {
		expect(
			AvecStockage.safeParse({
				volume: null,
				type: "integre",
				position_volume_chauffe: true,
			}).success,
		).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 5. Régression — SolaireThermique.fecs <= 1
// ---------------------------------------------------------------------------

describe("Régression — SolaireThermique.fecs plafonné à 1", () => {
	const base = { usage: "ecs" as const, annee_installation: 2015, fecs: 0 };

	it("rejette fecs > 1", () => {
		expect(SolaireThermique.safeParse({ ...base, fecs: 1.5 }).success).toBe(
			false,
		);
	});

	it("accepte fecs = 1", () => {
		expect(SolaireThermique.safeParse({ ...base, fecs: 1 }).success).toBe(
			true,
		);
	});

	it("accepte fecs = null", () => {
		expect(SolaireThermique.safeParse({ ...base, fecs: null }).success).toBe(
			true,
		);
	});
});

// ---------------------------------------------------------------------------
// 6. Contraintes de cardinalité au niveau racine `Ecs`
// ---------------------------------------------------------------------------

const SYSTEME: Systeme = {
	id: "550e8400-e29b-41d4-a716-446655440011",
	description: "Système ECS",
	generateur_id: CHAUDIERE_ELECTRIQUE.id,
	reseau: {
		alimentation_contigue: true,
		niveaux_desservis: 1,
		isolation: true,
		bouclage: "non_boucle",
	},
};

const INSTALLATION: Installation = {
	id: "550e8400-e29b-41d4-a716-446655440012",
	description: "Installation ECS principale",
	surface: 50,
	installation_collective: false,
	systemes: [SYSTEME],
	solaire_thermique: null,
};

const ECS: Ecs = {
	generateurs: [CHAUDIERE_ELECTRIQUE],
	installations: [INSTALLATION],
};

// ---------------------------------------------------------------------------
// 7. Helpers
// ---------------------------------------------------------------------------

describe("getSystemes", () => {
	it("aplatit les systèmes de toutes les installations", () => {
		expect(getSystemes(ECS)).toEqual([SYSTEME]);
	});
});

describe("getters par id — succès", () => {
	it("findGenerateur retrouve le générateur par id", () => {
		expect(findGenerateur(CHAUDIERE_ELECTRIQUE.id, ECS)).toBe(
			CHAUDIERE_ELECTRIQUE,
		);
	});

	it("findInstallation retrouve l'installation par id", () => {
		expect(findInstallation(INSTALLATION.id, ECS)).toBe(INSTALLATION);
	});

	it("findInstallationBySysteme retrouve l'installation contenant le système", () => {
		expect(findInstallationBySysteme(SYSTEME.id, ECS)).toBe(INSTALLATION);
	});
});

describe("getters par id — échec", () => {
	it("findGenerateur lève EntityNotFoundError si absent", () => {
		expect(() => findGenerateur("inconnu", ECS)).toThrow(EntityNotFoundError);
		expect(() => findGenerateur("inconnu", ECS)).toThrow(
			"Générateur with id inconnu not found",
		);
	});

	it("findInstallation lève EntityNotFoundError si absent", () => {
		expect(() => findInstallation("inconnu", ECS)).toThrow(
			EntityNotFoundError,
		);
		expect(() => findInstallation("inconnu", ECS)).toThrow(
			"Installation with id inconnu not found",
		);
	});

	it("findInstallationBySysteme lève EntityNotFoundError si aucune installation ne contient ce système", () => {
		expect(() => findInstallationBySysteme("inconnu", ECS)).toThrow(
			EntityNotFoundError,
		);
	});
});
