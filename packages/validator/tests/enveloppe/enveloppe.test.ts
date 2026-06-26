import { describe, expect, it } from "vitest";
import type { enveloppe } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID } from "../helpers.js";

const NIVEAU: enveloppe.niveau.Niveau = {
	id: UUID,
	description: "RDC",
	surface: 80,
	inertie_paroi_verticale: null,
	inertie_plancher_bas: null,
	inertie_plancher_haut: null,
};

describe("isEnveloppe — guard", () => {
	it("accepte une Enveloppe valide", () => {
		const fixture: enveloppe.Enveloppe = {
			exposition: "simple",
			q4pa_conv: null,
			presence_brasseurs_air: false,
			niveaux: [NIVEAU],
			locaux_non_chauffes: [],
			murs: [],
			planchers_hauts: [],
			planchers_bas: [],
			baies: [],
			portes: [],
			ponts_thermiques: [],
		};
		expect(validator.enveloppe.isEnveloppe(fixture)).toBe(true);
	});
});
