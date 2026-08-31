import * as z from "zod";
import { id, description, surface, hauteur } from "../../common/types.js";
import { PositionAppartement, TypologieAppartement } from "./enums.js";

export const Appartement = z.object({
	id,
	description,
	surface_habitable: surface,
	hauteur_sous_plafond: hauteur,
	position: PositionAppartement,
	typologie: TypologieAppartement,
});

export type Appartement = z.infer<typeof Appartement>;
