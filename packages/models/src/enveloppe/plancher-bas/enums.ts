import * as z from "zod";

export const TypePlancherBas = z.enum({
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
});

export type TypePlancherBas = z.infer<typeof TypePlancherBas>;
