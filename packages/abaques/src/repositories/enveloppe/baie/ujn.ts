import data from "#data/enveloppe/baie/ujn.js";
import { filter } from "#filter.js";

export type Schema = {
	deltar: number;
	uw: number;
	ujn: number;
};

export type Query = {
	deltar: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
