import * as z from "zod";

export const CONFIGURATIONS = {
	plancher: "plancher",
	rampants: "rampants",
	terrasse: "terrasse",
} as const;
export const ConfigurationEnum = z.enum(CONFIGURATIONS);
export type ConfigurationEnum = z.infer<typeof ConfigurationEnum>;

export const TYPES_PLANCHER_HAUT = {
	plafond_avec_ou_sans_remplissage: "plafond_avec_ou_sans_remplissage",
	plafond_entre_solives_metalliques: "plafond_entre_solives_metalliques",
	plafond_entre_solives_bois: "plafond_entre_solives_bois",
	plafond_bois_sur_solives_metalliques:
		"plafond_bois_sur_solives_metalliques",
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
} as const;
export const TypePlancherHautEnum = z.enum(TYPES_PLANCHER_HAUT);
export type TypePlancherHautEnum = z.infer<typeof TypePlancherHautEnum>;
