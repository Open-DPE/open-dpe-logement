import data from "#data/chauffage/tfonc30.js";
import { filter } from "#filter.js";

export type Schema = {
	mode_combustion: string;
	temperature_distribution: string;
	"annee_installation_emetteur/lte": number | null;
	"annee_installation_emetteur/gte": number | null;
	"annee_installation_generateur/lte": number | null;
	"annee_installation_generateur/gte": number | null;
	tfonc30: number;
};

export type Query = {
	mode_combustion: string;
	temperature_distribution: string;
	annee_installation_emetteur: number;
	annee_installation_generateur: number;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
