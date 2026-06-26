import { describe, expect, it } from "vitest";
import {
	getSystemes,
	getSysteme,
	getEmetteur,
	getGenerateur,
	getInstallationBySysteme,
	type Chauffage,
} from "../../src/chauffage/chauffage.js";
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
	installation_collective: false,
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
	it("getSysteme retrouve le système par id", () => {
		expect(getSysteme(CHAUFFAGE, SYSTEME.id)).toBe(SYSTEME);
	});

	it("getEmetteur retrouve l'émetteur par id", () => {
		expect(getEmetteur(CHAUFFAGE, EMETTEUR.id)).toBe(EMETTEUR);
	});

	it("getGenerateur retrouve le générateur par id", () => {
		expect(getGenerateur(CHAUFFAGE, GENERATEUR.id)).toBe(GENERATEUR);
	});

	it("getInstallationBySysteme retrouve l'installation contenant le système", () => {
		expect(getInstallationBySysteme(CHAUFFAGE, SYSTEME.id)).toBe(INSTALLATION);
	});
});

describe("getters par id — échec", () => {
	it("getSysteme lève EntityNotFoundError si absent", () => {
		expect(() => getSysteme(CHAUFFAGE, "inconnu")).toThrow(EntityNotFoundError);
		expect(() => getSysteme(CHAUFFAGE, "inconnu")).toThrow("Systeme with id inconnu not found");
	});

	it("getEmetteur lève EntityNotFoundError si absent", () => {
		expect(() => getEmetteur(CHAUFFAGE, "inconnu")).toThrow(EntityNotFoundError);
	});

	it("getGenerateur lève EntityNotFoundError si absent", () => {
		expect(() => getGenerateur(CHAUFFAGE, "inconnu")).toThrow(EntityNotFoundError);
	});

	it("getInstallationBySysteme lève EntityNotFoundError si aucune installation ne contient ce système", () => {
		expect(() => getInstallationBySysteme(CHAUFFAGE, "inconnu")).toThrow(
			EntityNotFoundError,
		);
	});
});
