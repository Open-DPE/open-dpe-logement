import { getTable, registerTable } from "../../../cache.js";
import { filter } from "../../../filter.js";

export type Schema = {
	uvue: number;
	isolation_aiu: boolean;
	isolation_aue: boolean;
	"aiu_aue/gt": number | null;
	"aiu_aue/lte": number | null;
	b: number;
};

export type Query = {
	uvue: number;
	isolation_aiu: boolean;
	isolation_aue: boolean;
	aiu_aue: number;
};

const TABLE_KEY = "enveloppe/local-non-chauffe/b";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
