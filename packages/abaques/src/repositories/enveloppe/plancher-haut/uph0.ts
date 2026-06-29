import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_plancher_haut: string;
	u0: number;
};

export type Query = {
	type_plancher_haut: string;
};

const TABLE_KEY = "enveloppe/plancher-haut/uph0";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
