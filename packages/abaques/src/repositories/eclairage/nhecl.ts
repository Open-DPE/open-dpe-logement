import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	zone_climatique: string;
	nhecl: number;
};

export type Query = {
	zone_climatique: string;
};

const TABLE_KEY = "eclairage/nhecl";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
