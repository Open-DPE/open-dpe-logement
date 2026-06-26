import { describe, expect, it } from "vitest";
import type { chauffage } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2 } from "../helpers.js";

describe("isSysteme chauffage — guard", () => {
	it("accepte un système divise", () => {
		const systeme: chauffage.systeme.SystemeDivise = {
			id: UUID,
			description: "Système divise PAC",
			type: "divise",
			generateur_id: UUID2,
			reseau: null,
		};
		expect(validator.chauffage.isSysteme(systeme)).toBe(true);
	});

	it("accepte un système central hydraulique", () => {
		const systeme: chauffage.systeme.SystemeCentral = {
			id: UUID,
			description: "Système central chaudière",
			type: "central",
			generateur_id: UUID2,
			reseau: {
				type_distribution: "hydraulique",
				presence_fluide_frigorigene: false,
				presence_circulateur_externe: true,
				niveaux_desservis: 3,
				isolation: null,
				temperature_distribution: "moyenne",
				emetteurs: [UUID2],
			},
		};
		expect(validator.chauffage.isSysteme(systeme)).toBe(true);
	});
});
