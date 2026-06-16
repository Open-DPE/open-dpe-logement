import data from "#data/enveloppe/plancher-haut/uph.js";
import { filter } from "#filter.js";

export type Schema = {
	configuration: string;
	zone_climatique: string;
	effet_joule: boolean;
	"annee_construction_isolation/lte": number | null;
	"annee_construction_isolation/gte": number | null;
	u: number;
};

export type Query = {
	configuration: string;
	zone_climatique: string;
	effet_joule: boolean;
	annee_construction_isolation: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
