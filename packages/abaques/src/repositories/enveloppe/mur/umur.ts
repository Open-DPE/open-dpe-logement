import data from "#data/enveloppe/mur/umur.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	"annee_construction_isolation/gte": number | null;
	"annee_construction_isolation/lte": number | null;
	effet_joule: boolean;
	u: number;
};

export type Query = {
	zone_climatique: string;
	annee_construction_isolation: number;
	effet_joule: boolean;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
