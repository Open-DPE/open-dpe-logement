import data from "#data/enveloppe/local-non-chauffe/b.js";
import { filter } from "#filter.js";

export type Schema = {
	uvue: number;
	isolation_aiu: boolean;
	isolation_aue: boolean;
	"aiu_aue/gt": number | null;
	"aiu_aue/lte": number | null;
	b: number;
};

export type Query = {
	uvue: number;
	isolation_aiu: boolean;
	isolation_aue: boolean;
	aiu_aue: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
