import data from "#data/chauffage/pn.js";
import { filter } from "#filter.js";

export type Schema = {
	position_chaudiere: string;
	"pdim/gt": number | null;
	"pdim/lte": number | null;
	"annee_installation_generateur/gt": number | null;
	"annee_installation_generateur/lte": number | null;
	pn: number;
};

export type Query = {
	position_chaudiere: string;
	pdim: number;
	annee_installation_generateur: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
