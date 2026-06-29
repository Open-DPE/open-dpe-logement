import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	orientation_pv: string;
	"inclinaison_pv/gt": number | null;
	"inclinaison_pv/lte": number | null;
	kpv: number;
};

export type Query = {
	orientation_pv: string;
	inclinaison_pv: number;
};

const TABLE_KEY = "production/kpv";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);
export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
