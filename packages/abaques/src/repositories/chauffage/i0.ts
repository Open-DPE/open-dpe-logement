import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

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

const TABLE_KEY = "chauffage/i0";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
