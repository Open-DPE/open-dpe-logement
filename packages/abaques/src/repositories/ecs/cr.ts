import data from "#data/ecs/cr.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	position_chauffe_eau: string | null;
	label_generateur: string | null;
	"volume_stockage/lte": number | null;
	"volume_stockage/gt": number | null;
	cr: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	position_chauffe_eau: string | null;
	label_generateur: string | null;
	volume_stockage: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
