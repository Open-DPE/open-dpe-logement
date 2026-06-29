import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	presence_sas: boolean | null;
	materiau: string | null;
	isolation: boolean | null;
	type_vitrage: string | null;
	"taux_vitrage/gt": number | null;
	"taux_vitrage/lt": number | null;
	"taux_vitrage/gte": number | null;
	"taux_vitrage/eq": number | null;
	u: number;
};

export type Query = {
	presence_sas: boolean | null;
	materiau: string | null;
	isolation: boolean | null;
	type_vitrage: string | null;
	taux_vitrage: number | null;
};

const TABLE_KEY = "enveloppe/porte/uporte";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
