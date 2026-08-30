import * as z from "zod";

export const TYPES_LIAISON = {
	plancher_bas_mur: "plancher_bas_mur",
	plancher_haut_mur: "plancher_haut_mur",
	refend_mur: "refend_mur",
	plancher_intermediaire_mur: "plancher_intermediaire_mur",
	porte_mur: "porte_mur",
	baie_mur: "baie_mur",
} as const;
export const TypeLiaisonEnum = z.enum(TYPES_LIAISON);
export type TypeLiaisonEnum = z.infer<typeof TypeLiaisonEnum>;
