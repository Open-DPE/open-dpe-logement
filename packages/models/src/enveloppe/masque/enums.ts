import * as z from "zod";

export const TypeMasque = z.enum({
	homogene: "homogene",
	non_homogene: "non_homogene",
	fond_balcon: "fond_balcon",
	fond_et_flanc_loggias: "fond_et_flanc_loggias",
	balcon_ou_auvent: "balcon_ou_auvent",
	paroi_laterale_sans_obstacle_au_sud: "paroi_laterale_sans_obstacle_au_sud",
	paroi_laterale_avec_obstacle_au_sud: "paroi_laterale_avec_obstacle_au_sud",
});

export type TypeMasque = z.infer<typeof TypeMasque>;

export const SecteurMasque = z.enum({
	lateral: "lateral",
	lateral_sud: "lateral_sud",
	central: "central",
	central_sud: "central_sud",
});

export type SecteurMasque = z.infer<typeof SecteurMasque>;
