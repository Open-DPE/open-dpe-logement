import { getTable, registerTable } from "../../cache.js";
import { filter } from "../../filter.js";

export type Schema = {
	zone_climatique: string;
	"altitude/gt": number | null;
	"altitude/gte": number | null;
	"altitude/lt": number | null;
	"altitude/lte": number | null;
	inertie_lourde_parois_anciennes: boolean;
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

export type Query = {
	zone_climatique: string;
	altitude: number;
	/** Bâtiment à inertie lourde constitué de parois anciennes (3CL-DPE 2021 §18.3) */
	inertie_lourde_parois_anciennes: boolean;
};

const TABLE_KEY = "climat/sollicitations";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
