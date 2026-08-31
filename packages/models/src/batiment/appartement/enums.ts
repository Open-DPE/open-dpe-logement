import * as z from "zod";

export const TypologieAppartement = z.enum({
	T1: "T1",
	T2: "T2",
	T3: "T3",
	T4: "T4",
	T5: "T5",
	T6: "T6",
	T7: "T7",
});
export type TypologieAppartement = z.infer<typeof TypologieAppartement>;

export const PositionAppartement = z.enum({
	rdc: "rdc",
	etage_intermediaire: "etage_intermediaire",
	dernier_etage: "dernier_etage",
});

export type PositionAppartement = z.infer<typeof PositionAppartement>;
