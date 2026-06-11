import data from "#data/enveloppe/masque/omb.js";
import { filter } from "#filter.js";

export type Schema = {
	type_masque: string;
	orientation_facade: string;
	secteur_orientation: string | null;
	"hauteur_alpha_masque/gte": number | null;
	"hauteur_alpha_masque/lt": number | null;
	omb: number;
};

export type Query = {
	type_masque: string;
	orientation_facade: string;
	secteur_orientation: string;
	hauteur_alpha_masque: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
