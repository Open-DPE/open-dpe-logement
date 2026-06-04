import data from "#data/ecs/cop.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type CopSchema = {
	type_generateur: string;
	zone_climatique: string;
	"annee_installation/gte": number | null;
	"annee_installation/lte": number | null;
	cop: number;
};

export const load = (): CopSchema[] => data as CopSchema[];

export const search = (query: AbaqueQuery, rows: CopSchema[]): CopSchema[] =>
	filter(query, rows);
