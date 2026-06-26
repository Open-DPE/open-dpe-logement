import { describe, expect, it } from "vitest";
import type { chauffage } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID } from "../helpers.js";

describe("isEmetteur — guard", () => {
	it("accepte un radiateur bitube", () => {
		const emetteur: chauffage.emetteur.Emetteur = {
			id: UUID,
			description: "Radiateur bitube acier",
			type: "radiateur_bitube",
			temperature_distribution: "moyenne",
			presence_robinet_thermostatique: true,
			annee_installation: null,
		};
		expect(validator.chauffage.isEmetteur(emetteur)).toBe(true);
	});

	it("accepte un plancher chauffant", () => {
		const emetteur: chauffage.emetteur.Emetteur = {
			id: UUID,
			description: "Plancher chauffant eau",
			type: "plancher_chauffant",
			temperature_distribution: "basse",
			presence_robinet_thermostatique: false,
			annee_installation: 2015,
		};
		expect(validator.chauffage.isEmetteur(emetteur)).toBe(true);
	});
});
