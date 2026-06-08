import { describe, expect, it } from "vitest";
import {
	isVentilation,
	Ventilation,
} from "../../src/ventilation/ventilation.js";
import { UUID } from "../helpers.js";

describe("isVentilation — guard", () => {
	it("accepte une ventilation valide", () => {
		const ventilation: Ventilation = {
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
		expect(isVentilation(ventilation)).toBe(true);
	});
});
