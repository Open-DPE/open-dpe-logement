import data from "#data/enveloppe/plancher-bas/upb0.js";
import { filter } from "#filter.js";

export type Schema = {
	type_structure: string;
	u0: number;
};

export type Query = {
	type_structure: string;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
