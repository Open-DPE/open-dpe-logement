import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	id: string;
	contenu_co2: number;
	contenu_co2_acv: number;
	taux_enr: number;
	feges: number;
};

export type Query = {
	id: string;
};

const TABLE_KEY = "performance/reseau";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
