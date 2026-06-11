import data from "#data/enveloppe/baie/uw.js";
import { filter } from "#filter.js";

export type Schema = {
	type_baie: string;
	presence_soubassement: boolean | null;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
	ug: number | null;
	uw: number;
};

export type Query = {
	type_baie: string;
	presence_soubassement: boolean | null;
	materiau: string | null;
	presence_rupteur_pont_thermique: boolean | null;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
