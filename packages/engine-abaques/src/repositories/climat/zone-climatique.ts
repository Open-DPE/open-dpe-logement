import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	code_departement: string;
	departement: string;
	zone_climatique: string;
};

export type Query = {
	code_departement: string;
};

const TABLE_KEY = "climat/zone-climatique";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
