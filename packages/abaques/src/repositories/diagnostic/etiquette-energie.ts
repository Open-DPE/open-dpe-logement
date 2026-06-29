import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/lte": number | null;
	"cep/gte": number | null;
	"cep/lt": number | null;
	"eges/gte": number | null;
	"eges/lt": number | null;
	etiquette_energie: string;
};

export type Query = {
	zone_climatique: string;
	altitude: number;
	cep: number;
	eges: number;
};

const TABLE_KEY = "diagnostic/etiquette-energie";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
