import { describe, expect, it } from "vitest";
import type { ecs } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2 } from "../helpers.js";

describe("isSysteme ECS — guard", () => {
	it("accepte un système ECS sans bouclage", () => {
		const systeme: ecs.systeme.Systeme = {
			id: UUID,
			description: "Système ECS individuel",
			generateur_id: UUID2,
			reseau: {
				alimentation_contigue: true,
				niveaux_desservis: 1,
				isolation: null,
				bouclage: null,
			},
		};
		expect(validator.ecs.isSysteme(systeme)).toBe(true);
	});

	it("accepte un système ECS avec bouclage", () => {
		const systeme: ecs.systeme.Systeme = {
			id: UUID,
			description: "Système ECS collectif bouclé",
			generateur_id: UUID2,
			reseau: {
				alimentation_contigue: false,
				niveaux_desservis: 5,
				isolation: true,
				bouclage: "boucle",
			},
		};
		expect(validator.ecs.isSysteme(systeme)).toBe(true);
	});
});
