import { describe, expect, it } from "vitest";
import type { chauffage } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2, p } from "../helpers.js";

const SYSTEME_DIVISE: chauffage.systeme.SystemeDivise = {
	id: UUID2,
	description: "Système divise",
	type: "divise",
	generateur_id: UUID2,
	reseau: null,
};

describe("isInstallation chauffage — guard", () => {
	it("accepte une installation de chauffage divise", () => {
		const installation: chauffage.installation.Installation = {
			id: UUID,
			description: "Installation chauffage principale",
			surface: p(80),
			type: "divise",
			installation_collective: false,
			comptage_individuel: null,
			regulation_terminale: null,
			programmation: "absent",
			solaire_thermique: null,
			systemes: [SYSTEME_DIVISE],
		};
		expect(validator.chauffage.isInstallation(installation)).toBe(true);
	});
});
