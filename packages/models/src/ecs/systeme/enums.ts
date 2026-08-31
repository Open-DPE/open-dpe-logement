import * as z from "zod";

export const BouclageReseau = z.enum({
	non_boucle: "non_boucle",
	boucle: "boucle",
	trace: "trace",
});

export type BouclageReseau = z.infer<typeof BouclageReseau>;
