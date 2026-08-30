import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	type_ventilation: string;
	"annee_installation/gt": number | null;
	"annee_installation/lte": number | null;
	pvent_moy: number;
};

export type Query = {
	type_ventilation: string;
	annee_installation: number;
};

const TABLE_KEY = "ventilation/pvent_moy";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
