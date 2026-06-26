import type { UUID, NonEmptyArray } from "../common/common.js";
import { buildEnum } from "../utils.js";
import * as systeme from "./systeme.js";

/**
 * @see https://schemas.open-dpe.fr/ecs/installation
 */
export type Installation = {
	id: UUID;
	description: string;
	surface: number;
	installation_collective: boolean;
	systemes: NonEmptyArray<systeme.Systeme>;
	solaire_thermique: SolaireThermique | null;
};

export type InstallationWithData<T extends Installation = Installation> = T & {
	data: InstallationData;
	systemes: NonEmptyArray<systeme.SystemeWithData>;
};

export type InstallationData = {
	becs: number;
	rdim: number;
	fecs: number;
	qdw: number;
	qdw_ind_vc: number;
	qdw_col_vc: number;
	qdw_col_hvc: number;
};

export type SolaireThermique = {
	usage: UsageSolaire;
	annee_installation: number | null;
	fecs: number | null;
};

export const USAGES_SOLAIRE = ["ecs", "chauffage_ecs"] as const;
export type UsageSolaire = (typeof USAGES_SOLAIRE)[number];
export const UsageSolaireEnum = buildEnum(USAGES_SOLAIRE);
