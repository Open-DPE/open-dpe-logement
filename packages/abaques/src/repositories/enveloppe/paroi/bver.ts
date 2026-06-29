import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	orientation_ets: string;
	isolation_paroi: boolean;
	bver: number;
};

export type Query = {
	zone_climatique: string;
	orientation_ets: string;
	isolation_paroi: boolean;
};

const TABLE_KEY = "enveloppe/paroi/bver";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
