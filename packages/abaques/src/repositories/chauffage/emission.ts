import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	type_generateur: string;
	type_emetteur: string | null;
	type_emission: string;
};

export type Query = Omit<Schema, "type_emission">;

const TABLE_KEY = "chauffage/emission";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
