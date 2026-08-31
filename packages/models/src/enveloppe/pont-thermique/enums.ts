import * as z from "zod";

export const TypeLiaison = z.enum({
	plancher_bas_mur: "plancher_bas_mur",
	plancher_haut_mur: "plancher_haut_mur",
	refend_mur: "refend_mur",
	plancher_intermediaire_mur: "plancher_intermediaire_mur",
	porte_mur: "porte_mur",
	baie_mur: "baie_mur",
});

export type TypeLiaison = z.infer<typeof TypeLiaison>;
