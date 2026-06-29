import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_baie: string;
	presence_soubassement: boolean | null;
	materiau: string | null;
	type_vitrage: string | null;
	type_pose: string | null;
	type_survitrage: string | null;
	sw: number;
};

export type Query = {
	type_baie: string;
	presence_soubassement: boolean | null;
	materiau: string | null;
	type_vitrage: string | null;
	type_pose: string | null;
	type_survitrage: string | null;
};

const TABLE_KEY = "enveloppe/baie/sw";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
