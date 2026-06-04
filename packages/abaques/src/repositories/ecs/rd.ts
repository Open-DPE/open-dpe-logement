import data from "#data/ecs/rd.js";
import { type AbaqueQuery, filter } from "#filter.js";

export type EcsRdSchema = {
	installation_collective: boolean;
	bouclage_reseau: string | null;
	alimentation_contigue: boolean | null;
	production_volume_habitable: boolean | null;
	rd: number;
};

export const load = (): EcsRdSchema[] => data as EcsRdSchema[];

export const search = (
	query: AbaqueQuery,
	rows: EcsRdSchema[],
): EcsRdSchema[] => filter(query, rows);
