import type { UUID, NonEmptyArray } from "#/common/common";
import { buildEnum, createGuard } from "#/utils.js";
import * as systeme from "./systeme.js";

export const isInstallation = createGuard<Installation>(
	"/chauffage/installation",
);

/**
 * @see https://schemas.open-dpe.fr/chauffage/installation
 */
export type Installation = {
	id: UUID;
	description: string;
	surface: number;
	type: TypeInstallation;
	installation_collective: boolean;
	comptage_individuel: boolean | null;
	regulation_terminale: boolean | null;
	programmation: TypeProgrammation;
	solaire_thermique: SolaireThermique | null;
	systemes: NonEmptyArray<systeme.Systeme>;
};

export type InstallationWithData<T extends Installation = Installation> = T & {
	data: InstallationData;
};

export type InstallationData = {
	bch: number;
	rdim: number;
	pch: number;
	fch: number;
};

export type SolaireThermique = {
	usage: UsageSolaire;
	annee_installation: number | null;
	fch: number | null;
};

export const TYPES_INSTALLATION = ["central", "divise"] as const;
export type TypeInstallation = (typeof TYPES_INSTALLATION)[number];
export const TypeInstallationEnum = buildEnum(TYPES_INSTALLATION);

export const TYPES_PROGRAMMATION = [
	"absent",
	"central_sans_minimum_temperature",
	"central_avec_minimum_temperature",
	"central_collectif_sans_detection_presence",
	"central_collectif_avec_detection_presence",
	"terminal_avec_minimum_temperature",
	"terminal_avec_minimum_temperature_detection_presence",
];
export type TypeProgrammation = (typeof TYPES_PROGRAMMATION)[number];
export const TypeProgrammationEnum = buildEnum(TYPES_PROGRAMMATION);

export const USAGES_SOLAIRE = ["chauffage", "chauffage_ecs"] as const;
export type UsageSolaire = (typeof USAGES_SOLAIRE)[number];
export const UsageSolaireEnum = buildEnum(USAGES_SOLAIRE);

export const CONFIGURATIONS = [
	"base",
	"base_appoint",
	"base_releve",
	"base_releve_appoint",
] as const;
export type Configuration = (typeof CONFIGURATIONS)[number];
export const ConfigurationEnum = buildEnum(CONFIGURATIONS);
