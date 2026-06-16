import data from "#data/enveloppe/permeabilite/q4paconv.js";
import { filter } from "#filter.js";

export type Schema = {
	type_batiment: string;
	"annee_construction/gte": number | null;
	"annee_construction/lte": number | null;
	presence_joints_menuiserie: boolean | null;
	isolation_murs_plafonds: boolean | null;
	q4paconv: number;
};

export type Query = {
	type_batiment: string;
	annee_construction: number;
	presence_joints_menuiserie: boolean | null;
	isolation_murs_plafonds: boolean | null;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
