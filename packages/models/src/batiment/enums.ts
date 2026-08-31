import * as z from "zod";

export const TypeBatiment = z.enum({
	maison: "maison",
	immeuble: "immeuble",
});

export type TypeBatiment = z.infer<typeof TypeBatiment>;

export const ZoneClimatique = z.enum({
	H1a: "H1a",
	H1b: "H1b",
	H1c: "H1c",
	H2a: "H2a",
	H2b: "H2b",
	H2c: "H2c",
	H2d: "H2d",
	H3: "H3",
});

export type ZoneClimatique = z.infer<typeof ZoneClimatique>;
