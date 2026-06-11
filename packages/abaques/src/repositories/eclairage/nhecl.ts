import data from "#data/eclairage/nhecl.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	nhecl: number;
};

export type Query = {
	zone_climatique: string;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
