import * as z from "zod";

export const MateriauMur = z.enum({
	pierre_moellons: "pierre_moellons",
	pierre_moellons_avec_remplissage: "pierre_moellons_avec_remplissage",
	pise_ou_beton_terre: "pise_ou_beton_terre",
	pan_bois_sans_remplissage: "pan_bois_sans_remplissage",
	pan_bois_avec_remplissage: "pan_bois_avec_remplissage",
	bois_rondin: "bois_rondin",
	brique_pleine_simple: "brique_pleine_simple",
	brique_pleine_double_avec_lame_air: "brique_pleine_double_avec_lame_air",
	brique_creuse: "brique_creuse",
	bloc_beton_plein: "bloc_beton_plein",
	bloc_beton_creux: "bloc_beton_creux",
	beton_banche: "beton_banche",
	beton_machefer: "beton_machefer",
	brique_terre_cuite_alveolaire: "brique_terre_cuite_alveolaire",
	sandwich_beton_isolant_beton_sans_isolation_rapportee:
		"sandwich_beton_isolant_beton_sans_isolation_rapportee",
	cloison_platre: "cloison_platre",
	ossature_bois_sans_remplissage: "ossature_bois_sans_remplissage",
	ossature_bois_avec_remplissage_tout_venant:
		"ossature_bois_avec_remplissage_tout_venant",
	ossature_bois_avec_remplissage_isolant:
		"ossature_bois_avec_remplissage_isolant",
	beton_cellulaire: "beton_cellulaire",
});

export type MateriauMur = z.infer<typeof MateriauMur>;

export const TypeDoublage = z.enum({
	sans_doublage: "sans_doublage",
	indetermine: "indetermine",
	lame_air_inferieur_15mm: "lame_air_inferieur_15mm",
	lame_air_superieur_15mm: "lame_air_superieur_15mm",
	materiaux_connu: "materiaux_connu",
});

export type TypeDoublage = z.infer<typeof TypeDoublage>;
