import data from "#data/chauffage/emission.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	type_emetteur: string | null;
	type_emission: string;
};

export type Query = Omit<Schema, "type_emission">;

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
