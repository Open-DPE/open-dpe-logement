import * as z from "zod";

export const TypeDiagnostic = z.enum({
	batiment: "batiment",
	logement: "logement",
});

export type TypeDiagnostic = z.infer<typeof TypeDiagnostic>;

export const Etiquette = z.enum({
	A: "A",
	B: "B",
	C: "C",
	D: "D",
	E: "E",
	F: "F",
	G: "G",
});

export type Etiquette = z.infer<typeof Etiquette>;

export const ConfortEte = z.enum({
	bon: "bon",
	moyen: "moyen",
	insuffisant: "insuffisant",
});

export type ConfortEte = z.infer<typeof ConfortEte>;
