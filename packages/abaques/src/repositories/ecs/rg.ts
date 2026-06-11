import data from "#data/ecs/rg.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	rg: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string | null;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
