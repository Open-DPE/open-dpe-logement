import data from "#data/climat/epv.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type EpvSchema = {
	mois: string;
	zone_climatique: string;
	epv: number;
};

export const load = (): EpvSchema[] => data as EpvSchema[];
export const search = (query: AbaqueQuery, rows: EpvSchema[]): EpvSchema[] =>
	filter(query, rows);
