import data from "#data/chauffage/fch.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	type_batiment: string;
	fch: number;
};

export type Query = Omit<Schema, "fch">;

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
