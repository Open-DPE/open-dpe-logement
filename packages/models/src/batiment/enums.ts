import * as z from "zod";

export const TYPES_BATIMENT = {
	maison: "maison",
	immeuble: "immeuble",
} as const;
export const TypeBatimentEnum = z.enum(TYPES_BATIMENT);
export type TypeBatimentEnum = z.infer<typeof TypeBatimentEnum>;

export const ZONES_CLIMATIQUES = {
	H1a: "H1a",
	H1b: "H1b",
	H1c: "H1c",
	H2a: "H2a",
	H2b: "H2b",
	H2c: "H2c",
	H2d: "H2d",
	H3: "H3",
} as const;
export const ZoneClimatiqueEnum = z.enum(ZONES_CLIMATIQUES);
export type ZoneClimatiqueEnum = z.infer<typeof ZoneClimatiqueEnum>;
