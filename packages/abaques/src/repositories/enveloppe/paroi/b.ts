import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	mitoyennete: string;
	b: number;
};

export type Query = {
	mitoyennete: string;
};

const TABLE_KEY = "enveloppe/paroi/b";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
