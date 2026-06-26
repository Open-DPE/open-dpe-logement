import { describe, expect, it } from "vitest";
import type { production } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID } from "../helpers.js";

describe("isPanneauPhotovoltaique — guard", () => {
	it("accepte des panneaux en toiture orientés sud", () => {
		const panneau: production.panneauPhotovoltaique.PanneauPhotovoltaique = {
			id: UUID,
			description: "Panneaux toiture sud",
			orientation: "sud",
			inclinaison: 30,
			modules: 12,
			surface: null,
			installation_collective: false,
		};
		expect(validator.production.isPanneauPhotovoltaique(panneau)).toBe(true);
	});
});
