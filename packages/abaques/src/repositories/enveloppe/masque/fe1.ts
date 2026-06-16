import data from "#data/enveloppe/masque/fe1.js";
import { filter } from "#filter.js";

export type Schema = {
	type_masque: string;
	orientation_facade: string;
	"avancee_masque/gte": number | null;
	"avancee_masque/lte": number | null;
	fe1: number;
};

export type Query = {
	type_masque: string;
	orientation_facade: string;
	avancee_masque: number | null;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
