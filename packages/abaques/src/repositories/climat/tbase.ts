import data from "#data/climat/tbase.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/gte": number | null;
	"altitude/lt": number | null;
	"altitude/lte": number | null;
	tbase: number;
};

export type Query = {
	zone_climatique: string;
	altitude: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
