import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_batiment: string;
	zone_climatique: string;
	usage_solaire: string;
	"anciennete_installation/gt": number | null;
	"anciennete_installation/lte": number | null;
	fecs: number;
};

export type Query = {
	type_batiment: string;
	zone_climatique: string;
	usage_solaire: string;
	anciennete_installation: number;
};

const TABLE_KEY = "ecs/fecs";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
