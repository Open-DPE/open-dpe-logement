import data from "#data/performance/etiquette-energie.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type EtiquetteEnergieSchema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/lte": number | null;
	"cep/gte": number | null;
	"cep/lt": number | null;
	"eges/gte": number | null;
	"eges/lt": number | null;
	etiquette_energie: string;
};

export const load = (): EtiquetteEnergieSchema[] =>
	data as EtiquetteEnergieSchema[];
export const search = (
	query: AbaqueQuery,
	rows: EtiquetteEnergieSchema[],
): EtiquetteEnergieSchema[] => filter(query, rows);
