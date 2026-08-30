import * as z from "zod";

export const TYPES_MASQUE = {
	homogene: "homogene",
	non_homogene: "non_homogene",
	fond_balcon: "fond_balcon",
	fond_et_flanc_loggias: "fond_et_flanc_loggias",
	balcon_ou_auvent: "balcon_ou_auvent",
	paroi_laterale_sans_obstacle_au_sud: "paroi_laterale_sans_obstacle_au_sud",
	paroi_laterale_avec_obstacle_au_sud: "paroi_laterale_avec_obstacle_au_sud",
} as const;
export const TypeMasqueEnum = z.enum(TYPES_MASQUE);
export type TypeMasqueEnum = z.infer<typeof TypeMasqueEnum>;

export const SECTEURS = {
	lateral: "lateral",
	lateral_sud: "lateral_sud",
	central: "central",
	central_sud: "central_sud",
} as const;
export const SecteurEnum = z.enum(SECTEURS);
export type SecteurEnum = z.infer<typeof SecteurEnum>;
