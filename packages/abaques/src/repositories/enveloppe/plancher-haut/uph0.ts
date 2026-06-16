import data from "#data/enveloppe/plancher-haut/uph0.js";
import { filter } from "#filter.js";

export type Schema = {
	type_plancher_haut: string;
	u0: number;
};

export type Query = {
	type_plancher_haut: string;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
