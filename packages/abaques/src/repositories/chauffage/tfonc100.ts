import data from "#data/chauffage/tfonc100.js";
import { filter } from "#filter.js";

export type Schema = {
	temperature_distribution: string;
	"annee_installation_emetteur/gte": number | null;
	"annee_installation_emetteur/lte": number | null;
	tfonc100: number;
};

export type Query = {
	temperature_distribution: string;
	annee_installation_emetteur: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
