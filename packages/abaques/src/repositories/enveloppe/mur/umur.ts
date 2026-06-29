import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	"annee_construction_isolation/gte": number | null;
	"annee_construction_isolation/lte": number | null;
	effet_joule: boolean;
	u: number;
};

export type Query = {
	zone_climatique: string;
	annee_construction_isolation: number;
	effet_joule: boolean;
};

const TABLE_KEY = "enveloppe/mur/umur";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
