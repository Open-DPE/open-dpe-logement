import { v4 as uuidv4 } from "uuid";

export const APPARTEMENT = {
	id: uuidv4(),
	description: "Appartement de test",
	surface_habitable: 50,
	hauteur_sous_plafond: 2.5,
	position: "etage_intermediaire",
	typologie: "T2",
};
