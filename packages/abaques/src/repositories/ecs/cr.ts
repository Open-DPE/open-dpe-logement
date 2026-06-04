import data from "#data/ecs/cr.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type CrSchema = {
	type_generateur: string;
	energie_generateur: string | null;
	position_chauffe_eau: string | null;
	label_generateur: string | null;
	"volume_stockage/lte": number | null;
	"volume_stockage/gt": number | null;
	cr: number;
};

export const load = (): CrSchema[] => data as CrSchema[];

export const search = (query: AbaqueQuery, rows: CrSchema[]): CrSchema[] =>
	filter(query, rows);
