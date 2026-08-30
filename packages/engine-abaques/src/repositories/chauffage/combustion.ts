import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	mode_combustion: string | null;
	"annee_installation/lte": number | null;
	"annee_installation/gte": number | null;
	"pn/lte": number | null;
	"pn/gt": number | null;
	pn_max: number | null;
	rpn: string | number;
	rpint: string | number;
	qp0: string | number;
	pveilleuse: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	mode_combustion: string;
	annee_installation: number;
	pn: number;
};

const TABLE_KEY = "chauffage/combustion";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
