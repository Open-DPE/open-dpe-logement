import data from "#data/ecs/cop.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	zone_climatique: string;
	"annee_installation/gte": number | null;
	"annee_installation/lte": number | null;
	cop: number;
};

export type Query = {
	type_generateur: string;
	zone_climatique: string;
	annee_installation: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
