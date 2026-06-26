import { describe, expect, it } from "vitest";
import type { enveloppe } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, p } from "../helpers.js";

const POSITION_VERTICALE_NORD = {
	surface: p(2),
	mitoyennete: "exterieur" as const,
	local_non_chauffe_id: null,
	paroi_id: null,
	baie_id: null,
	type_pose: "nu_interieur" as const,
	inclinaison: 90 as const,
	orientation: "nord" as const,
	masques: [],
};

describe("isBaie — guard", () => {
	it("accepte une brique de verre", () => {
		const baie: enveloppe.baie.BaieBriqueVerre = {
			id: UUID,
			description: "Brique de verre pleine",
			type: "brique_verre_pleine",
			presence_protection_solaire: false,
			type_fermeture: "sans_fermeture",
			annee_installation: null,
			ug: null,
			uw: null,
			ujn: null,
			sw: null,
			position: POSITION_VERTICALE_NORD,
			menuiserie: null,
			vitrage: { type: "brique_verre", nature_lame: null, epaisseur_lame: null },
			survitrage: null,
		};
		expect(validator.enveloppe.isBaie(baie)).toBe(true);
	});

	it("accepte un polycarbonate", () => {
		const baie: enveloppe.baie.BaiePolycarbonate = {
			id: UUID,
			description: "Polycarbonate",
			type: "polycarbonate",
			presence_protection_solaire: false,
			type_fermeture: "sans_fermeture",
			annee_installation: null,
			ug: null,
			uw: null,
			ujn: null,
			sw: null,
			position: POSITION_VERTICALE_NORD,
			menuiserie: null,
			vitrage: { type: "polycarbonate", nature_lame: null, epaisseur_lame: null },
			survitrage: null,
		};
		expect(validator.enveloppe.isBaie(baie)).toBe(true);
	});

	it("accepte une fenêtre battante simple vitrage", () => {
		const baie: enveloppe.baie.BaieFenetreOuPorteFenetre = {
			id: UUID,
			description: "Fenêtre simple vitrage PVC",
			type: "fenetre_battante",
			presence_protection_solaire: false,
			type_fermeture: "sans_fermeture",
			annee_installation: 2000,
			ug: null,
			uw: null,
			ujn: null,
			sw: null,
			position: POSITION_VERTICALE_NORD,
			menuiserie: {
				materiau: "pvc",
				largeur_dormant: null,
				presence_soubassement: false,
				presence_joint: null,
				presence_retour_isolation: null,
				presence_rupteur_pont_thermique: null,
			},
			vitrage: { type: "simple_vitrage", nature_lame: null, epaisseur_lame: null },
			survitrage: null,
		};
		expect(validator.enveloppe.isBaie(baie)).toBe(true);
	});
});
