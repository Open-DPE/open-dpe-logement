import data from "#data/climat/zone-climatique.js";
import { filter } from "#filter.js";

export type Schema = {
	code_departement: string;
	departement: string;
	zone_climatique: string;
};

export type Query = {
	code_departement: string;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
