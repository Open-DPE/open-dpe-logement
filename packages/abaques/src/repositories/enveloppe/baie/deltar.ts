import data from "#data/enveloppe/baie/deltar.js";
import { filter } from "#filter.js";

export type Schema = {
	type_fermeture: string;
	deltar: number;
};

export type Query = {
	type_fermeture: string;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
