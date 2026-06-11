import data from "#data/performance/etiquette-climat.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/lte": number | null;
	"eges/gte": number | null;
	"eges/lt": number | null;
	etiquette_climat: string;
};

export type Query = {
	zone_climatique: string;
	altitude: number;
	eges: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
