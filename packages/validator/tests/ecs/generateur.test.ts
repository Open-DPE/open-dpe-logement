import { describe, expect, it } from "vitest";
import type { ecs } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, p } from "../helpers.js";

const BASE_SIGNALETIQUE = {
	pn: null,
	cop: null,
	label: null,
	mode_combustion: null,
	presence_ventouse: null,
	pveilleuse: null,
	qp0: null,
	rpn: null,
};

describe("isGenerateur ECS — guard", () => {
	it("accepte un chauffe-eau électrique vertical", () => {
		const gen: ecs.generateur.ChauffeEauElectrique = {
			id: UUID,
			description: "Chauffe-eau électrique 200L",
			type: "chauffe_eau",
			energie: "electricite",
			bienergie: null,
			annee_installation: 2015,
			position: {
				position_chauffe_eau: "chauffe_eau_vertical",
				generateur_collectif: false,
				generateur_multi_batiment: false,
				position_volume_chauffe: false,
				generateur_mixte_id: null,
				reseau_chaleur_id: null,
			},
			stockage: { volume: 200, type: "integre", position_volume_chauffe: false },
			signaletique: { ...BASE_SIGNALETIQUE, pn: p(2.5) },
		};
		expect(validator.ecs.isGenerateur(gen)).toBe(true);
	});

	it("accepte un chauffe-eau thermodynamique air ambiant", () => {
		const gen: ecs.generateur.ChauffeEauThermodynamique = {
			id: UUID,
			description: "CET air ambiant",
			type: "cet_air_ambiant",
			energie: "electricite",
			bienergie: null,
			annee_installation: 2020,
			position: {
				position_chauffe_eau: null,
				generateur_collectif: false,
				generateur_multi_batiment: false,
				position_volume_chauffe: false,
				generateur_mixte_id: null,
				reseau_chaleur_id: null,
			},
			stockage: null,
			signaletique: { ...BASE_SIGNALETIQUE, cop: p(2.8) },
		};
		expect(validator.ecs.isGenerateur(gen)).toBe(true);
	});

	it("accepte un réseau de chaleur ECS", () => {
		const gen: ecs.generateur.ReseauChaleur = {
			id: UUID,
			description: "Réseau chaleur urbain ECS",
			type: "reseau_chaleur",
			energie: "reseau_chaleur",
			bienergie: null,
			annee_installation: null,
			position: {
				position_chauffe_eau: null,
				generateur_collectif: true,
				generateur_multi_batiment: true,
				position_volume_chauffe: false,
				generateur_mixte_id: null,
				reseau_chaleur_id: null,
			},
			stockage: null,
			signaletique: {
				pn: null,
				cop: null,
				label: null,
				mode_combustion: null,
				presence_ventouse: null,
				pveilleuse: null,
				qp0: null,
				rpn: null,
			},
		};
		expect(validator.ecs.isGenerateur(gen)).toBe(true);
	});

	it("accepte une chaudière à combustion ECS", () => {
		const gen: ecs.generateur.ChaudiereCombustion = {
			id: UUID,
			description: "Chaudière gaz ECS",
			type: "chaudiere",
			energie: "gaz_naturel",
			bienergie: null,
			annee_installation: 2005,
			position: {
				position_chauffe_eau: null,
				generateur_collectif: false,
				generateur_multi_batiment: false,
				position_volume_chauffe: false,
				generateur_mixte_id: null,
				reseau_chaleur_id: null,
			},
			stockage: null,
			signaletique: { ...BASE_SIGNALETIQUE, pn: p(24), rpn: p(0.9) },
		};
		expect(validator.ecs.isGenerateur(gen)).toBe(true);
	});
});
