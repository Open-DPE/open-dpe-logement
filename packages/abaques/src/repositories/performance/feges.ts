import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	energie: string;
	usage: string | null;
	feges: number;
};

export type Query = {
	energie: string;
	usage: string;
};

const TABLE_KEY = "performance/feges";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
