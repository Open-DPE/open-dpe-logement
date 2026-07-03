import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	position_chaudiere: string;
	"pdim/gt": number | null;
	"pdim/lte": number | null;
	"annee_installation_generateur/gt": number | null;
	"annee_installation_generateur/lte": number | null;
	pn: number | string;
};

export type Query = {
	position_chaudiere: string;
	pdim: number;
	annee_installation_generateur: number;
};

const TABLE_KEY = "chauffage/pn";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
