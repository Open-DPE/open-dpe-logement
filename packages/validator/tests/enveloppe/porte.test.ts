import { describe, expect, it } from "vitest";
import type { enveloppe } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, p } from "../helpers.js";

describe("isPorte — guard", () => {
	it("accepte une porte sans vitrage", () => {
		const porte: enveloppe.porte.Porte = {
			id: UUID,
			description: "Porte d'entrée",
			isolation: null,
			materiau: null,
			annee_installation: null,
			u: null,
			position: {
				surface: p(2),
				mitoyennete: "exterieur",
				local_non_chauffe_id: null,
				paroi_id: null,
				type_pose: "nu_interieur",
				presence_sas: false,
			},
			menuiserie: {
				largeur_dormant: null,
				presence_joint: null,
				presence_retour_isolation: null,
			},
			vitrage: null,
		};
		expect(validator.enveloppe.isPorte(porte)).toBe(true);
	});

	it("accepte une porte vitrée", () => {
		const porte: enveloppe.porte.Porte = {
			id: UUID,
			description: "Porte vitrée double vitrage",
			isolation: true,
			materiau: "pvc",
			annee_installation: 2015,
			u: p(1.4),
			position: {
				surface: p(2.5),
				mitoyennete: "exterieur",
				local_non_chauffe_id: null,
				paroi_id: null,
				type_pose: "nu_exterieur",
				presence_sas: false,
			},
			menuiserie: {
				largeur_dormant: 60,
				presence_joint: true,
				presence_retour_isolation: false,
			},
			vitrage: {
				surface: 1.2,
				type: "double_vitrage",
			},
		};
		expect(validator.enveloppe.isPorte(porte)).toBe(true);
	});
});
