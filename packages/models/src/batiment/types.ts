import * as z from "zod";
import {
	Adresse,
	description,
	annee,
	surface,
	hauteur,
} from "../common/types.js";
import { TypeBatiment, ZoneClimatique } from "./enums.js";
import { Appartement } from "./appartement/types.js";

export const Logement = z.object({
	description,
	surface_habitable: surface,
	hauteur_sous_plafond: hauteur,
});

export const BatimentBase = z.object({
	type: TypeBatiment,
	annee_construction: annee,
	annee_renovation: annee.nullable().default(null),
	altitude: z.number().int().min(-1000).max(10000),
	logements: z.number().int().min(1),
	surface_habitable: surface,
	hauteur_sous_plafond: hauteur,
	materiaux_anciens: z.boolean(),
	rnb_id: z.string().nullable().default(null),
	adresse: Adresse,
	appartements_visites: z.array(Appartement),
	logement: Logement.nullable(),
});

export const Maison = BatimentBase.extend({
	type: TypeBatiment.extract(["maison"]),
	logements: z.union([z.literal(1), z.literal(2)]),
	appartements_visites: z.array(z.never()),
});

export const Immeuble = BatimentBase.extend({
	type: TypeBatiment.extract(["immeuble"]),
	logements: z.number().int().min(3),
});

export const Batiment = z.union([Maison, Immeuble]);

export const BatimentData = z.object({
	sh: z.number(),
	hsp: z.number(),
	ratio_proratisation: z.number(),
	zone_climatique: ZoneClimatique,
});

export const BatimentWithData = z.intersection(
	Batiment,
	z.object({
		data: BatimentData,
	}),
);

export type Batiment = z.infer<typeof Batiment>;
export type BatimentBase = z.infer<typeof BatimentBase>;
export type BatimentData = z.infer<typeof BatimentData>;
export type BatimentWithData = z.infer<typeof BatimentWithData>;
export type Maison = z.infer<typeof Maison>;
export type Immeuble = z.infer<typeof Immeuble>;
export type Logement = z.infer<typeof Logement>;
