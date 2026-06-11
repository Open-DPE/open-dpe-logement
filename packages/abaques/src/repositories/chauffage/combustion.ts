import data from "#data/chauffage/combustion.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string;
	mode_combustion: string;
	"annee_installation/lte": number | null;
	"annee_installation/gte": number | null;
	"pn/lte": number | null;
	"pn/gt": number | null;
	pn_max: number | null;
	rpn: string;
	rpint: string;
	qp0: string;
	pveilleuse: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	mode_combustion: string;
	annee_installation: number;
	pn: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
