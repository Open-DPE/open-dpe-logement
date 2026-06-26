import { describe, expect, it } from "vitest";
import type { ecs } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2, p } from "../helpers.js";

const SYSTEME: ecs.systeme.Systeme = {
	id: UUID2,
	description: "Système ECS",
	generateur_id: UUID2,
	reseau: {
		alimentation_contigue: true,
		niveaux_desservis: 1,
		isolation: null,
		bouclage: null,
	},
};

describe("isInstallation ECS — guard", () => {
	it("accepte une installation ECS individuelle avec 1 système", () => {
		const installation: ecs.installation.Installation = {
			id: UUID,
			description: "Installation ECS individuelle",
			surface: p(80),
			installation_collective: false,
			systemes: [SYSTEME],
			solaire_thermique: null,
		};
		expect(validator.ecs.isInstallation(installation)).toBe(true);
	});
});
