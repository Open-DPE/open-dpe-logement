import data from "#data/performance/fcep.js";
import { filter } from "#filter.js";

export type Schema = {
	energie: string;
	fcep: number;
};

export type Query = {
	energie: string;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
