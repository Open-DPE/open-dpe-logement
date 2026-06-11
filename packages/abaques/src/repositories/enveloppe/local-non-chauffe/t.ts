import data from "#data/enveloppe/local-non-chauffe/t.js";
import { filter } from "#filter.js";

export type Schema = {
	type_vitrage: string;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
	t: number;
};

export type Query = {
	type_vitrage: string;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
};

export const load = (): Schema[] => data as Schema[];
export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
