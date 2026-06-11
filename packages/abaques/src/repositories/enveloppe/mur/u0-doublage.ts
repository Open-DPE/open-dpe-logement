import data from "#data/enveloppe/mur/u0-doublage.js";
import { filter } from "#filter.js";

export type Schema = {
	type_doublage: string;
	u0_doublage: number;
};

export type Query = {
	type_doublage: string;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
