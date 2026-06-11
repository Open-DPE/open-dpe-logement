import data from "#data/enveloppe/paroi/b.js";
import { filter } from "#filter.js";

export type Schema = {
	mitoyennete: string;
	b: number;
};

export type Query = {
	mitoyennete: string;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
