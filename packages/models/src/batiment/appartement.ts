import type { UUID } from "../common/common.js";
import { createGuard, buildEnum } from "../utils.js";

export const isAppartement = createGuard<Appartement>("/batiment/appartement");

/**
 * @see https://schemas.open-dpe.fr/batiment/appartement
 */
export type Appartement = {
	id: UUID;
	description: string;
	surface_habitable: number;
	hauteur_sous_plafond: number;
	position: Position;
	typologie: Typologie;
};

export const POSITIONS = [
	"rdc",
	"etage_intermediaire",
	"dernier_etage",
] as const;
export type Position = (typeof POSITIONS)[number];
export const PositionEnum = buildEnum(POSITIONS);

export const TYPOLOGIES = ["T1", "T2", "T3", "T4", "T5", "T6", "T7"] as const;
export type Typologie = (typeof TYPOLOGIES)[number];
export const TypologieEnum = buildEnum(TYPOLOGIES);
