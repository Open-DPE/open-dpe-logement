import { describe, expect, it } from "vitest";
import type { batiment } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, p } from "../helpers.js";

describe("isAppartement — guard", () => {
	it("accepte un appartement valide", () => {
		const appartement: batiment.appartement.Appartement = {
			id: UUID,
			description: "Appartement T2 au 3e étage",
			surface_habitable: p(50),
			hauteur_sous_plafond: p(2.5),
			position: "etage_intermediaire",
			typologie: "T2",
		};
		expect(validator.batiment.isAppartement(appartement)).toBe(true);
	});
});
