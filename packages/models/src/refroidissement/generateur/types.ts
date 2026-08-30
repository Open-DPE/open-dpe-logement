import * as z from "zod";
import { ENERGIES } from "../../common/enums.js";
import {
	id,
	description,
	annee_installation,
	nombre_positif,
	non_applicable,
	Consommations,
} from "../../common/types.js";
import {
	TYPES_GENERATEUR,
	EnergieRefroidissementEnum,
	TypeGenerateurEnum,
	TypeGenerateurPacEnum,
} from "./enums.js";

export const GenerateurBase = z.object({
	id,
	description,
	type: TypeGenerateurEnum,
	energie: EnergieRefroidissementEnum,
	annee_installation,
	seer: nombre_positif.nullable().default(null),
	reseau_froid_id: z.string().nullable().default(null),
});

export const GenerateurPAC = GenerateurBase.extend({
	type: TypeGenerateurPacEnum,
	energie: EnergieRefroidissementEnum.extract([ENERGIES.electricite]),
	reseau_froid_id: non_applicable,
});

export const GenerateurClimatiseur = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.autre]),
	energie: EnergieRefroidissementEnum.exclude([ENERGIES.reseau_froid]),
	reseau_froid_id: non_applicable,
});

export const GenerateurReseauFroid = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.reseau_froid]),
	energie: EnergieRefroidissementEnum.extract([ENERGIES.reseau_froid]),
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
