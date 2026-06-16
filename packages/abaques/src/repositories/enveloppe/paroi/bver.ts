import data from "#data/enveloppe/paroi/bver.js";
import { filter } from "#filter.js";

export type Schema = {
	zone_climatique: string;
	orientation_ets: string;
	isolation_paroi: boolean;
	bver: number;
};

export type Query = {
	zone_climatique: string;
	orientation_ets: string;
	isolation_paroi: boolean;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
