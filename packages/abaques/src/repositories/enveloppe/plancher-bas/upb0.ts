import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_structure: string;
	u0: number;
};

export type Query = {
	type_structure: string;
};

const TABLE_KEY = "enveloppe/plancher-bas/upb0";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
