import data from "#data/enveloppe/plancher-bas/ue.js";
import { filter } from "#filter.js";

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

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
