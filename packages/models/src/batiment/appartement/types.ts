import * as z from "zod";
import { id, description, surface, hauteur } from "../../common/types.js";
import { PositionEnum, TypologieEnum } from "./enums.js";

export const Appartement = z.object({
	id,
	description,
	surface_habitable: surface,
	hauteur_sous_plafond: hauteur,
	position: PositionEnum,
	typologie: TypologieEnum,
});

export type Appartement = z.infer<typeof Appartement>;
