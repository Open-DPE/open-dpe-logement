import { describe, expect, it } from "vitest";
import {
	findGenerateur,
	findInstallation,
	type Refroidissement,
} from "../../src/refroidissement/index.js";
import {
	isGenerateur,
	isGenerateurPAC,
	isGenerateurClimatiseur,
	isGenerateurReseauFroid,
	isTypeGenerateurPac,
	GenerateurPAC,
	GenerateurClimatiseur,
	GenerateurReseauFroid,
	Generateur,
} from "../../src/refroidissement/generateur/index.js";
import { Installation } from "../../src/refroidissement/installation/index.js";
import { RefroidissementVide, RefroidissementNonVide } from "../../src/refroidissement/types.js";
import { EntityNotFoundError } from "../../src/errors.js";

// ---------------------------------------------------------------------------
// Fixtures — une par branche de l'union `Generateur`, typées explicitement
// contre leur type de branche pour bénéficier du contrôle structurel du
// compilateur (tout champ manquant ou mal typé casse le build).
// ---------------------------------------------------------------------------

const GENERATEUR_PAC: GenerateurPAC = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "PAC air/air réversible",
	type: "pac_air_air",
	energie: "electricite",
	annee_installation: 2018,
	seer: 5.2,
	reseau_froid_id: null,
};

const GENERATEUR_CLIMATISEUR: GenerateurClimatiseur = {
	id: "550e8400-e29b-41d4-a716-446655440002",
	description: "Climatiseur mono-split au gaz",
	type: "autre",
	energie: "gaz_naturel",
	annee_installation: 2010,
	seer: null,
	reseau_froid_id: null,
};

const GENERATEUR_RESEAU_FROID: GenerateurReseauFroid = {
	id: "550e8400-e29b-41d4-a716-446655440003",
	description: "Sous-station réseau de froid urbain",
	type: "reseau_froid",
	energie: "reseau_froid",
	annee_installation: 2005,
	seer: null,
	reseau_froid_id: "550e8400-e29b-41d4-a716-446655440099",
};

// ---------------------------------------------------------------------------
// 1. safeParse positif — chaque branche de l'union `Generateur` est acceptée
// ---------------------------------------------------------------------------

