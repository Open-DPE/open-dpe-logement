import { getTable, registerTable } from "#runtime/cache.js";
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

const TABLE_KEY = "chauffage/re";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
