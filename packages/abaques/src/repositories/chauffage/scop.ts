import data from "#data/chauffage/scop.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	type_generateur: string;
	type_emetteur: string | null;
	"annee_installation/lte": number | null;
	"annee_installation/gte": number | null;
	scop: number;
};

export type Query = {
	zone_climatique: string;
	type_generateur: string;
	type_emetteur?: string | null;
	annee_installation: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
