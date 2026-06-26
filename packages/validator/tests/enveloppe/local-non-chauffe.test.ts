import { describe, expect, it } from "vitest";
import type { enveloppe } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2 } from "../helpers.js";

const PAROI_LNC: enveloppe.localNonChauffe.paroi.Paroi = {
	id: UUID2,
	description: "Paroi extérieure",
	isolation: null,
	position: { mitoyennete: "exterieur", surface: 10 },
};

const BAIE_LNC: enveloppe.localNonChauffe.baie.Baie = {
	id: UUID2,
	description: "Fenêtre LNC",
	type_vitrage: "double_vitrage",
	materiau_menuiserie: "pvc",
	presence_rupteur_pont_thermique: null,
	position: {
		mitoyennete: "exterieur",
		surface: 2,
		orientation: "sud",
		inclinaison: 90,
	},
};

describe("isLocalNonChauffe — guard", () => {
	it("accepte un garage (autre local non chauffé)", () => {
		const lnc: enveloppe.localNonChauffe.AutreLocalNonChauffe = {
			id: UUID,
			description: "Garage attenant",
			type: "garage",
			parois: [PAROI_LNC],
			baies: [],
		};
		expect(validator.enveloppe.isLocalNonChauffe(lnc)).toBe(true);
	});

	it("accepte un espace tampon solarisé", () => {
		const lnc: enveloppe.localNonChauffe.EspaceTamponSolarise = {
			id: UUID,
			description: "Véranda",
			type: "espace_tampon_solarise",
			parois: [],
			baies: [BAIE_LNC],
		};
		expect(validator.enveloppe.isLocalNonChauffe(lnc)).toBe(true);
	});
});
