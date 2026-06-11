import data from "#data/chauffage/re.js";
import { filter } from "#filter.js";

export type Schema = {
	type_emission: string;
	type_generateur: string | null;
	label_generateur: string | null;
	re: number;
};

export type Query = {
	type_emission: string;
	type_generateur: string;
	label_generateur: string | null;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
