import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	usage_electricite: string;
	taplp: number;
};

export type Query = {
	usage_electricite: string;
};

const TABLE_KEY = "production/taplp";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
