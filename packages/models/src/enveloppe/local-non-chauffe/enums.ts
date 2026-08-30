import * as z from "zod";

export const TYPES_LNC = {
	garage: "garage",
	cellier: "cellier",
	espace_tampon_solarise: "espace_tampon_solarise",
	comble_fortement_ventile: "comble_fortement_ventile",
	comble_faiblement_ventile: "comble_faiblement_ventile",
	comble_tres_faiblement_ventile: "comble_tres_faiblement_ventile",
	circulation_sans_ouverture_exterieure:
		"circulation_sans_ouverture_exterieure",
	circulation_avec_ouverture_exterieure:
		"circulation_avec_ouverture_exterieure",
	circulation_avec_bouche_ou_gaine_desenfumage_ouverte:
		"circulation_avec_bouche_ou_gaine_desenfumage_ouverte",
	hall_entree_avec_fermeture_automatique:
		"hall_entree_avec_fermeture_automatique",
	hall_entree_sans_fermeture_automatique:
		"hall_entree_sans_fermeture_automatique",
	garage_collectif: "garage_collectif",
	autres: "autres",
} as const;
export const TypeLncEnum = z.enum(TYPES_LNC);
export type TypeLncEnum = z.infer<typeof TypeLncEnum>;
