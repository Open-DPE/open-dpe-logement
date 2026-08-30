import * as z from "zod";

export const POSITIONS = {
	rdc: "rdc",
	etage_intermediaire: "etage_intermediaire",
	dernier_etage: "dernier_etage",
} as const;
export const PositionEnum = z.enum(POSITIONS);
export type PositionEnum = z.infer<typeof PositionEnum>;

export const TYPOLOGIES = {
	T1: "T1",
	T2: "T2",
	T3: "T3",
	T4: "T4",
	T5: "T5",
	T6: "T6",
	T7: "T7",
} as const;
export const TypologieEnum = z.enum(TYPOLOGIES);
export type TypologieEnum = z.infer<typeof TypologieEnum>;
