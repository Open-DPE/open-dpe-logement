import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	mode_combustion: string;
	temperature_distribution: string;
	"annee_installation_emetteur/lte": number | null;
	"annee_installation_emetteur/gte": number | null;
	"annee_installation_generateur/lte": number | null;
	"annee_installation_generateur/gte": number | null;
	tfonc30: number;
};

export type Query = {
	mode_combustion: string;
	temperature_distribution: string;
	annee_installation_emetteur: number;
	annee_installation_generateur: number;
};

const TABLE_KEY = "chauffage/tfonc30";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
