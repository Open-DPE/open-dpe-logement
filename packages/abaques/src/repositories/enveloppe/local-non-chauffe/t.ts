import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_vitrage: string;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
	t: number;
};

export type Query = {
	type_vitrage: string;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
};

const TABLE_KEY = "enveloppe/local-non-chauffe/t";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);
export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
