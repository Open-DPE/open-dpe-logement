import data from "#data/enveloppe/mur/umur0.js";
import { filter } from "#filter.js";

export type Schema = {
	type_mur: string;
	"epaisseur_mur/lt": number | null;
	"epaisseur_mur/lte": number | null;
	"epaisseur_mur/gt": number | null;
	"epaisseur_mur/gte": number | null;
	"annee_construction/lte": number | null;
	"annee_construction/gte": number | null;
	u0: number;
};

export type Query = {
	type_mur: string;
	epaisseur_mur: number;
	annee_construction: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
