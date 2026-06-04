import data from "#data/climat/sollicitations.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type SollicitationsSchema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/gte": number | null;
	"altitude/lt": number | null;
	"altitude/lte": number | null;
	parois_anciennes: boolean;
	inertie: string;
	mois: string;
	tefs: number;
	e: number;
	efr26: number;
	efr28: number;
	text: number | null;
	textmoy26: number | null;
	textmoy28: number | null;
	nref19: number;
	nref21: number;
	nref26: number;
	nref28: number;
	dh14: number;
	dh19: number;
	dh21: number;
	dh26: number;
	dh28: number;
};

export const load = (): SollicitationsSchema[] =>
	data as SollicitationsSchema[];

export const search = (
	query: AbaqueQuery,
	rows: SollicitationsSchema[],
): SollicitationsSchema[] => filter(query, rows);
