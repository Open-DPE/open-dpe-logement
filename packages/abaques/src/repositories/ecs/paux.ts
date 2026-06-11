import data from "#data/ecs/paux.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	presence_ventouse: boolean | null;
	G: number;
	H: number;
	paux: string;
	pn_max: number | null;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	presence_ventouse: boolean | null;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
