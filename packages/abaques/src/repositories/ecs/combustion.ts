import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string;
	mode_combustion: string | null;
	"volume_stockage/gt": number | null;
	"volume_stockage/eq": number | null;
	"annee_installation/lte": number | null;
	"annee_installation/gte": number | null;
	"pn/lte": number | null;
	"pn/gt": number | null;
	pn_max: number | null;
	rpn: string;
	qp0: string | number;
	pveilleuse: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	mode_combustion: string;
	volume_stockage: number;
	annee_installation: number;
	pn: number;
};

const TABLE_KEY = "ecs/combustion";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
