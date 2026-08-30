import { describe, expect, it } from "vitest";
import {
	Batiment,
	BatimentBase,
	BatimentData,
	BatimentWithData,
	Maison,
	Immeuble,
	Logement,
} from "../../src/batiment/types.js";
import { isBatiment, isMaison, isImmeuble } from "../../src/batiment/guards.js";
import { ZONES_CLIMATIQUES } from "../../src/batiment/enums.js";
import { Appartement } from "../../src/batiment/appartement/types.js";
import { POSITIONS, TYPOLOGIES } from "../../src/batiment/appartement/enums.js";
import { MAISON, IMMEUBLE, LOGEMENT } from "./fixtures.js";
import { APPARTEMENT } from "./appartement/fixtures.js";

// ---------------------------------------------------------------------------
// 0. Sanité des fixtures partagées — elles doivent rester valides contre le
// schéma courant. Ce test échoue en premier (et explicitement) si le schéma
// dérive sans que les fixtures aient été mises à jour en conséquence.
// ---------------------------------------------------------------------------

describe("Fixtures partagées — toujours valides contre le schéma courant", () => {
	it("MAISON valide Maison", () => {
		expect(Maison.safeParse(MAISON).success).toBe(true);
	});

	it("IMMEUBLE valide Immeuble", () => {
		expect(Immeuble.safeParse(IMMEUBLE).success).toBe(true);
	});

	it("LOGEMENT valide Logement", () => {
		expect(Logement.safeParse(LOGEMENT).success).toBe(true);
	});

	it("APPARTEMENT valide Appartement", () => {
		expect(Appartement.safeParse(APPARTEMENT).success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 1. safeParse positif — chaque branche de l'union `Batiment`
// ---------------------------------------------------------------------------

describe("Bâtiment — chaque branche de l'union `Batiment` valide (safeParse)", () => {
	it.each([
		["Maison", Maison, MAISON],
		["Immeuble", Immeuble, IMMEUBLE],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(Batiment.safeParse(fixture).success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 2. Guards — discrimination Maison / Immeuble
// ---------------------------------------------------------------------------

describe("Guards de bâtiment", () => {
	it("isMaison distingue Maison de Immeuble", () => {
		expect(isMaison(MAISON as BatimentBase)).toBe(true);
		expect(isMaison(IMMEUBLE as BatimentBase)).toBe(false);
	});

	it("isImmeuble distingue Immeuble de Maison", () => {
		expect(isImmeuble(IMMEUBLE as BatimentBase)).toBe(true);
		expect(isImmeuble(MAISON as BatimentBase)).toBe(false);
	});

	it("isBatiment est vrai pour les deux branches", () => {
		expect(isBatiment(MAISON as BatimentBase)).toBe(true);
		expect(isBatiment(IMMEUBLE as BatimentBase)).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 3. Discriminant `type` — chaque branche restreint son propre littéral
// ---------------------------------------------------------------------------

describe("Discriminant `type` restreint par branche (.extract)", () => {
	it("Maison rejette type: immeuble", () => {
		const invalide = { ...MAISON, type: "immeuble" };
		expect(Maison.safeParse(invalide).success).toBe(false);
	});

	it("Immeuble rejette type: maison", () => {
		const invalide = { ...IMMEUBLE, type: "maison" };
		expect(Immeuble.safeParse(invalide).success).toBe(false);
	});

	it("Batiment rejette un type inconnu", () => {
		const invalide = { ...MAISON, type: "chalet" };
		expect(Batiment.safeParse(invalide).success).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 4. `logements` — cardinalité propre à chaque branche
//
// Base : min 1. Maison restreint à l'union littérale {1, 2}. Immeuble
// restreint à un entier >= 3. Les deux plages sont disjointes et couvrent
// ensemble [1, +inf), sans recouvrement.
// ---------------------------------------------------------------------------

describe("Maison.logements — union littérale {1, 2}", () => {
	it.each([1, 2])("accepte logements = %i", (logements) => {
		expect(Maison.safeParse({ ...MAISON, logements }).success).toBe(true);
	});

	it.each([0, 3, 1.5])("rejette logements = %s", (logements) => {
		expect(Maison.safeParse({ ...MAISON, logements }).success).toBe(false);
	});
});

describe("Immeuble.logements — entier >= 3", () => {
	it("rejette logements = 2 (juste sous la borne)", () => {
		expect(Immeuble.safeParse({ ...IMMEUBLE, logements: 2 }).success).toBe(
			false,
		);
	});

	it("accepte logements = 3 (borne)", () => {
		expect(Immeuble.safeParse({ ...IMMEUBLE, logements: 3 }).success).toBe(
			true,
		);
	});

	it("rejette un nombre de logements non entier", () => {
		expect(Immeuble.safeParse({ ...IMMEUBLE, logements: 3.5 }).success).toBe(
			false,
		);
	});
});

// ---------------------------------------------------------------------------
// 5. Régression — Maison force `appartements_visites` à vide
//
// `BatimentBase.appartements_visites` accepte des `Appartement`. La branche
// `Maison` la restreint à `z.array(z.never())`, donc seul le tableau vide
// est valide : un logement individuel ne peut pas avoir d'appartements
// visités. `Immeuble` hérite de la restriction de base sans la resserrer.
// ---------------------------------------------------------------------------

describe("Régression — Maison.appartements_visites forcé vide (non_applicable de fait)", () => {
	it("rejette une Maison avec un appartement visité renseigné", () => {
		const invalide = { ...MAISON, appartements_visites: [APPARTEMENT] };
		expect(Maison.safeParse(invalide).success).toBe(false);
	});

	it("accepte toujours une Maison avec appartements_visites vide", () => {
		expect(
			Maison.safeParse({ ...MAISON, appartements_visites: [] }).success,
		).toBe(true);
	});

	it("Immeuble, elle, accepte un appartement visité (pas de restriction héritée)", () => {
		expect(
			Immeuble.safeParse({ ...IMMEUBLE, appartements_visites: [APPARTEMENT] })
				.success,
		).toBe(true);
	});

	it("Immeuble accepte aussi une liste vide (le champ n'est pas requis non-vide)", () => {
		expect(
			Immeuble.safeParse({ ...IMMEUBLE, appartements_visites: [] }).success,
		).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 6. `altitude` — entier borné [-1000, 10000]
// ---------------------------------------------------------------------------

describe("BatimentBase.altitude — bornes [-1000, 10000]", () => {
	it.each([-1000, 10000])("accepte altitude = %i (borne)", (altitude) => {
		expect(Maison.safeParse({ ...MAISON, altitude }).success).toBe(true);
	});

	it.each([-1001, 10001])("rejette altitude = %i (hors borne)", (altitude) => {
		expect(Maison.safeParse({ ...MAISON, altitude }).success).toBe(false);
	});

	it("rejette une altitude non entière", () => {
		expect(
			Maison.safeParse({ ...MAISON, altitude: 100.5 }).success,
		).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 7. `surface_habitable` / `hauteur_sous_plafond` — strictement positifs
// ---------------------------------------------------------------------------

describe("BatimentBase.surface_habitable / hauteur_sous_plafond — strictement positifs", () => {
	it("rejette surface_habitable = 0", () => {
		expect(
			Maison.safeParse({ ...MAISON, surface_habitable: 0 }).success,
		).toBe(false);
	});

	it("rejette surface_habitable négative", () => {
		expect(
			Maison.safeParse({ ...MAISON, surface_habitable: -10 }).success,
		).toBe(false);
	});

	it("accepte une surface_habitable strictement positive proche de zéro", () => {
		expect(
			Maison.safeParse({ ...MAISON, surface_habitable: 0.01 }).success,
		).toBe(true);
	});

	it("rejette hauteur_sous_plafond = 0", () => {
		expect(
			Maison.safeParse({ ...MAISON, hauteur_sous_plafond: 0 }).success,
		).toBe(false);
	});

	it("rejette hauteur_sous_plafond négative", () => {
		expect(
			Maison.safeParse({ ...MAISON, hauteur_sous_plafond: -1 }).success,
		).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 8. `annee_construction` / `annee_renovation`
//
// Note : contrairement à la constante `annee_construction` du package
// `common` (nullable, défaut null), `BatimentBase.annee_construction`
// réutilise directement `annee` (= z.number().int()) : ce champ est requis
// et NON nullable sur un bâtiment. Seul `annee_renovation` est nullable
// (défaut null). Ce comportement est intentionnel au vu du schéma actuel ;
// ce test verrouille ce comportement observé plutôt que de le supposer.
// ---------------------------------------------------------------------------

describe("BatimentBase.annee_construction — requis, entier, NON nullable", () => {
	it("rejette annee_construction = null", () => {
		expect(
			Maison.safeParse({ ...MAISON, annee_construction: null }).success,
		).toBe(false);
	});

	it("rejette une année non entière", () => {
		expect(
			Maison.safeParse({ ...MAISON, annee_construction: 1990.5 }).success,
		).toBe(false);
	});

	it("accepte un entier valide", () => {
		expect(
			Maison.safeParse({ ...MAISON, annee_construction: 1950 }).success,
		).toBe(true);
	});
});

describe("BatimentBase.annee_renovation — nullable, défaut null", () => {
	it("accepte null", () => {
		expect(
			Maison.safeParse({ ...MAISON, annee_renovation: null }).success,
		).toBe(true);
	});

	it("accepte un entier valide", () => {
		expect(
			Maison.safeParse({ ...MAISON, annee_renovation: 2015 }).success,
		).toBe(true);
	});

	it("rejette une année de rénovation non entière", () => {
		expect(
			Maison.safeParse({ ...MAISON, annee_renovation: 2015.5 }).success,
		).toBe(false);
	});

	it("applique le défaut null si la clé est absente", () => {
		const { annee_renovation: _omise, ...sansRenovation } = MAISON;
		const resultat = Maison.safeParse(sansRenovation);
		expect(resultat.success).toBe(true);
		if (resultat.success) {
			expect(resultat.data.annee_renovation).toBeNull();
		}
	});
});

// ---------------------------------------------------------------------------
// 9. `rnb_id` — nullable, défaut null
// ---------------------------------------------------------------------------

describe("BatimentBase.rnb_id — nullable", () => {
	it("accepte null", () => {
		expect(Maison.safeParse({ ...MAISON, rnb_id: null }).success).toBe(true);
	});

	it("accepte une chaîne", () => {
		expect(
			Maison.safeParse({ ...MAISON, rnb_id: "RNB-12345" }).success,
		).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 10. `logement` — Logement nullable, requis (présent mais peut être null)
// ---------------------------------------------------------------------------

describe("BatimentBase.logement — Logement | null, requis", () => {
	it("accepte logement = null", () => {
		expect(Maison.safeParse({ ...MAISON, logement: null }).success).toBe(
			true,
		);
	});

	it("accepte un Logement valide", () => {
		expect(
			Maison.safeParse({ ...MAISON, logement: LOGEMENT }).success,
		).toBe(true);
	});

	it("rejette un Logement incomplet (surface_habitable manquante)", () => {
		const { surface_habitable: _omise, ...logementIncomplet } = LOGEMENT;
		expect(
			Maison.safeParse({ ...MAISON, logement: logementIncomplet }).success,
		).toBe(false);
	});

	it("rejette l'absence totale de la clé logement", () => {
		const { logement: _omise, ...sansLogement } = MAISON;
		expect(Maison.safeParse(sansLogement).success).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 11. `adresse` — regex code_postal / code_insee
// ---------------------------------------------------------------------------

describe("adresse.code_postal — 5 chiffres", () => {
	it.each(["75001", "97400"])("accepte %s", (code_postal) => {
		expect(
			Maison.safeParse({
				...MAISON,
				adresse: { ...MAISON.adresse, code_postal },
			}).success,
		).toBe(true);
	});

	it.each(["7500", "750011", "ABCDE", "7500A"])("rejette %s", (code_postal) => {
		expect(
			Maison.safeParse({
				...MAISON,
				adresse: { ...MAISON.adresse, code_postal },
			}).success,
		).toBe(false);
	});
});

describe("adresse.code_insee — 1 chiffre + 1 alphanumérique majuscule + 3 chiffres", () => {
	it.each(["75056", "2A004", "2B033"])("accepte %s", (code_insee) => {
		expect(
			Maison.safeParse({
				...MAISON,
				adresse: { ...MAISON.adresse, code_insee },
			}).success,
		).toBe(true);
	});

	it.each(["7505", "AB123", "2a004", "750560"])(
		"rejette %s",
		(code_insee) => {
			expect(
				Maison.safeParse({
					...MAISON,
					adresse: { ...MAISON.adresse, code_insee },
				}).success,
			).toBe(false);
		},
	);
});

// ---------------------------------------------------------------------------
// 12. `Logement` — schéma isolé
// ---------------------------------------------------------------------------

describe("Logement — contraintes propres", () => {
	it("rejette surface_habitable = 0", () => {
		expect(
			Logement.safeParse({ ...LOGEMENT, surface_habitable: 0 }).success,
		).toBe(false);
	});

	it("rejette hauteur_sous_plafond négative", () => {
		expect(
			Logement.safeParse({ ...LOGEMENT, hauteur_sous_plafond: -1 }).success,
		).toBe(false);
	});

	it("rejette une description manquante", () => {
		const { description: _omise, ...sansDescription } = LOGEMENT;
		expect(Logement.safeParse(sansDescription).success).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 13. `Appartement` — contraintes propres et énumérations
// ---------------------------------------------------------------------------

describe("Appartement — safeParse positif", () => {
	it("APPARTEMENT valide Appartement", () => {
		expect(Appartement.safeParse(APPARTEMENT).success).toBe(true);
	});
});

describe("Appartement.id — UUID requis", () => {
	it("rejette un id non-UUID", () => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, id: "pas-un-uuid" }).success,
		).toBe(false);
	});
});

describe("Appartement.position — énumération", () => {
	it.each(Object.values(POSITIONS))("accepte position = %s", (position) => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, position }).success,
		).toBe(true);
	});

	it("rejette une position hors énumération", () => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, position: "sous_sol" })
				.success,
		).toBe(false);
	});
});

describe("Appartement.typologie — énumération T1 à T7", () => {
	it.each(Object.values(TYPOLOGIES))("accepte typologie = %s", (typologie) => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, typologie }).success,
		).toBe(true);
	});

	it("rejette une typologie hors énumération", () => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, typologie: "T8" }).success,
		).toBe(false);
	});
});

describe("Appartement.surface_habitable / hauteur_sous_plafond — strictement positifs", () => {
	it("rejette surface_habitable = 0", () => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, surface_habitable: 0 })
				.success,
		).toBe(false);
	});

	it("rejette hauteur_sous_plafond négative", () => {
		expect(
			Appartement.safeParse({ ...APPARTEMENT, hauteur_sous_plafond: -1 })
				.success,
		).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 14. `BatimentData` / `BatimentWithData`
// ---------------------------------------------------------------------------

const BATIMENT_DATA: BatimentData = {
	sh: 120,
	hsp: 2.5,
	ratio_proratisation: 1,
	zone_climatique: "H1a",
};

describe("BatimentData.zone_climatique — énumération", () => {
	it.each(Object.values(ZONES_CLIMATIQUES))(
		"accepte zone_climatique = %s",
		(zone_climatique) => {
			expect(
				BatimentData.safeParse({ ...BATIMENT_DATA, zone_climatique })
					.success,
			).toBe(true);
		},
	);

	it("rejette une zone climatique hors énumération", () => {
		expect(
			BatimentData.safeParse({ ...BATIMENT_DATA, zone_climatique: "H4" })
				.success,
		).toBe(false);
	});
});

describe("BatimentWithData — intersection Batiment & { data: BatimentData }", () => {
	it("accepte une Maison avec data", () => {
		expect(
			BatimentWithData.safeParse({ ...MAISON, data: BATIMENT_DATA }).success,
		).toBe(true);
	});

	it("accepte un Immeuble avec data", () => {
		expect(
			BatimentWithData.safeParse({ ...IMMEUBLE, data: BATIMENT_DATA })
				.success,
		).toBe(true);
	});

	it("rejette un bâtiment valide sans data", () => {
		expect(BatimentWithData.safeParse(MAISON).success).toBe(false);
	});

	it("rejette un bâtiment invalide même avec data valide", () => {
		const invalide = { ...MAISON, type: "chalet", data: BATIMENT_DATA };
		expect(BatimentWithData.safeParse(invalide).success).toBe(false);
	});
});
