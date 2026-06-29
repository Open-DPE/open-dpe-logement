import { getTable, registerTable } from "#runtime/cache.js";
import { filter } from "#filter.js";

export type Schema = {
	type_vitrage: string;
	type_survitrage: string | null;
	type_baie: string | null;
	nature_lame_air: string | null;
	"epaisseur_lame_air/eq": number | null;
	"epaisseur_lame_air/gte": number | null;
	"epaisseur_lame_air/lt": number | null;
	"inclinaison_vitrage/lt": number | null;
	"inclinaison_vitrage/gte": number | null;
	ug: number;
};

export type Query = {
	type_vitrage: string;
	type_survitrage: string | null;
	type_baie: string | null;
	nature_lame_air: string | null;
	epaisseur_lame_air: number | null;
	inclinaison_vitrage: number | null;
};

const TABLE_KEY = "enveloppe/baie/ug";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
