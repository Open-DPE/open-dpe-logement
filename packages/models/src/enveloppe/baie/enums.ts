import * as z from "zod";

export const TypeBaie = z.enum({
	brique_verre_pleine: "brique_verre_pleine",
	brique_verre_creuse: "brique_verre_creuse",
	polycarbonate: "polycarbonate",
	fenetre_battante: "fenetre_battante",
	fenetre_coulissante: "fenetre_coulissante",
	porte_fenetre_coulissante: "porte_fenetre_coulissante",
	porte_fenetre_battante: "porte_fenetre_battante",
});

export type TypeBaie = z.infer<typeof TypeBaie>;

export const TypeFermeture = z.enum({
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
});

export type TypeFermeture = z.infer<typeof TypeFermeture>;

export const TypeVitrage = z.enum({
	brique_verre: "brique_verre",
	polycarbonate: "polycarbonate",
	simple_vitrage: "simple_vitrage",
	double_vitrage: "double_vitrage",
	double_vitrage_fe: "double_vitrage_fe",
	triple_vitrage: "triple_vitrage",
	triple_vitrage_fe: "triple_vitrage_fe",
});

export type TypeVitrage = z.infer<typeof TypeVitrage>;

export const NatureLameAir = z.enum({
	air: "air",
	argon: "argon",
	krypton: "krypton",
});

export type NatureLameAir = z.infer<typeof NatureLameAir>;

export const TypeSurvitrage = z.enum({
	survitrage_simple: "survitrage_simple",
	survitrage_fe: "survitrage_fe",
});

export type TypeSurvitrage = z.infer<typeof TypeSurvitrage>;

export const MateriauBaie = z.enum({
	pvc: "pvc",
	bois: "bois",
	bois_metal: "bois_metal",
	metal: "metal",
});

export type MateriauBaie = z.infer<typeof MateriauBaie>;
