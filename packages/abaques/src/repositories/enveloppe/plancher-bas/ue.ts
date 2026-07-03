import { getTable, registerTable } from "../../../cache.js";
import { filter } from "../../../filter.js";

export type Schema = {
	mitoyennete: string;
	"annee_construction/gte": number | null;
	"annee_construction/lte": number | null;
	"2s/p": number;
	u: number;
	ue: number;
};

export type Query = {
	mitoyennete: string;
	annee_construction: number;
};

const TABLE_KEY = "enveloppe/plancher-bas/ue";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
