import { SCHEMA_KEYS } from "@open-dpe-logement/schemas";
import type {
	PositiveNumber,
	UUID,
} from "#/common/common";
import { buildEnum, createGuard } from "#/utils";
import * as systeme from "./systeme.js";

export const isInstallation = createGuard<Installation>(SCHEMA_KEYS["ecs/installation"]);

/**
 * @see https://schemas.open-dpe.fr/ecs/installation
 */
export type Installation = {
	id: UUID;
	description: string;
	surface: PositiveNumber;
	installation_collective: boolean;
	systemes: [systeme.Systeme] | [systeme.Systeme, systeme.Systeme];
	solaire_thermique: SolaireThermique | null;
};

export type InstallationWithData<T extends Installation = Installation> = T & {
	data: InstallationData;
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
