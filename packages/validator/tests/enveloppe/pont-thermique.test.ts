import { describe, expect, it } from "vitest";
import type { enveloppe } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2 } from "../helpers.js";

describe("isPontThermique — guard", () => {
	it("accepte un pont thermique refend-mur", () => {
		const liaison: enveloppe.pontThermique.RefendMur = {
			type: "refend_mur",
			mur_id: UUID2,
			plancher_id: null,
			ouverture_id: null,
			pont_thermique_partiel: false,
		};
		const pt: enveloppe.pontThermique.PontThermique = {
			id: UUID,
			description: "Pont thermique refend-mur",
			longueur: 2.5,
			kpt: null,
			liaison,
		};
		expect(validator.enveloppe.isPontThermique(pt)).toBe(true);
	});

	it("accepte un pont thermique plancher-bas-mur", () => {
		const liaison: enveloppe.pontThermique.PlancherBasMur = {
			type: "plancher_bas_mur",
			mur_id: UUID2,
			plancher_id: UUID2,
			ouverture_id: null,
			pont_thermique_partiel: false,
		};
		const pt: enveloppe.pontThermique.PontThermique = {
			id: UUID,
			description: "Liaison plancher bas - mur",
			longueur: 10,
			kpt: 0.5,
			liaison,
		};
		expect(validator.enveloppe.isPontThermique(pt)).toBe(true);
	});

	it("accepte un pont thermique baie-mur", () => {
		const liaison: enveloppe.pontThermique.BaieMur = {
			type: "baie_mur",
			mur_id: UUID2,
			plancher_id: null,
			ouverture_id: UUID2,
			pont_thermique_partiel: false,
		};
		const pt: enveloppe.pontThermique.PontThermique = {
			id: UUID,
			description: "Liaison baie - mur",
			longueur: 3,
			kpt: 0.1,
			liaison,
		};
		expect(validator.enveloppe.isPontThermique(pt)).toBe(true);
	});
});
