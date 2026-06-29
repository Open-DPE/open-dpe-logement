import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	type_batiment: string;
	fch: number;
};

export type Query = Omit<Schema, "fch">;

const TABLE_KEY = "chauffage/fch";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
