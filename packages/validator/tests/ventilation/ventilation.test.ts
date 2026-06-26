import { describe, expect, it } from "vitest";
import type { ventilation } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID } from "../helpers.js";

describe("isVentilation — guard", () => {
	it("accepte une ventilation valide", () => {
		const fixture: ventilation.Ventilation = {
			installations: [
				{
					id: UUID,
					description: "Ventilation naturelle par fenêtres",
					surface: 80,
					type: "ventilation_ouverture_fenetres",
					annee_installation: null,
					installation_collective: null,
					presence_echangeur_thermique: null,
				},
			],
		};
		expect(validator.ventilation.isVentilation(fixture)).toBe(true);
	});
});
