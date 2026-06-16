import data from "#data/ventilation/pvent.js";
import { filter } from "#filter.js";

export type Schema = {
	type_ventilation: string;
	"annee_installation/gt": number | null;
	"annee_installation/lte": number | null;
	pvent: number;
};

export type Query = {
	type_ventilation: string;
	annee_installation: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
