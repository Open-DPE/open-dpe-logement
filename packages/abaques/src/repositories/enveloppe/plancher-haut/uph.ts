import { getTable, registerTable } from "../../../cache.js";
import { filter } from "../../../filter.js";

export type Schema = {
	configuration: string;
	zone_climatique: string;
	effet_joule: boolean;
	"annee_construction_isolation/lte": number | null;
	"annee_construction_isolation/gte": number | null;
	u: number;
};

export type Query = {
	configuration: string;
	zone_climatique: string;
	effet_joule: boolean;
	annee_construction_isolation: number;
};

const TABLE_KEY = "enveloppe/plancher-haut/uph";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
