import { getTable, registerTable } from "../../../cache.js";
import { filter } from "../../../filter.js";

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

const TABLE_KEY = "enveloppe/masque/fe2";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
