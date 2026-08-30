import { APPARTEMENT } from "./appartement/fixtures.js";

export const MAISON = {
	type: "maison",
	annee_construction: 1990,
	annee_renovation: null,
	altitude: 100,
	logements: 1,
	surface_habitable: 120,
	hauteur_sous_plafond: 2.5,
	materiaux_anciens: false,
	rnb_id: null,
	adresse: {
		ban_id: null,
		nom: "1 rue de la Paix",
		code_postal: "75001",
		code_insee: "75056",
		commune: "Paris",
	},
	appartements_visites: [],
	logement: null,
};

export const IMMEUBLE = {
	type: "immeuble",
	annee_construction: 1990,
	annee_renovation: null,
	altitude: 100,
	logements: 3,
	surface_habitable: 120,
	hauteur_sous_plafond: 2.5,
	materiaux_anciens: false,
	rnb_id: null,
	adresse: {
		ban_id: null,
		nom: "1 rue de la Paix",
		code_postal: "75001",
		code_insee: "75056",
		commune: "Paris",
	},
	appartements_visites: [APPARTEMENT],
	logement: null,
};

export const LOGEMENT = {
	description: "Logement de test",
	surface_habitable: 50,
	hauteur_sous_plafond: 2.5,
};
