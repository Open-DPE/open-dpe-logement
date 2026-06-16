import data from "#data/performance/reseau.js";
import { filter } from "#filter.js";

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

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
