import { getTable, registerTable } from "../../../cache.js";
import { filter } from "../../../filter.js";

export type Schema = {
	type_masque: string;
	orientation_facade: string;
	"avancee_masque/gte": number | null;
	"avancee_masque/lte": number | null;
	fe1: number;
};

export type Query = {
	type_masque: string;
	orientation_facade: string;
	avancee_masque: number | null;
};

const TABLE_KEY = "enveloppe/masque/fe1";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
