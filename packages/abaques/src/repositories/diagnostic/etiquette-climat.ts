import data from "#data/performance/etiquette-climat.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type EtiquetteClimatSchema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/lte": number | null;
	"eges/gte": number | null;
	"eges/lt": number | null;
	etiquette_climat: string;
};

export const load = (): EtiquetteClimatSchema[] =>
	data as EtiquetteClimatSchema[];
export const search = (
	query: AbaqueQuery,
	rows: EtiquetteClimatSchema[],
): EtiquetteClimatSchema[] => filter(query, rows);
