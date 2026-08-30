import * as z from "zod";

export const BOUCLAGES = {
	non_boucle: "non_boucle",
	boucle: "boucle",
	trace: "trace",
} as const;

export const BouclageEnum = z.enum(BOUCLAGES);

export type BouclageEnum = z.infer<typeof BouclageEnum>;
