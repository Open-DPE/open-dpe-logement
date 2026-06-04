import data from "#data/enveloppe/masque/fe2.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type Fe2Schema = {
	type_masque: string;
	orientation_facade: string | null;
	"hauteur_masque_alpha/gte": number | null;
	"hauteur_masque_alpha/lt": number | null;
	hauteur_alpha_defaut: number | null;
	fe2: number;
};

export const load = (): Fe2Schema[] => data as Fe2Schema[];

export const search = (query: AbaqueQuery, rows: Fe2Schema[]): Fe2Schema[] =>
	filter(query, rows);
