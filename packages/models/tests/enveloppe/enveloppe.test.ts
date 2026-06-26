import { describe, expect, it } from "vitest";
import {
	getMur,
	getBaie,
	getPorte,
	getPlancherHaut,
	getPlancherBas,
	getLocalNonChauffe,
	getParoisLocalNonChauffe,
	getBaiesLocalNonChauffe,
	getMursLocalNonChauffe,
	type Enveloppe,
} from "../../src/enveloppe/enveloppe.js";
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
	menuiserie: null,
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
	vitrage: null,
};

const LNC = {
	id: LNC_ID,
	description: "Garage attenant",
	type: "garage" as const,
	parois: [MUR_LNC],
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
	it("getMur retrouve le mur par id", () => {
		expect(getMur(ENVELOPPE, MUR_EXT.id)).toBe(MUR_EXT);
	});

	it("getBaie retrouve la baie par id", () => {
		expect(getBaie(ENVELOPPE, BAIE_LNC.id)).toBe(BAIE_LNC);
	});

	it("getPorte retrouve la porte par id", () => {
		expect(getPorte(ENVELOPPE, PORTE.id)).toBe(PORTE);
	});

	it("getLocalNonChauffe retrouve le local par id", () => {
		expect(getLocalNonChauffe(ENVELOPPE, LNC_ID)).toBe(LNC);
	});
});

describe("getters par id — échec", () => {
	it("getMur lève EntityNotFoundError si absent", () => {
		expect(() => getMur(ENVELOPPE, "inconnu")).toThrow(EntityNotFoundError);
		expect(() => getMur(ENVELOPPE, "inconnu")).toThrow("Mur with id inconnu not found");
	});

	it("getPlancherHaut lève EntityNotFoundError si absent", () => {
		expect(() => getPlancherHaut(ENVELOPPE, "inconnu")).toThrow(EntityNotFoundError);
	});

	it("getPlancherBas lève EntityNotFoundError si absent", () => {
		expect(() => getPlancherBas(ENVELOPPE, "inconnu")).toThrow(EntityNotFoundError);
	});

	it("getLocalNonChauffe lève EntityNotFoundError si absent", () => {
		expect(() => getLocalNonChauffe(ENVELOPPE, "inconnu")).toThrow(EntityNotFoundError);
	});
});

describe("filtres par local non chauffé", () => {
	it("getParoisLocalNonChauffe regroupe murs/baies/portes rattachés au LNC", () => {
		const parois = getParoisLocalNonChauffe(ENVELOPPE, LNC_ID);
		expect(parois).toContain(MUR_LNC);
		expect(parois).toContain(BAIE_LNC);
		expect(parois).not.toContain(MUR_EXT);
		expect(parois).not.toContain(PORTE);
	});

	it("getBaiesLocalNonChauffe ne retourne que les baies du LNC", () => {
		expect(getBaiesLocalNonChauffe(ENVELOPPE, LNC_ID)).toEqual([BAIE_LNC]);
	});

	it("getMursLocalNonChauffe ne retourne que les murs du LNC", () => {
		expect(getMursLocalNonChauffe(ENVELOPPE, LNC_ID)).toEqual([MUR_LNC]);
	});

	it("retourne un tableau vide pour un local sans parois associées", () => {
		expect(getMursLocalNonChauffe(ENVELOPPE, "autre-lnc")).toEqual([]);
	});
});
