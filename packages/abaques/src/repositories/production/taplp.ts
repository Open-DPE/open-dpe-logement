import data from "#data/production/taplp.js";
import { filter } from "#filter.js";

export type Schema = {
	usage_electricite: string;
	taplp: number;
};

export type Query = {
	usage_electricite: string;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
