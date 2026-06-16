import data from "#data/enveloppe/local-non-chauffe/uvue.js";
import { filter } from "#filter.js";

export type Schema = {
	type_local_non_chauffe: string;
	uvue: number;
};

export type Query = {
	type_local_non_chauffe: string;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
