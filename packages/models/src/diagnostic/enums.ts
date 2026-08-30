import * as z from "zod";

export const TYPES_DIAGNOSTIC = {
	batiment: "batiment",
	logement: "logement",
} as const;

export const ETIQUETTES = {
	A: "A",
	B: "B",
	C: "C",
	D: "D",
	E: "E",
	F: "F",
	G: "G",
} as const;

export const CONFORTS_ETE = {
	bon: "1",
	moyen: "2",
	insuffisant: "3",
} as const;

export const TypeDiagnosticEnum = z.enum(TYPES_DIAGNOSTIC);
export const EtiquetteEnum = z.enum(ETIQUETTES);
export const ConfortEteEnum = z.enum(CONFORTS_ETE);

export type TypeDiagnosticEnum = z.infer<typeof TypeDiagnosticEnum>;
export type EtiquetteEnum = z.infer<typeof EtiquetteEnum>;
export type ConfortEteEnum = z.infer<typeof ConfortEteEnum>;
