import data from "#data/climat/c1.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	orientation: string;
	"inclinaison/gte": number | null;
	"inclinaison/lt": number | null;
	"inclinaison/lte": number | null;
	mois: string;
	c1: number;
};

export type Query = {
	zone_climatique: string;
	orientation: string;
	inclinaison: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
