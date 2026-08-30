import { describe, expect, it } from "vitest";
import {
	findMur,
	findBaie,
	findPorte,
	findPlancherHaut,
	findPlancherBas,
	findLocalNonChauffe,
	findParoisLocalNonChauffe,
	findBaiesLocalNonChauffe,
	findMursLocalNonChauffe,
	type Enveloppe,
} from "../../src/enveloppe/index.js";
import { EntityNotFoundError } from "../../src/errors.js";

const LNC_ID = "550e8400-e29b-41d4-a716-446655440099";

const MUR_LNC = {
	id: "550e8400-e29b-41d4-a716-446655440001",
	description: "Mur sur local non chauffé",
	structures: [],
	type_doublage: null,
	presence_enduit_isolant: null,
	inertie: null,
	annee_construction: null,
	annee_renovation: null,
	u0: null,
	u: null,
	position: { surface: 10, mitoyennete: "local_non_chauffe" as const, local_non_chauffe_id: LNC_ID },
	isolation: { etat: false, type: null, annee_installation: null, epaisseur: null, resistance_thermique: null },
};

const MUR_EXT = {
	id: "550e8400-e29b-41d4-a716-446655440002",
	description: "Mur extérieur",
	structures: [],
	type_doublage: null,
	presence_enduit_isolant: null,
	inertie: null,
	annee_construction: null,
	annee_renovation: null,
	u0: null,
	u: null,
	position: { surface: 20, mitoyennete: "exterieur" as const, local_non_chauffe_id: null },
	isolation: { etat: false, type: null, annee_installation: null, epaisseur: null, resistance_thermique: null },
};

const BAIE_LNC = {
	id: "550e8400-e29b-41d4-a716-446655440003",
	description: "Baie sur LNC",
	type: "fenetre_battante" as const,
	presence_protection_solaire: false,
	type_fermeture: "sans_fermeture" as const,
	annee_installation: null,
	ug: null,
	uw: null,
	ujn: null,
	sw: null,
	position: {
		surface: 2,
		mitoyennete: "local_non_chauffe" as const,
		local_non_chauffe_id: LNC_ID,
		paroi_id: null,
		baie_id: null,
		type_pose: "nu_interieur" as const,
		inclinaison: 90 as const,
		orientation: "nord" as const,
		masques: [],
	},
	menuiserie: {
		materiau: null,
		largeur_dormant: null,
		presence_soubassement: false,
		presence_joint: null,
		presence_retour_isolation: null,
		presence_rupteur_pont_thermique: null,
	},
	vitrage: { type: "simple_vitrage" as const, nature_lame: null, epaisseur_lame: null },
	survitrage: null,
};

const PORTE = {
	id: "550e8400-e29b-41d4-a716-446655440004",
	description: "Porte d'entrée",
	isolation: null,
	materiau: null,
	annee_installation: null,
	u: null,
	position: {
		surface: 2,
		mitoyennete: "exterieur" as const,
		local_non_chauffe_id: null,
		paroi_id: null,
		type_pose: "nu_interieur" as const,
		presence_sas: false,
	},
	menuiserie: { largeur_dormant: null, presence_joint: null, presence_retour_isolation: null },
	vitrage: { surface: 0 as const, type: null },
};

const LNC = {
	id: LNC_ID,
	description: "Garage attenant",
	type: "garage" as const,
	parois: [
		{
			id: "550e8400-e29b-41d4-a716-446655440006",
			description: "Paroi enterrée du local",
			isolation: null,
			position: { mitoyennete: "enterre" as const, surface: 5 },
		},
	],
	baies: [],
};

const ENVELOPPE: Enveloppe = {
	exposition: "simple",
	q4pa_conv: null,
	presence_brasseurs_air: false,
	niveaux: [
		{
			id: "550e8400-e29b-41d4-a716-446655440005",
			description: "RDC",
			surface: 80,
			inertie_paroi_verticale: null,
			inertie_plancher_bas: null,
			inertie_plancher_haut: null,
		},
	],
	locaux_non_chauffes: [LNC],
	murs: [MUR_LNC, MUR_EXT],
	planchers_hauts: [],
	planchers_bas: [],
	baies: [BAIE_LNC],
	portes: [PORTE],
	ponts_thermiques: [],
};

describe("getters par id — succès", () => {
	it("findMur retrouve le mur par id", () => {
		expect(findMur(MUR_EXT.id, ENVELOPPE)).toBe(MUR_EXT);
	});

	it("findBaie retrouve la baie par id", () => {
		expect(findBaie(BAIE_LNC.id, ENVELOPPE)).toBe(BAIE_LNC);
	});

	it("findPorte retrouve la porte par id", () => {
		expect(findPorte(PORTE.id, ENVELOPPE)).toBe(PORTE);
	});

	it("findLocalNonChauffe retrouve le local par id", () => {
		expect(findLocalNonChauffe(LNC_ID, ENVELOPPE)).toBe(LNC);
	});
});

describe("getters par id — échec", () => {
	it("findMur lève EntityNotFoundError si absent", () => {
		expect(() => findMur("inconnu", ENVELOPPE)).toThrow(EntityNotFoundError);
		expect(() => findMur("inconnu", ENVELOPPE)).toThrow("Mur with id inconnu not found");
	});

	it("findPlancherHaut lève EntityNotFoundError si absent", () => {
		expect(() => findPlancherHaut("inconnu", ENVELOPPE)).toThrow(EntityNotFoundError);
	});

	it("findPlancherBas lève EntityNotFoundError si absent", () => {
		expect(() => findPlancherBas("inconnu", ENVELOPPE)).toThrow(EntityNotFoundError);
	});

	it("findLocalNonChauffe lève EntityNotFoundError si absent", () => {
		expect(() => findLocalNonChauffe("inconnu", ENVELOPPE)).toThrow(EntityNotFoundError);
	});
});

describe("filtres par local non chauffé", () => {
	it("findParoisLocalNonChauffe regroupe murs/baies/portes rattachés au LNC", () => {
		const parois = findParoisLocalNonChauffe(LNC_ID, ENVELOPPE);
		expect(parois).toContain(MUR_LNC);
		expect(parois).toContain(BAIE_LNC);
		expect(parois).not.toContain(MUR_EXT);
		expect(parois).not.toContain(PORTE);
	});

	it("findBaiesLocalNonChauffe ne retourne que les baies du LNC", () => {
		expect(findBaiesLocalNonChauffe(LNC_ID, ENVELOPPE)).toEqual([BAIE_LNC]);
	});

	it("findMursLocalNonChauffe ne retourne que les murs du LNC", () => {
		expect(findMursLocalNonChauffe(LNC_ID, ENVELOPPE)).toEqual([MUR_LNC]);
	});

	it("retourne un tableau vide pour un local sans parois associées", () => {
		expect(findMursLocalNonChauffe("autre-lnc", ENVELOPPE)).toEqual([]);
	});
});
