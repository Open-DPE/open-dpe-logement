import data from "#data/ecs/rd.js";
import { filter } from "#filter.js";

export type Schema = {
	installation_collective: boolean;
	bouclage_reseau: string | null;
	alimentation_contigue: boolean | null;
	production_volume_habitable: boolean | null;
	rd: number;
};

export type Query = {
	installation_collective: boolean;
	bouclage_reseau: string | null;
	alimentation_contigue: boolean | null;
	production_volume_habitable: boolean | null;
};

export const load = (): Schema[] => data as Schema[];

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
