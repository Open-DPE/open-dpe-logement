import data from "#data/enveloppe/masque/omb.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type OmbSchema = {
	type_masque: string;
	orientation_facade: string | null;
	secteur_orientation: string | null;
	"hauteur_alpha_masque/gte": number | null;
	"hauteur_alpha_masque/lt": number | null;
	omb: number;
};

export const load = (): OmbSchema[] => data as OmbSchema[];

export const search = (query: AbaqueQuery, rows: OmbSchema[]): OmbSchema[] =>
	filter(query, rows);
