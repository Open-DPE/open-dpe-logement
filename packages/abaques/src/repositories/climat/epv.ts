import data from "#data/climat/epv.js";
import { filter } from "#filter.js";

export type Schema = {
	mois: string;
	zone_climatique: string;
	epv: number;
};

export type Query = {
	zone_climatique: string;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
