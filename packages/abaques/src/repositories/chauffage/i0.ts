import data from "#data/chauffage/i0.js";
import { filter } from "#filter.js";

export type Schema = {
	type_batiment: string;
	type_chauffage: string;
	type_emission: string;
	inertie: string | null;
	installation_collective: boolean | null;
	comptage_individuel: boolean | null;
	regulation_terminale: boolean | null;
	type_programmation: string;
	i0: number;
};

export type Query = Omit<Schema, "i0">;

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
