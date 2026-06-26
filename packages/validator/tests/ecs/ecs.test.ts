import { describe, expect, it } from "vitest";
import type { ecs } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2, p } from "../helpers.js";

const GENERATEUR: ecs.generateur.ChauffeEauElectrique = {
	id: UUID,
	description: "Chauffe-eau électrique",
	type: "chauffe_eau",
	energie: "electricite",
	bienergie: null,
	annee_installation: 2010,
	position: {
		position_chauffe_eau: "chauffe_eau_vertical",
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: false,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	stockage: { volume: 200, type: "integre", position_volume_chauffe: false },
	signaletique: {
		pn: p(2.5),
		cop: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
	},
};

const SYSTEME: ecs.systeme.Systeme = {
	id: UUID2,
	description: "Système ECS",
	generateur_id: UUID,
	reseau: { alimentation_contigue: true, niveaux_desservis: 1, isolation: null, bouclage: null },
};

const INSTALLATION: ecs.installation.Installation = {
	id: UUID2,
	description: "Installation ECS",
	surface: p(80),
	installation_collective: false,
	systemes: [SYSTEME],
	solaire_thermique: null,
};

describe("isEcs — guard", () => {
	it("accepte un ECS valide", () => {
		const fixture: ecs.Ecs = {
			generateurs: [GENERATEUR],
			installations: [INSTALLATION],
		};
		expect(validator.ecs.isEcs(fixture)).toBe(true);
	});
});
