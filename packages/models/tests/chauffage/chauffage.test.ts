import { describe, expect, it } from "vitest";
import {
	getSystemes,
	findSysteme,
	findEmetteur,
	findGenerateur,
	findInstallationBySysteme,
	type Chauffage,
} from "../../src/chauffage/index.js";
import { EntityNotFoundError } from "../../src/errors.js";

const EMETTEUR = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Radiateur",
	type: "radiateur" as const,
	temperature_distribution: null,
	presence_robinet_thermostatique: true,
	annee_installation: null,
};

const GENERATEUR = {
	id: "550e8400-e29b-41d4-a716-446655440002",
	description: "PAC air/eau",
	type: "pac_air_eau" as const,
	energie: "electricite" as const,
	bienergie: null,
	annee_installation: 2015,
	position: {
		cascade: null,
		position_chaudiere: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 8, scop: 3.5, label: null, mode_combustion: null,
		presence_ventouse: null, presence_regulation: null,
		pveilleuse: null, qp0: null, rpn: null, rpint: null, tfonc30: null, tfonc100: null,
	},
};

const SYSTEME = {
	id: "550e8400-e29b-41d4-a716-446655440003",
	description: "Système divise",
	type: "divise" as const,
	generateur_id: GENERATEUR.id,
	reseau: null,
};

const INSTALLATION = {
	id: "550e8400-e29b-41d4-a716-446655440004",
	description: "Installation principale",
	surface: 80,
	type: "divise" as const,
	installation_collective: false as const,
	comptage_individuel: null,
	regulation_terminale: null,
	programmation: "absent" as const,
	solaire_thermique: null,
	systemes: [SYSTEME],
};

const CHAUFFAGE: Chauffage = {
	emetteurs: [EMETTEUR],
	generateurs: [GENERATEUR],
	installations: [INSTALLATION],
};

describe("getSystemes", () => {
	it("aplatit les systèmes de toutes les installations", () => {
		expect(getSystemes(CHAUFFAGE)).toEqual([SYSTEME]);
	});
});

describe("getters par id — succès", () => {
	it("findSysteme retrouve le système par id", () => {
		expect(findSysteme(SYSTEME.id, CHAUFFAGE)).toBe(SYSTEME);
	});

	it("findEmetteur retrouve l'émetteur par id", () => {
		expect(findEmetteur(EMETTEUR.id, CHAUFFAGE)).toBe(EMETTEUR);
	});

	it("findGenerateur retrouve le générateur par id", () => {
		expect(findGenerateur(GENERATEUR.id, CHAUFFAGE)).toBe(GENERATEUR);
	});

	it("findInstallationBySysteme retrouve l'installation contenant le système", () => {
		expect(findInstallationBySysteme(SYSTEME.id, CHAUFFAGE)).toBe(INSTALLATION);
	});
});

describe("getters par id — échec", () => {
	it("findSysteme lève EntityNotFoundError si absent", () => {
		expect(() => findSysteme("inconnu", CHAUFFAGE)).toThrow(EntityNotFoundError);
		expect(() => findSysteme("inconnu", CHAUFFAGE)).toThrow("Systeme with id inconnu not found");
	});

	it("findEmetteur lève EntityNotFoundError si absent", () => {
		expect(() => findEmetteur("inconnu", CHAUFFAGE)).toThrow(EntityNotFoundError);
	});

	it("findGenerateur lève EntityNotFoundError si absent", () => {
		expect(() => findGenerateur("inconnu", CHAUFFAGE)).toThrow(EntityNotFoundError);
	});

	it("findInstallationBySysteme lève EntityNotFoundError si aucune installation ne contient ce système", () => {
		expect(() => findInstallationBySysteme("inconnu", CHAUFFAGE)).toThrow(
			EntityNotFoundError,
		);
	});
});

// ===========================================================================
// Générateurs — schémas (safeParse), guards, régressions
// ===========================================================================

