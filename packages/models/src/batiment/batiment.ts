import type { Adresse } from "../common/common.js";
import { buildEnum } from "../utils.js";
import * as appartement from "./appartement.js";

export { appartement };

/**
 * @see https://schemas.open-dpe.fr/batiment
 */
export type Batiment = Maison | Immeuble;

type BaseBatiment = {
	type: TypeBatiment;
	annee_construction: number;
	annee_renovation: number | null;
	altitude: number;
	logements: number;
	surface_habitable: number;
	hauteur_sous_plafond: number;
	materiaux_anciens: boolean;
	rnb_id: string | null;
	adresse: Adresse;
	appartements_visites: appartement.Appartement[];
	logement: Logement | null;
};

export type Maison = BaseBatiment & {
	type: typeof TypeBatimentEnum.maison;
	logements: 1 | 2;
	appartements_visites: [];
};

export type Immeuble = BaseBatiment & {
	type: typeof TypeBatimentEnum.immeuble;
	logements: number;
};

export type BatimentWithData<T extends Batiment = Batiment> = T & {
	data: BatimentData;
};

export type BatimentData = {
	sh: number;
	hsp: number;
	ratio_proratisation: number;
	zone_climatique: ZoneClimatique;
};

export type Logement = {
	description: string;
	surface_habitable: number;
	hauteur_sous_plafond: number;
};

export const TYPES_BATIMENT = ["maison", "immeuble"] as const;
export type TypeBatiment = (typeof TYPES_BATIMENT)[number];
export const TypeBatimentEnum = buildEnum(TYPES_BATIMENT);

export const ZONES_CLIMATIQUES = [
	"H1a",
	"H1b",
	"H1c",
	"H2a",
	"H2b",
	"H2c",
	"H2d",
	"H3",
] as const;
export type ZoneClimatique = (typeof ZONES_CLIMATIQUES)[number];
export const ZoneClimatiqueEnum = buildEnum(ZONES_CLIMATIQUES);
