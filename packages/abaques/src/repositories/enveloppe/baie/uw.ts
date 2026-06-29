import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_baie: string;
	presence_soubassement: boolean | null;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
	ug: number | null;
	uw: number;
};

export type Query = {
	type_baie: string;
	presence_soubassement: boolean | null;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
};

const TABLE_KEY = "enveloppe/baie/uw";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
