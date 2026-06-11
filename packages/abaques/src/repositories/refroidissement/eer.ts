import data from "#data/refroidissement/eer.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	"annee_installation/gte": number | null;
	"annee_installation/lte": number | null;
	eer: number;
};

export type Query = {
	zone_climatique: string;
	annee_installation: number;
};

export const load = (): Schema[] => data as Schema[];
export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