describe("Générateurs — chaque branche de l'union `Generateur` valide (safeParse)", () => {
	it.each([
		["GenerateurPAC", GenerateurPAC, GENERATEUR_PAC],
		["GenerateurClimatiseur", GenerateurClimatiseur, GENERATEUR_CLIMATISEUR],
		["GenerateurReseauFroid", GenerateurReseauFroid, GENERATEUR_RESEAU_FROID],
	] as const)("%s", (_label, schema, fixture) => {
		expect(schema.safeParse(fixture).success).toBe(true);
		expect(Generateur.safeParse(fixture).success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 2. Guards — discrimination correcte entre branches
// ---------------------------------------------------------------------------

describe("Guards de générateur", () => {
	it("isGenerateurPAC reconnaît uniquement les types PAC / thermodynamiques", () => {
		expect(isGenerateurPAC(GENERATEUR_PAC)).toBe(true);
		expect(isGenerateurPAC(GENERATEUR_CLIMATISEUR)).toBe(false);
		expect(isGenerateurPAC(GENERATEUR_RESEAU_FROID)).toBe(false);
	});

	it("isGenerateurClimatiseur reconnaît uniquement le type autre", () => {
		expect(isGenerateurClimatiseur(GENERATEUR_CLIMATISEUR)).toBe(true);
		expect(isGenerateurClimatiseur(GENERATEUR_PAC)).toBe(false);
		expect(isGenerateurClimatiseur(GENERATEUR_RESEAU_FROID)).toBe(false);
	});

	it("isGenerateurReseauFroid reconnaît uniquement le type reseau_froid", () => {
		expect(isGenerateurReseauFroid(GENERATEUR_RESEAU_FROID)).toBe(true);
		expect(isGenerateurReseauFroid(GENERATEUR_PAC)).toBe(false);
		expect(isGenerateurReseauFroid(GENERATEUR_CLIMATISEUR)).toBe(false);
	});

	it("isGenerateur accepte les trois branches", () => {
		expect(isGenerateur(GENERATEUR_PAC)).toBe(true);
		expect(isGenerateur(GENERATEUR_CLIMATISEUR)).toBe(true);
		expect(isGenerateur(GENERATEUR_RESEAU_FROID)).toBe(true);
	});

	it("isTypeGenerateurPac distingue les 6 types PAC/thermodynamiques du reste", () => {
		expect(isTypeGenerateurPac("pac_air_air")).toBe(true);
		expect(isTypeGenerateurPac("pac_air_eau")).toBe(true);
		expect(isTypeGenerateurPac("pac_eau_eau")).toBe(true);
		expect(isTypeGenerateurPac("pac_eau_glycolee_eau")).toBe(true);
		expect(isTypeGenerateurPac("pac_geothermique")).toBe(true);
		expect(isTypeGenerateurPac("autre_systeme_thermodynamique")).toBe(true);
		expect(isTypeGenerateurPac("autre")).toBe(false);
		expect(isTypeGenerateurPac("reseau_froid")).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 3. Hiérarchie de types — pas de bug systémique d'héritage à documenter ici
//
// Contrairement à `ecs`/`chauffage`, la hiérarchie de `refroidissement` est
// plate : `GenerateurPAC`, `GenerateurClimatiseur` et `GenerateurReseauFroid`
// dérivent chacun directement de `GenerateurBase.extend({...})` (un seul
// niveau), il n'existe pas de type intermédiaire de "famille" au travers
// duquel une contrainte `non_applicable` pourrait être silencieusement
// perdue. Le bug de régression documenté dans ecs.test.ts / chauffage.test.ts
// (héritage à deux niveaux via des types intermédiaires non correctement
// chaînés) n'a donc pas d'équivalent ici. On verrouille malgré tout que les
// surcharges `non_applicable` d'un seul niveau sont bien appliquées :
// ---------------------------------------------------------------------------

describe("Régression — reseau_froid_id forcé à non_applicable sur les branches non réseau", () => {
	it("rejette un GenerateurPAC avec reseau_froid_id renseigné", () => {
		const invalide = {
			...GENERATEUR_PAC,
			reseau_froid_id: "550e8400-e29b-41d4-a716-446655449999",
		};
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("rejette un GenerateurClimatiseur avec reseau_froid_id renseigné", () => {
		const invalide = {
			...GENERATEUR_CLIMATISEUR,
			reseau_froid_id: "550e8400-e29b-41d4-a716-446655449999",
		};
		expect(GenerateurClimatiseur.safeParse(invalide).success).toBe(false);
	});

	it("accepte toujours les versions valides correspondantes (pas de faux positif)", () => {
		expect(GenerateurPAC.safeParse(GENERATEUR_PAC).success).toBe(true);
		expect(GenerateurClimatiseur.safeParse(GENERATEUR_CLIMATISEUR).success).toBe(
			true,
		);
	});
});

// ---------------------------------------------------------------------------
// 4. Point de vigilance schéma — reseau_froid_id n'est PAS forcé non-null
//    sur GenerateurReseauFroid
//
// `GenerateurBase.reseau_froid_id` est `z.string().nullable().default(null)`.
// `GenerateurPAC` et `GenerateurClimatiseur` le surchargent explicitement en
// `non_applicable` (forcé à null), ce qui est cohérent : ces générateurs ne
// sont pas raccordés à un réseau de froid. En revanche `GenerateurReseauFroid`
// ne surcharge PAS ce champ : il hérite tel quel de la définition de base,
// donc `reseau_froid_id: null` est accepté même pour un générateur de type
// "reseau_froid" — alors qu'on attendrait plutôt un identifiant réel non-null
// pour retrouver le réseau de froid raccordé. Ce n'est pas nécessairement un
// bug (le champ pourrait être renseigné ailleurs, ou son remplissage différé),
// donc je ne touche pas au schéma — je documente juste le comportement actuel
// ci-dessous pour que ce soit tranché explicitement.
// ---------------------------------------------------------------------------

describe("Point de vigilance schéma — GenerateurReseauFroid.reseau_froid_id reste nullable", () => {
	it("accepte actuellement un GenerateurReseauFroid avec reseau_froid_id: null (aucune contrainte non-null au niveau du schéma)", () => {
		const sansId = { ...GENERATEUR_RESEAU_FROID, reseau_froid_id: null };
		expect(GenerateurReseauFroid.safeParse(sansId).success).toBe(true);
	});

	it("accepte bien sûr aussi un reseau_froid_id renseigné", () => {
		expect(GenerateurReseauFroid.safeParse(GENERATEUR_RESEAU_FROID).success).toBe(
			true,
		);
	});
});

// ---------------------------------------------------------------------------
// 5. Régression — énergie restreinte par branche
// ---------------------------------------------------------------------------

describe("Régression — GenerateurPAC.energie restreinte à electricite", () => {
	it("rejette gaz_naturel", () => {
		const invalide = { ...GENERATEUR_PAC, energie: "gaz_naturel" };
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("rejette gpl", () => {
		const invalide = { ...GENERATEUR_PAC, energie: "gpl" };
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("rejette reseau_froid", () => {
		const invalide = { ...GENERATEUR_PAC, energie: "reseau_froid" };
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("accepte electricite", () => {
		expect(GenerateurPAC.safeParse(GENERATEUR_PAC).success).toBe(true);
	});
});

describe("Régression — GenerateurClimatiseur.energie exclut reseau_froid", () => {
	it("rejette reseau_froid", () => {
		const invalide = { ...GENERATEUR_CLIMATISEUR, energie: "reseau_froid" };
		expect(GenerateurClimatiseur.safeParse(invalide).success).toBe(false);
	});

	it("accepte electricite / gaz_naturel / gpl", () => {
		for (const energie of ["electricite", "gaz_naturel", "gpl"]) {
			expect(
				GenerateurClimatiseur.safeParse({ ...GENERATEUR_CLIMATISEUR, energie })
					.success,
			).toBe(true);
		}
	});
});

describe("Régression — GenerateurReseauFroid.energie restreinte à reseau_froid", () => {
	it("rejette electricite", () => {
		const invalide = { ...GENERATEUR_RESEAU_FROID, energie: "electricite" };
		expect(GenerateurReseauFroid.safeParse(invalide).success).toBe(false);
	});

	it("accepte reseau_froid", () => {
		expect(GenerateurReseauFroid.safeParse(GENERATEUR_RESEAU_FROID).success).toBe(
			true,
		);
	});
});

// ---------------------------------------------------------------------------
// 6. Régression — type restreint par branche (union discriminée par type)
// ---------------------------------------------------------------------------

describe("Régression — le champ type est restreint à la bonne famille par branche", () => {
	it("GenerateurPAC rejette type: autre", () => {
		const invalide = { ...GENERATEUR_PAC, type: "autre" };
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("GenerateurClimatiseur rejette type: pac_air_air", () => {
		const invalide = { ...GENERATEUR_CLIMATISEUR, type: "pac_air_air" };
		expect(GenerateurClimatiseur.safeParse(invalide).success).toBe(false);
	});

	it("GenerateurReseauFroid rejette type: autre", () => {
		const invalide = { ...GENERATEUR_RESEAU_FROID, type: "autre" };
		expect(GenerateurReseauFroid.safeParse(invalide).success).toBe(false);
	});

	it.each([
		"pac_air_air",
		"pac_air_eau",
		"pac_eau_eau",
		"pac_eau_glycolee_eau",
		"pac_geothermique",
		"autre_systeme_thermodynamique",
	] as const)("GenerateurPAC accepte le type %s", (type) => {
		expect(GenerateurPAC.safeParse({ ...GENERATEUR_PAC, type }).success).toBe(
			true,
		);
	});
});

// ---------------------------------------------------------------------------
// 7. Régression — seer doit être strictement positif (ou null)
// ---------------------------------------------------------------------------

describe("Régression — GenerateurBase.seer strictement positif ou null", () => {
	it("rejette seer = 0 (nombre_positif = gt(0), la borne n'est pas incluse)", () => {
		const invalide = { ...GENERATEUR_PAC, seer: 0 };
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("rejette seer négatif", () => {
		const invalide = { ...GENERATEUR_PAC, seer: -1 };
		expect(GenerateurPAC.safeParse(invalide).success).toBe(false);
	});

	it("accepte seer strictement positif", () => {
		expect(GenerateurPAC.safeParse({ ...GENERATEUR_PAC, seer: 0.1 }).success).toBe(
			true,
		);
	});

	it("accepte seer = null", () => {
		expect(GenerateurPAC.safeParse({ ...GENERATEUR_PAC, seer: null }).success).toBe(
			true,
		);
	});
});

// ---------------------------------------------------------------------------
// 8. Installation — surface strictement positive, au moins un générateur
// ---------------------------------------------------------------------------

const INSTALLATION: Installation = {
	id: "550e8400-e29b-41d4-a716-446655440010",
	description: "Installation de rafraîchissement",
	surface: 80,
	generateurs: [GENERATEUR_PAC.id],
};

describe("Régression — Installation.surface strictement positive (nombre_positif = gt(0))", () => {
	it("rejette surface = 0", () => {
		expect(Installation.safeParse({ ...INSTALLATION, surface: 0 }).success).toBe(
			false,
		);
	});

	it("rejette surface négative", () => {
		expect(
			Installation.safeParse({ ...INSTALLATION, surface: -10 }).success,
		).toBe(false);
	});

	it("accepte une surface strictement positive", () => {
		expect(Installation.safeParse(INSTALLATION).success).toBe(true);
	});
});

describe("Régression — Installation.generateurs exige au moins un id (min(1))", () => {
	it("rejette un tableau de générateurs vide", () => {
		expect(
			Installation.safeParse({ ...INSTALLATION, generateurs: [] }).success,
		).toBe(false);
	});

	it("accepte un tableau contenant au moins un id", () => {
		expect(Installation.safeParse(INSTALLATION).success).toBe(true);
	});
});

// ---------------------------------------------------------------------------
// 9. Refroidissement — union Vide / NonVide, cardinalités croisées
// ---------------------------------------------------------------------------

describe("Refroidissement — RefroidissementVide impose des tableaux vides (max(0))", () => {
	it("accepte generateurs: [] et installations: []", () => {
		expect(
			RefroidissementVide.safeParse({ generateurs: [], installations: [] })
				.success,
		).toBe(true);
	});

	it("rejette un générateur présent", () => {
		expect(
			RefroidissementVide.safeParse({
				generateurs: [GENERATEUR_PAC],
				installations: [],
			}).success,
		).toBe(false);
	});
});

describe("Refroidissement — RefroidissementNonVide impose au moins un élément (min(1))", () => {
	it("accepte au moins un générateur et une installation", () => {
		expect(
			RefroidissementNonVide.safeParse({
				generateurs: [GENERATEUR_PAC],
				installations: [INSTALLATION],
			}).success,
		).toBe(true);
	});

	it("rejette des tableaux vides", () => {
		expect(
			RefroidissementNonVide.safeParse({ generateurs: [], installations: [] })
				.success,
		).toBe(false);
	});
});

describe("Régression — l'union Refroidissement rejette les états mixtes (ni vide, ni non-vide)", () => {
	it("rejette 1 générateur mais 0 installation", () => {
		const mixte = {
			generateurs: [GENERATEUR_PAC],
			installations: [],
		};
		expect(RefroidissementVide.safeParse(mixte).success).toBe(false);
		expect(RefroidissementNonVide.safeParse(mixte).success).toBe(false);
	});

	it("rejette 0 générateur mais 1 installation", () => {
		const mixte = {
			generateurs: [],
			installations: [INSTALLATION],
		};
		expect(RefroidissementVide.safeParse(mixte).success).toBe(false);
		expect(RefroidissementNonVide.safeParse(mixte).success).toBe(false);
	});
});

// ---------------------------------------------------------------------------
// 10. Helpers
// ---------------------------------------------------------------------------

const REFROIDISSEMENT: Refroidissement = {
	generateurs: [GENERATEUR_PAC, GENERATEUR_CLIMATISEUR],
	installations: [INSTALLATION],
};

describe("getters par id — succès", () => {
	it("findGenerateur retrouve le générateur par id", () => {
		expect(findGenerateur(GENERATEUR_PAC.id, REFROIDISSEMENT)).toBe(
			GENERATEUR_PAC,
		);
	});

	it("findInstallation retrouve l'installation par id", () => {
		expect(findInstallation(INSTALLATION.id, REFROIDISSEMENT)).toBe(
			INSTALLATION,
		);
	});
});

describe("getters par id — échec", () => {
	it("findGenerateur lève EntityNotFoundError si absent", () => {
		expect(() => findGenerateur("inconnu", REFROIDISSEMENT)).toThrow(
			EntityNotFoundError,
		);
		expect(() => findGenerateur("inconnu", REFROIDISSEMENT)).toThrow(
			"Generateur with id inconnu not found",
		);
	});

	it("findInstallation lève EntityNotFoundError si absent", () => {
		expect(() => findInstallation("inconnu", REFROIDISSEMENT)).toThrow(
			EntityNotFoundError,
		);
		expect(() => findInstallation("inconnu", REFROIDISSEMENT)).toThrow(
			"Installation with id inconnu not found",
		);
	});
});
