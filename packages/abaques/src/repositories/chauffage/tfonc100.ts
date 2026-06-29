import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	temperature_distribution: string;
	"annee_installation_emetteur/gte": number | null;
	"annee_installation_emetteur/lte": number | null;
	tfonc100: number;
};

export type Query = {
	temperature_distribution: string;
	annee_installation_emetteur: number;
};

const TABLE_KEY = "chauffage/tfonc100";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
