import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_emission: string;
	type_generateur: string | null;
	label_generateur: string | null;
	reseau_collectif: boolean | null;
	presence_robinet_thermostatique: boolean | null;
	presence_regulation_terminale: boolean | null;
	rr: number;
};

export type Query = Omit<Schema, "rr">;

const TABLE_KEY = "chauffage/rr";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
