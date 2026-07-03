import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	zone_climatique: string;
	orientation: string;
	"inclinaison/gte": number | null;
	"inclinaison/lt": number | null;
	"inclinaison/lte": number | null;
	mois: string;
	c1: number;
};

export type Query = {
	zone_climatique: string;
	orientation: string;
	inclinaison: number;
};

const TABLE_KEY = "climat/c1";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
