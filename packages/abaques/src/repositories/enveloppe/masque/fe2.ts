import data from "#data/enveloppe/masque/fe2.js";
import { filter } from "#filter.js";

export type Schema = {
	type_masque: string;
	orientation_facade: string;
	"hauteur_alpha_masque/gte": number | null;
	"hauteur_alpha_masque/lt": number | null;
	fe2: number;
};

export type Query = {
	type_masque: string;
	orientation_facade: string;
	hauteur_alpha_masque: number;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
