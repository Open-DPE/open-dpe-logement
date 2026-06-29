import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	type_generateur: string;
	type_emetteur: string | null;
	"annee_installation/lte": number | null;
	"annee_installation/gte": number | null;
	scop: number;
};

export type Query = {
	zone_climatique: string;
	type_generateur: string;
	type_emetteur?: string | null;
	annee_installation: number;
};

const TABLE_KEY = "chauffage/scop";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
