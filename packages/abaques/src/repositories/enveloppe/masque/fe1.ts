import data from "#data/enveloppe/masque/fe1.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type Fe1Schema = {
	type_masque: string;
	orientation_facade: string | null;
	"avancee_masque/gte": number | null;
	"avancee_masque/lte": number | null;
	avancee_defaut: number | null;
	fe1: number;
};

export const load = (): Fe1Schema[] => data as Fe1Schema[];
export const search = (query: AbaqueQuery, rows: Fe1Schema[]): Fe1Schema[] =>
	filter(query, rows);
