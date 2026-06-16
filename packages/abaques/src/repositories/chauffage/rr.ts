import data from "#data/chauffage/rr.js";
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

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
