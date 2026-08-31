import * as z from "zod";

export const ConfigurationPlancherHaut = z.enum({
	plancher: "plancher",
	rampants: "rampants",
	terrasse: "terrasse",
});

export type ConfigurationPlancherHaut = z.infer<
	typeof ConfigurationPlancherHaut
>;

export const TypePlancherHaut = z.enum({
	plafond_avec_ou_sans_remplissage: "plafond_avec_ou_sans_remplissage",
	plafond_entre_solives_metalliques: "plafond_entre_solives_metalliques",
	plafond_entre_solives_bois: "plafond_entre_solives_bois",
	plafond_bois_sur_solives_metalliques: "plafond_bois_sur_solives_metalliques",
	plafond_bois_sous_solives_metalliques:
		"plafond_bois_sous_solives_metalliques",
	bardeaux_et_remplissage: "bardeaux_et_remplissage",
	plafond_bois_sur_solives_bois: "plafond_bois_sur_solives_bois",
	plafond_bois_sous_solives_bois: "plafond_bois_sous_solives_bois",
	dalle_beton: "dalle_beton",
	plafond_lourd: "plafond_lourd",
	combles_amenages_sous_rampant: "combles_amenages_sous_rampant",
	toiture_chaume: "toiture_chaume",
	plafond_patre: "plafond_patre",
	bac_acier: "bac_acier",
});

export type TypePlancherHaut = z.infer<typeof TypePlancherHaut>;
