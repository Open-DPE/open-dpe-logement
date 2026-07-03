import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/gte": number | null;
	"altitude/lt": number | null;
	"altitude/lte": number | null;
	tbase: number;
};

export type Query = {
	zone_climatique: string;
	altitude: number;
};

const TABLE_KEY = "climat/tbase";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
