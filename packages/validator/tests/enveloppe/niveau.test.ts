import { describe, expect, it } from "vitest";
import type { enveloppe } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID } from "../helpers.js";

describe("isNiveau — guard", () => {
	it("accepte un niveau valide sans inertie", () => {
		const niveau: enveloppe.niveau.Niveau = {
			id: UUID,
			description: "RDC",
			surface: 80,
			inertie_paroi_verticale: null,
			inertie_plancher_bas: null,
			inertie_plancher_haut: null,
		};
		expect(validator.enveloppe.isNiveau(niveau)).toBe(true);
	});

	it("accepte un niveau valide avec inertie", () => {
		const niveau: enveloppe.niveau.Niveau = {
			id: UUID,
			description: "Étage",
			surface: 80,
			inertie_paroi_verticale: "lourde",
			inertie_plancher_bas: "legere",
			inertie_plancher_haut: "lourde",
		};
		expect(validator.enveloppe.isNiveau(niveau)).toBe(true);
	});
});
