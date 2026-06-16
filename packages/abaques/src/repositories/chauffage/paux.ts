import data from "#data/chauffage/paux.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	presence_ventouse: boolean | null;
	G: number;
	H: number;
	pn_max: number | null;
	paux: string | number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	presence_ventouse: boolean | null;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
