import data from "#data/ecs/fecs.js";
import { filter } from "#filter.js";

export type Schema = {
	type_batiment: string;
	zone_climatique: string;
	usage_solaire: string;
	"anciennete_installation/gt": number | null;
	"anciennete_installation/lte": number | null;
	fecs: number;
};

export type Query = {
	type_batiment: string;
	zone_climatique: string;
	usage_solaire: string;
	anciennete_installation: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
