import { describe, expect, it } from "vitest";
import type { batiment } from "@open-dpe-logement/models";
import * as validator from "@open-dpe-logement/validator";
import { UUID, UUID2, ADRESSE, p } from "../helpers.js";

const APPT: batiment.appartement.Appartement = {
	id: UUID2,
	description: "T2 étage",
	surface_habitable: p(50),
	hauteur_sous_plafond: p(2.5),
	position: "etage_intermediaire",
	typologie: "T2",
};

describe("isBatiment — guard", () => {
	it("accepte une Maison valide", () => {
		const maison: batiment.Maison = {
			type: "maison",
			annee_construction: 1990,
			annee_renovation: null,
			altitude: 100,
			logements: 1,
			surface_habitable: p(80),
			hauteur_sous_plafond: p(2.5),
			materiaux_anciens: false,
			rnb_id: null,
			adresse: ADRESSE,
			appartements_visites: [],
			logement: null,
		};
		expect(validator.batiment.isBatiment(maison)).toBe(true);
	});

	it("accepte un Immeuble valide", () => {
		const immeuble: batiment.Immeuble = {
			type: "immeuble",
			annee_construction: 1970,
			annee_renovation: 2010,
			altitude: 50,
			logements: 10,
			surface_habitable: p(800),
			hauteur_sous_plafond: p(2.7),
			materiaux_anciens: false,
			rnb_id: null,
			adresse: ADRESSE,
			appartements_visites: [APPT],
			logement: null,
		};
		expect(validator.batiment.isBatiment(immeuble)).toBe(true);
	});
});
