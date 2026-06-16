import data from "#data/chauffage/rd.js";
import { filter } from "#filter.js";

export type Schema = {
	type_distribution: string;
	temperature_distribution: string | null;
	presence_fluide_frigorigene: boolean | null;
	reseau_collectif: boolean | null;
	isolation_reseau: boolean | null;
	rd: number;
};

export type Query = Omit<Schema, "rd">;

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
