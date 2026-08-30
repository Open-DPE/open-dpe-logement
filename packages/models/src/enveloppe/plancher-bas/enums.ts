import * as z from "zod";

export const TYPES_PLANCHER_BAS = {
	plancher_avec_ou_sans_remplissage: "plancher_avec_ou_sans_remplissage",
	plancher_entre_solives_metalliques: "plancher_entre_solives_metalliques",
	plancher_entre_solives_bois: "plancher_entre_solives_bois",
	plancher_bois_sur_solives_metalliques:
		"plancher_bois_sur_solives_metalliques",
	bardeaux_et_remplissage: "bardeaux_et_remplissage",
	voutains_sur_solives_metalliques: "voutains_sur_solives_metalliques",
	voutains_briques_ou_moellons: "voutains_briques_ou_moellons",
	dalle_beton: "dalle_beton",
	plancher_bois_sur_solives_bois: "plancher_bois_sur_solives_bois",
	plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton:
		"plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton",
	plancher_entrevous_isolant: "plancher_entrevous_isolant",
} as const;
export const TypePlancherBasEnum = z.enum(TYPES_PLANCHER_BAS);
export type TypePlancherBasEnum = z.infer<typeof TypePlancherBasEnum>;
