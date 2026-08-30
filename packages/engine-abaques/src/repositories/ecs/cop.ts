import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	type_generateur: string;
	zone_climatique: string;
	"annee_installation/gte": number | null;
	"annee_installation/lte": number | null;
	cop: number;
};

export type Query = {
	type_generateur: string;
	zone_climatique: string;
	annee_installation: number;
};

const TABLE_KEY = "ecs/cop";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
