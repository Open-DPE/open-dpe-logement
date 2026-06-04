import type {
	Consommations,
	Pertes,
	PositiveNumber,
	UUID,
} from "../common/common.js";
import { buildEnum } from "../utils.js";
import * as systeme from "./systeme.js";

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
	rdim: number;
	fecs: number;
	iecs: number;
	pertes: Pertes;
	consommations: Consommations;
};

export type SolaireThermique = {
	usage: UsageSolaire;
	annee_installation: number | null;
	fecs: number | null;
};

export const USAGES_SOLAIRE = ["ecs", "chauffage_ecs"] as const;
export type UsageSolaire = (typeof USAGES_SOLAIRE)[number];
export const UsageSolaireEnum = buildEnum(USAGES_SOLAIRE);
