import { describe, expect, it } from "vitest";
import {
	isEspaceTamponSolarise,
	isAutreLocalNonChauffe,
	type EspaceTamponSolarise,
	type AutreLocalNonChauffe,
} from "../../src/enveloppe/local-non-chauffe.js";

const ESPACE_TAMPON: EspaceTamponSolarise = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	description: "Véranda",
	type: "espace_tampon_solarise",
	parois: [],
	baies: [
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			description: "Fenêtre véranda",
			type_vitrage: "double_vitrage",
			materiau_menuiserie: "pvc",
			presence_rupteur_pont_thermique: null,
			position: {
				mitoyennete: "exterieur",
				surface: 2,
				orientation: "sud",
				inclinaison: 90,
			},
		},
	],
};

const GARAGE: AutreLocalNonChauffe = {
	id: "550e8400-e29b-41d4-a716-446655440000",
	description: "Garage attenant",
	type: "garage",
	parois: [
		{
			id: "550e8400-e29b-41d4-a716-446655440001",
			description: "Paroi extérieure",
			isolation: null,
			position: { mitoyennete: "exterieur", surface: 10 },
		},
	],
	baies: [],
};

describe("isEspaceTamponSolarise", () => {
	it("vrai uniquement pour type=espace_tampon_solarise", () => {
		expect(isEspaceTamponSolarise(ESPACE_TAMPON)).toBe(true);
		expect(isEspaceTamponSolarise(GARAGE)).toBe(false);
	});
});

describe("isAutreLocalNonChauffe", () => {
	it("vrai pour tout type différent de espace_tampon_solarise", () => {
		expect(isAutreLocalNonChauffe(GARAGE)).toBe(true);
		expect(isAutreLocalNonChauffe(ESPACE_TAMPON)).toBe(false);
	});
});
