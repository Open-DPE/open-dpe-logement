import type { PositiveNumber, UUID } from "../common/common";
import { buildEnum } from "../utils";

/**
 * @see https://schemas.open-dpe.fr/batiment/appartement
 */
export type Appartement = {
	id: UUID;
	description: string;
	surface_habitable: PositiveNumber;
	hauteur_sous_plafond: PositiveNumber;
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
