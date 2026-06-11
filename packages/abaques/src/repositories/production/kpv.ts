import data from "#data/production/kpv.js";
import { filter } from "#filter.js";

export type Schema = {
	orientation_pv: string;
	"inclinaison_pv/gt": number | null;
	"inclinaison_pv/lte": number | null;
	kpv: number;
};

export type Query = {
	orientation_pv: string;
	inclinaison_pv: number;
};

export const load = (): Schema[] => data as Schema[];
export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
