import { getTable, registerTable } from "#runtime/cache.js";
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

const TABLE_KEY = "ecs/rd";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
