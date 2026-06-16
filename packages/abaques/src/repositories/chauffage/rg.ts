import data from "#data/chauffage/rg.js";
import { filter } from "#filter.js";

export type Schema = {
	type_generateur: string;
	energie_generateur: string | null;
	label_generateur: string | null;
	"annee_installation_generateur/gte": number | null;
	"annee_installation_generateur/lte": number | null;
	rg: number;
};

export type Query = {
	type_generateur: string;
	energie_generateur: string;
	label_generateur: string | null;
	annee_installation_generateur: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
