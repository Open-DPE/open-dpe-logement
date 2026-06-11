import data from "#data/performance/feges.js";
import { filter } from "#filter.js";

export type Schema = {
	energie: string;
	usage: string | null;
	feges: number;
};

export type Query = {
	energie: string;
	usage: string;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