import {
	isChaudiereCombustion,
	isPoeleBoisBouilleur,
	isPoeleOuInsert,
	isGenerateurAirChaudCombustion,
	isRadiateurGaz,
	isChaudiereElectrique,
	isEmetteurElectrique,
	isPacClassique,
	isPacHybride,
	isReseauChaleur,
	isGenerateurCollectifInconnu,
	isGenerateurMultiBatiment,
	ChaudiereCombustion,
	PoeleBoisBouilleur,
	PoeleOuInsert,
	GenerateurAirChaudCombustion,
	RadiateurGaz,
	ChaudiereElectrique,
	EmetteurElectrique,
	PacClassique,
	PacHybride,
	ReseauChaleur,
	GenerateurCollectifInconnu,
	Generateur,
} from "../../src/chauffage/generateur/index.js";
import {
	Systeme as SystemeSchema,
	SystemeCentral,
	SystemeDivise,
	ReseauHydraulique,
	ReseauAeraulique,
} from "../../src/chauffage/systeme/index.js";
import {
	Installation as ChauffageInstallation,
	InstallationChauffageCentralCollectif,
	InstallationChauffageDivise,
	SolaireThermique as ChauffageSolaireThermique,
} from "../../src/chauffage/installation/index.js";

const CHAUDIERE_COMBUSTION: ChaudiereCombustion = {
	id: "550e8400-e29b-41d4-a716-446655440101",
	description: "Chaudière gaz",
	annee_installation: 2008,
	type: "chaudiere",
	energie: "gaz_naturel",
	bienergie: null,
	position: {
		position_chaudiere: "chaudiere_murale",
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 24,
		label: null,
		scop: null,
		mode_combustion: "standard",
		presence_ventouse: true,
		presence_regulation: true,
		pveilleuse: null,
		qp0: null,
		rpn: 0.92,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const POELE_BOIS_BOUILLEUR: PoeleBoisBouilleur = {
	id: "550e8400-e29b-41d4-a716-446655440102",
	description: "Poêle bouilleur bois",
	annee_installation: 2013,
	type: "poele_bouilleur",
	energie: "bois_buche",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 10,
		label: null,
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const POELE_OU_INSERT: PoeleOuInsert = {
	id: "550e8400-e29b-41d4-a716-446655440103",
	description: "Insert bois",
	annee_installation: 2016,
	type: "insert",
	energie: "bois_buche",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 7,
		label: "flamme_verte",
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const GENERATEUR_AIR_CHAUD_COMBUSTION: GenerateurAirChaudCombustion = {
	id: "550e8400-e29b-41d4-a716-446655440104",
	description: "Générateur air chaud gaz",
	annee_installation: 2014,
	type: "generateur_air_chaud",
	energie: "gaz_naturel",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 15,
		label: null,
		scop: null,
		mode_combustion: "condensation",
		presence_ventouse: true,
		presence_regulation: true,
		pveilleuse: null,
		qp0: null,
		rpn: 0.9,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const RADIATEUR_GAZ: RadiateurGaz = {
	id: "550e8400-e29b-41d4-a716-446655440105",
	description: "Radiateur gaz",
	annee_installation: 2011,
	type: "radiateur_gaz",
	energie: "gaz_naturel",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 3,
		label: null,
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: 0.88,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const CHAUDIERE_ELECTRIQUE: ChaudiereElectrique = {
	id: "550e8400-e29b-41d4-a716-446655440106",
	description: "Chaudière électrique",
	annee_installation: 2017,
	type: "chaudiere",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chaudiere: "chaudiere_sol",
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 9,
		label: null,
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const EMETTEUR_ELECTRIQUE: EmetteurElectrique = {
	id: "550e8400-e29b-41d4-a716-446655440107",
	description: "Radiateur électrique",
	annee_installation: 2019,
	type: "radiateur_electrique",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 1.5,
		label: "nf_performance",
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const PAC_CLASSIQUE: PacClassique = {
	id: "550e8400-e29b-41d4-a716-446655440108",
	description: "PAC air/air",
	annee_installation: 2020,
	type: "pac_air_air",
	energie: "electricite",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 5,
		label: null,
		scop: 3.8,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const PAC_HYBRIDE: PacHybride = {
	id: "550e8400-e29b-41d4-a716-446655440109",
	description: "PAC air/eau hybride gaz",
	annee_installation: 2022,
	type: "pac_air_eau",
	energie: "electricite",
	bienergie: "gaz_naturel",
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: 8,
		label: null,
		scop: 3.2,
		mode_combustion: "standard",
		presence_ventouse: true,
		presence_regulation: true,
		pveilleuse: null,
		qp0: 5,
		rpn: 0.85,
		rpint: 0.8,
		tfonc30: 60,
		tfonc100: 70,
	},
};

const RESEAU_CHALEUR: ReseauChaleur = {
	id: "550e8400-e29b-41d4-a716-446655440110",
	description: "Sous-station réseau de chaleur",
	annee_installation: 2009,
	type: "reseau_chaleur",
	energie: "reseau_chaleur",
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: true,
		generateur_multi_batiment: true,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: "550e8400-e29b-41d4-a716-446655449998",
	},
	signaletique: {
		pn: null,
		label: null,
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

const GENERATEUR_COLLECTIF_INCONNU: GenerateurCollectifInconnu = {
	id: "550e8400-e29b-41d4-a716-446655440111",
	description: "Générateur collectif inconnu",
	annee_installation: null,
	type: null,
	energie: null,
	bienergie: null,
	position: {
		position_chaudiere: null,
		cascade: null,
		generateur_collectif: true,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		pn: null,
		label: null,
		scop: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

describe("Générateurs — chaque branche de l'union `Generateur` valide (safeParse)", () => {
	it.each([
		["ChaudiereCombustion", ChaudiereCombustion, CHAUDIERE_COMBUSTION],
		["PoeleBoisBouilleur", PoeleBoisBouilleur, POELE_BOIS_BOUILLEUR],
		["PoeleOuInsert", PoeleOuInsert, POELE_OU_INSERT],
		[
			"GenerateurAirChaudCombustion",
			GenerateurAirChaudCombustion,
			GENERATEUR_AIR_CHAUD_COMBUSTION,
		],
		["RadiateurGaz", RadiateurGaz, RADIATEUR_GAZ],
		["ChaudiereElectrique", ChaudiereElectrique, CHAUDIERE_ELECTRIQUE],
		["EmetteurElectrique", EmetteurElectrique, EMETTEUR_ELECTRIQUE],
		["PacClassique", PacClassique, PAC_CLASSIQUE],
		["PacHybride", PacHybride, PAC_HYBRIDE],
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

describe("Guards de générateur", () => {
	it("distingue les branches combustion entre elles par le type", () => {
		expect(isChaudiereCombustion(CHAUDIERE_COMBUSTION)).toBe(true);
		expect(isPoeleBoisBouilleur(POELE_BOIS_BOUILLEUR)).toBe(true);
		expect(isPoeleOuInsert(POELE_OU_INSERT)).toBe(true);
		expect(isGenerateurAirChaudCombustion(GENERATEUR_AIR_CHAUD_COMBUSTION)).toBe(
			true,
		);
		expect(isRadiateurGaz(RADIATEUR_GAZ)).toBe(true);
		expect(isChaudiereCombustion(POELE_OU_INSERT)).toBe(false);
	});

	it("distingue PacClassique de PacHybride par bienergie, hors pac_air_air", () => {
		expect(isPacClassique(PAC_CLASSIQUE)).toBe(true);
		expect(isPacHybride(PAC_CLASSIQUE)).toBe(false);
		expect(isPacHybride(PAC_HYBRIDE)).toBe(true);
		expect(isPacClassique(PAC_HYBRIDE)).toBe(false);
	});

	it("isPacHybride exclut explicitement pac_air_air même avec bienergie renseignée", () => {
		const pacAirAirAvecBienergie = {
			...PAC_CLASSIQUE,
			bienergie: "gaz_naturel" as const,
		};
		// Ni classique (bienergie non nulle) ni hybride (type exclu) : un état
		// qu'aucune branche du schéma n'autorise — cohérent avec le fait que
		// `PacClassique.safeParse` le rejetterait également (bienergie forcée
		// à `non_applicable` pour cette branche).
		expect(isPacClassique(pacAirAirAvecBienergie)).toBe(false);
		expect(isPacHybride(pacAirAirAvecBienergie)).toBe(false);
		expect(PacClassique.safeParse(pacAirAirAvecBienergie).success).toBe(
			false,
		);
	});

	it("isReseauChaleur / isGenerateurCollectifInconnu / isGenerateurMultiBatiment", () => {
		expect(isReseauChaleur(RESEAU_CHALEUR)).toBe(true);
		expect(isGenerateurCollectifInconnu(GENERATEUR_COLLECTIF_INCONNU)).toBe(
			true,
		);
		expect(isGenerateurMultiBatiment(RESEAU_CHALEUR)).toBe(true);
		expect(isGenerateurMultiBatiment(CHAUDIERE_COMBUSTION)).toBe(false);
	});
});

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

	it("rejette un ChaudiereCombustion avec signaletique.scop renseigné (hérité de SignaletiqueCombustion)", () => {
		const invalide = {
			...CHAUDIERE_COMBUSTION,
			signaletique: { ...CHAUDIERE_COMBUSTION.signaletique, scop: 3.5 },
		};
		expect(ChaudiereCombustion.safeParse(invalide).success).toBe(false);
	});

	it("rejette un GenerateurAirChaudCombustion avec label renseigné (surcharge propre à la branche)", () => {
		const invalide = {
			...GENERATEUR_AIR_CHAUD_COMBUSTION,
			signaletique: {
				...GENERATEUR_AIR_CHAUD_COMBUSTION.signaletique,
				label: "flamme_verte",
			},
		};
		expect(GenerateurAirChaudCombustion.safeParse(invalide).success).toBe(
			false,
		);
	});

	it("accepte toujours les versions valides correspondantes (pas de faux positif)", () => {
		expect(ChaudiereCombustion.safeParse(CHAUDIERE_COMBUSTION).success).toBe(
			true,
		);
		expect(
			GenerateurAirChaudCombustion.safeParse(GENERATEUR_AIR_CHAUD_COMBUSTION)
				.success,
		).toBe(true);
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

describe("Point de vigilance schéma — RadiateurGaz garde un rpn réel, contrairement à PoeleOuInsert", () => {
	it("RadiateurGaz accepte un rpn numérique", () => {
		expect(RADIATEUR_GAZ.signaletique.rpn).toBe(0.88);
		expect(RadiateurGaz.safeParse(RADIATEUR_GAZ).success).toBe(true);
	});

	it("le même rpn numérique est rejeté sur PoeleOuInsert (rpn forcé non_applicable)", () => {
		const invalide = {
			...POELE_OU_INSERT,
			signaletique: { ...POELE_OU_INSERT.signaletique, rpn: 0.88 },
		};
		expect(PoeleOuInsert.safeParse(invalide).success).toBe(false);
	});
});

describe("Point de vigilance schéma — ambiguïté generateur_air_chaud / electricite", () => {
	// Document construit pour satisfaire simultanément ChaudiereElectrique et
	// EmetteurElectrique (voir commentaire dans generateur/types.ts). Ce test
	// documente et verrouille le choix arbitraire actuel : `Generateur` (union
	// ordonnée) retient `ChaudiereElectrique`, placée avant `EmetteurElectrique`.
	// Si l'ordre du union change, ce test le signalera.
	const AMBIGU = {
		id: "550e8400-e29b-41d4-a716-446655440112",
		description: "Générateur électrique ambigu (chaudière vs émetteur)",
		annee_installation: 2020,
		type: "generateur_air_chaud",
		energie: "electricite",
		bienergie: null,
		position: {
			position_chaudiere: null,
			cascade: null,
			generateur_collectif: false,
			generateur_multi_batiment: false,
			position_volume_chauffe: true,
			generateur_mixte_id: null,
			reseau_chaleur_id: null,
		},
		signaletique: {
			pn: 5,
			label: null,
			scop: null,
			mode_combustion: null,
			presence_ventouse: null,
			presence_regulation: null,
			pveilleuse: null,
			qp0: null,
			rpn: null,
			rpint: null,
			tfonc30: null,
			tfonc100: null,
		},
	};

	it("les deux branches valident indépendamment ce document", () => {
		expect(ChaudiereElectrique.safeParse(AMBIGU).success).toBe(true);
		expect(EmetteurElectrique.safeParse(AMBIGU).success).toBe(true);
	});

	it("l'union `Generateur` tranche pour ChaudiereElectrique (ordre de priorité actuel)", () => {
		const result = Generateur.safeParse(AMBIGU);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(isChaudiereElectrique(result.data)).toBe(true);
		}
	});
});

// ===========================================================================
// Systèmes — union central/divisé, réseaux hydraulique/aéraulique
// ===========================================================================

const RESEAU_HYDRAULIQUE: ReseauHydraulique = {
	type_distribution: "hydraulique",
	temperature_distribution: "moyenne",
	presence_fluide_frigorigene: false,
	presence_circulateur_externe: true,
	niveaux_desservis: 1,
	isolation: true,
	emetteurs: ["550e8400-e29b-41d4-a716-446655440201"],
};

const RESEAU_AERAULIQUE: ReseauAeraulique = {
	type_distribution: "aeraulique",
	temperature_distribution: null,
	presence_fluide_frigorigene: false,
	presence_circulateur_externe: false,
	niveaux_desservis: 1,
	isolation: null,
	emetteurs: [],
};

const SYSTEME_CENTRAL: SystemeCentral = {
	id: "550e8400-e29b-41d4-a716-446655440202",
	description: "Système central hydraulique",
	type: "central",
	generateur_id: CHAUDIERE_ELECTRIQUE.id,
	reseau: RESEAU_HYDRAULIQUE,
};

const SYSTEME_DIVISE: SystemeDivise = {
	id: "550e8400-e29b-41d4-a716-446655440203",
	description: "Système divisé",
	type: "divise",
	generateur_id: EMETTEUR_ELECTRIQUE.id,
	reseau: null,
};

describe("Réseaux — hydraulique exige des émetteurs, aéraulique les exclut", () => {
	it("ReseauHydraulique accepte au moins un émetteur, rejette un tableau vide", () => {
		expect(ReseauHydraulique.safeParse(RESEAU_HYDRAULIQUE).success).toBe(
			true,
		);
		expect(
			ReseauHydraulique.safeParse({ ...RESEAU_HYDRAULIQUE, emetteurs: [] })
				.success,
		).toBe(false);
	});

	it("ReseauAeraulique rejette un émetteur (max 0) et impose temperature_distribution non_applicable", () => {
		expect(ReseauAeraulique.safeParse(RESEAU_AERAULIQUE).success).toBe(true);
		expect(
			ReseauAeraulique.safeParse({
				...RESEAU_AERAULIQUE,
				emetteurs: ["550e8400-e29b-41d4-a716-446655440201"],
			}).success,
		).toBe(false);
		expect(
			ReseauAeraulique.safeParse({
				...RESEAU_AERAULIQUE,
				temperature_distribution: "moyenne",
			}).success,
		).toBe(false);
	});
});

describe("Systeme — union central (reseau requis) / divisé (reseau non_applicable)", () => {
	it("SystemeCentral exige un reseau réel", () => {
		expect(SystemeCentral.safeParse(SYSTEME_CENTRAL).success).toBe(true);
		expect(
			SystemeCentral.safeParse({ ...SYSTEME_CENTRAL, reseau: null }).success,
		).toBe(false);
	});

	it("SystemeDivise impose reseau: null", () => {
		expect(SystemeDivise.safeParse(SYSTEME_DIVISE).success).toBe(true);
		expect(
			SystemeDivise.safeParse({
				...SYSTEME_DIVISE,
				reseau: RESEAU_HYDRAULIQUE,
			}).success,
		).toBe(false);
	});

	it("les deux branches sont acceptées par l'union Systeme", () => {
		expect(SystemeSchema.safeParse(SYSTEME_CENTRAL).success).toBe(true);
		expect(SystemeSchema.safeParse(SYSTEME_DIVISE).success).toBe(true);
	});
});

// ===========================================================================
// Installations — contrainte `contains` (au moins un système central)
// ===========================================================================

describe("Régression — contrainte contains sur Installation (systemes cohérents avec le type)", () => {
	// Depuis la correction de la ré-ergonomie TypeScript côté `packages/engine`
	// et `apps/ambassadeurs-renov` (`item.systemes.map(...)` sur `Installation`
	// non discriminée), `systemes` est volontairement IDENTIQUE (`Systeme[]`)
	// sur les 3 branches de `InstallationBase` — voir le commentaire dans
	// `src/chauffage/installation/types.ts`. Les deux règles métier réelles
	// sont donc appliquées par le `.superRefine()` sur `Installation` (le
	// export union, pas les branches individuelles) : c'est CE schéma qu'il
	// faut tester ici, pas `InstallationChauffageCentralCollectif` seule (qui
	// ne porte plus le refine).
	const INSTALLATION_CENTRALE_VALIDE: InstallationChauffageCentralCollectif = {
		id: "550e8400-e29b-41d4-a716-446655440204",
		description: "Installation centrale collective",
		surface: 100,
		type: "central",
		installation_collective: true,
		comptage_individuel: true,
		regulation_terminale: true,
		programmation: "absent",
		solaire_thermique: null,
		systemes: [SYSTEME_CENTRAL],
	};

	const INSTALLATION_DIVISEE_VALIDE: InstallationChauffageDivise = {
		id: "550e8400-e29b-41d4-a716-446655440205",
		description: "Installation divisée",
		surface: 60,
		type: "divise",
		installation_collective: false,
		comptage_individuel: null,
		regulation_terminale: null,
		programmation: "absent",
		solaire_thermique: null,
		systemes: [SYSTEME_DIVISE],
	};

	it("les branches individuelles restent des safeParse valides (forme structurelle seule, pas la règle contains)", () => {
		expect(
			InstallationChauffageCentralCollectif.safeParse(
				INSTALLATION_CENTRALE_VALIDE,
			).success,
		).toBe(true);
		expect(
			InstallationChauffageDivise.safeParse(INSTALLATION_DIVISEE_VALIDE)
				.success,
		).toBe(true);
	});

	it("accepte une installation centrale dont les systèmes contiennent au moins un central", () => {
		expect(
			ChauffageInstallation.safeParse(INSTALLATION_CENTRALE_VALIDE).success,
		).toBe(true);
	});

	it("rejette une installation centrale dont aucun système n'est central", () => {
		const invalide = {
			...INSTALLATION_CENTRALE_VALIDE,
			systemes: [SYSTEME_DIVISE],
		};
		expect(ChauffageInstallation.safeParse(invalide).success).toBe(false);
	});

	it("rejette une installation centrale avec un tableau de systèmes vide", () => {
		const invalide = { ...INSTALLATION_CENTRALE_VALIDE, systemes: [] };
		expect(ChauffageInstallation.safeParse(invalide).success).toBe(false);
	});

	it("accepte une installation divisée dont tous les systèmes sont divisés", () => {
		expect(
			ChauffageInstallation.safeParse(INSTALLATION_DIVISEE_VALIDE).success,
		).toBe(true);
	});

	it("rejette une installation divisée contenant un système central (règle symétrique, nouvelle)", () => {
		const invalide = {
			...INSTALLATION_DIVISEE_VALIDE,
			systemes: [SYSTEME_CENTRAL, SYSTEME_DIVISE],
		};
		expect(ChauffageInstallation.safeParse(invalide).success).toBe(false);
	});
});

describe("Régression — SolaireThermique.fch plafonné à 1", () => {
	const base = {
		usage: "chauffage" as const,
		annee_installation: 2015,
		fch: 0,
	};

	it("rejette fch > 1", () => {
		expect(
			ChauffageSolaireThermique.safeParse({ ...base, fch: 1.5 }).success,
		).toBe(false);
	});

	it("accepte fch = 1", () => {
		expect(
			ChauffageSolaireThermique.safeParse({ ...base, fch: 1 }).success,
		).toBe(true);
	});

	it("accepte fch = null", () => {
		expect(
			ChauffageSolaireThermique.safeParse({ ...base, fch: null }).success,
		).toBe(true);
	});
});
