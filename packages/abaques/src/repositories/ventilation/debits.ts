import data from "#data/ventilation/debits.js";
import { filter } from "#filter.js";

export type Schema = {
	type_ventilation: string;
	presence_echangeur_thermique: boolean | null;
	installation_collective: boolean | null;
	"annee_installation/gte": number | null;
	"annee_installation/lte": number | null;
	qvarep_conv: number;
	qvasouf_conv: number;
	smea_conv: number;
};

export type Query = {
	type_ventilation: string;
	presence_echangeur_thermique: boolean | null;
	installation_collective: boolean | null;
	annee_installation: number | null;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
