import * as z from "zod";

export const TYPES_BAIE = {
	brique_verre_pleine: "brique_verre_pleine",
	brique_verre_creuse: "brique_verre_creuse",
	polycarbonate: "polycarbonate",
	fenetre_battante: "fenetre_battante",
	fenetre_coulissante: "fenetre_coulissante",
	porte_fenetre_coulissante: "porte_fenetre_coulissante",
	porte_fenetre_battante: "porte_fenetre_battante",
} as const;
export const TypeBaieEnum = z.enum(TYPES_BAIE);
export type TypeBaieEnum = z.infer<typeof TypeBaieEnum>;

export const TYPES_FERMETURE = {
	sans_fermeture: "sans_fermeture",
	jalousie_accordeon: "jalousie_accordeon",
	fermeture_lames_orientables: "fermeture_lames_orientables",
	venitiens_exterieurs_metal: "venitiens_exterieurs_metal",
	volet_battant_avec_ajours_fixes: "volet_battant_avec_ajours_fixes",
	persiennes_avec_ajours_fixes: "persiennes_avec_ajours_fixes",
	fermeture_sans_ajours: "fermeture_sans_ajours",
	volets_roulants_aluminium: "volets_roulants_aluminium",
	volets_roulants_pvc_bois_epaisseur_lte_12mm:
		"volets_roulants_pvc_bois_epaisseur_lte_12mm",
	volets_roulants_pvc_bois_epaisseur_gt_12mm:
		"volets_roulants_pvc_bois_epaisseur_gt_12mm",
	persienne_coulissante_epaisseur_lte_22mm:
		"persienne_coulissante_epaisseur_lte_22mm",
	persienne_coulissante_epaisseur_gt_22mm:
		"persienne_coulissante_epaisseur_gt_22mm",
	volet_battant_pvc_bois_epaisseur_lte_22mm:
		"volet_battant_pvc_bois_epaisseur_lte_22mm",
	volet_battant_pvc_bois_epaisseur_gt_22mm:
		"volet_battant_pvc_bois_epaisseur_gt_22mm",
	fermeture_isolee_sans_ajours: "fermeture_isolee_sans_ajours",
} as const;
export const TypeFermetureEnum = z.enum(TYPES_FERMETURE);
export type TypeFermetureEnum = z.infer<typeof TypeFermetureEnum>;

export const TYPES_VITRAGE = {
	brique_verre: "brique_verre",
	polycarbonate: "polycarbonate",
	simple_vitrage: "simple_vitrage",
	double_vitrage: "double_vitrage",
	double_vitrage_fe: "double_vitrage_fe",
	triple_vitrage: "triple_vitrage",
	triple_vitrage_fe: "triple_vitrage_fe",
} as const;
export const TypeVitrageEnum = z.enum(TYPES_VITRAGE);
export type TypeVitrageEnum = z.infer<typeof TypeVitrageEnum>;

export const NATURES_LAME = {
	air: "air",
	argon: "argon",
	krypton: "krypton",
} as const;
export const NatureLameEnum = z.enum(NATURES_LAME);
export type NatureLameEnum = z.infer<typeof NatureLameEnum>;

export const TYPES_SURVITRAGE = {
	survitrage_simple: "survitrage_simple",
	survitrage_fe: "survitrage_fe",
} as const;
export const TypeSurvitrageEnum = z.enum(TYPES_SURVITRAGE);
export type TypeSurvitrageEnum = z.infer<typeof TypeSurvitrageEnum>;

export const MATERIAUX = {
	pvc: "pvc",
	bois: "bois",
	bois_metal: "bois_metal",
	metal: "metal",
} as const;
export const MateriauEnum = z.enum(MATERIAUX);
export type MateriauEnum = z.infer<typeof MateriauEnum>;
