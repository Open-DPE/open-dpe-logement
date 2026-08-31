import * as z from "zod";
import { Energie } from "../../common/enums.js";
import {
	id,
	description,
	annee_installation,
	nombre_positif,
	non_applicable,
	Consommations,
} from "../../common/types.js";
import {
	TypeGenerateur,
	EnergieRefroidissement,
	TypeGenerateurPac,
} from "./enums.js";

export const GenerateurBase = z.object({
	id,
	description,
	type: TypeGenerateur,
	energie: EnergieRefroidissement,
	annee_installation,
	seer: nombre_positif.nullable().default(null),
	reseau_froid_id: z.string().nullable().default(null),
});

export const GenerateurPAC = GenerateurBase.extend({
	type: TypeGenerateurPac,
	energie: EnergieRefroidissement.extract(["electricite"]),
	reseau_froid_id: non_applicable,
});

export const GenerateurClimatiseur = GenerateurBase.extend({
	type: TypeGenerateur.extract(["autre"]),
	energie: EnergieRefroidissement.exclude(["reseau_froid"]),
	reseau_froid_id: non_applicable,
});

export const GenerateurReseauFroid = GenerateurBase.extend({
	type: TypeGenerateur.extract(["reseau_froid"]),
	energie: EnergieRefroidissement.extract(["reseau_froid"]),
});

export const Generateur = z.union([
	GenerateurPAC,
	GenerateurClimatiseur,
	GenerateurReseauFroid,
]);

export const GenerateurData = z.object({
	rdim: z.number().min(0),
	eer: z.number().min(0),
	consommations: Consommations,
});

export const GenerateurWithData = z.intersection(
	Generateur,
	z.object({
		data: GenerateurData,
	}),
);

export type Generateur = z.infer<typeof Generateur>;
export type GenerateurBase = z.infer<typeof GenerateurBase>;
export type GenerateurPAC = z.infer<typeof GenerateurPAC>;
export type GenerateurClimatiseur = z.infer<typeof GenerateurClimatiseur>;
export type GenerateurReseauFroid = z.infer<typeof GenerateurReseauFroid>;
export type GenerateurData = z.infer<typeof GenerateurData>;
export type GenerateurWithData = z.infer<typeof GenerateurWithData>;
