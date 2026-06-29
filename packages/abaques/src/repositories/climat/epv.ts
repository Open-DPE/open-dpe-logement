import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	mois: string;
	zone_climatique: string;
	epv: number;
};

export type Query = {
	zone_climatique: string;
};

const TABLE_KEY = "climat/epv";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
