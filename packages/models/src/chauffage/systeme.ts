import type { Consommations, UUID, NonEmptyArray } from "#/common/common.js";
import { buildEnum } from "#/utils.js";

/**
 * @see https://schemas.open-dpe.fr/chauffage/systeme
 */
export type Systeme = SystemeCentral | SystemeDivise;

export type SystemeWithData<T extends Systeme = Systeme> = T & {
	data: SystemeData;
};

export type SystemeData = {
	rdim: number;
	ich: number;
	rd: number;
	re: number;
	rg: number;
	rr: number;
	consommations: Consommations;
};

type SystemeBase = {
	id: UUID;
	description: string;
	type: TypeSysteme;
	generateur_id: UUID;
	reseau: Reseau | null;
};

export type SystemeCentral = SystemeBase & {
	type: typeof TypeSystemeEnum.central;
	reseau: Reseau;
};

export type SystemeDivise = SystemeBase & {
	type: typeof TypeSystemeEnum.divise;
	reseau: null;
};

export type Reseau = ReseauHydraulique | ReseauAeraulique;

type ReseauBase = {
	type_distribution: TypeDistribution;
	presence_fluide_frigorigene: boolean;
	presence_circulateur_externe: boolean;
	niveaux_desservis: number;
	isolation: boolean | null;
	emetteurs: UUID[];
};

export type ReseauHydraulique = ReseauBase & {
	type_distribution: typeof TypeDistributionEnum.hydraulique;
	temperature_distribution: TemperatureDistribution | null;
	emetteurs: NonEmptyArray<UUID>;
};

export type ReseauAeraulique = ReseauBase & {
	type_distribution: typeof TypeDistributionEnum.aeraulique;
	temperature_distribution: null;
	emetteurs: [];
};

export const TYPES_SYSTEME = ["central", "divise"] as const;
export type TypeSysteme = (typeof TYPES_SYSTEME)[number];
export const TypeSystemeEnum = buildEnum(TYPES_SYSTEME);

export const TYPES_DISTRIBUTION = ["hydraulique", "aeraulique"] as const;
export type TypeDistribution = (typeof TYPES_DISTRIBUTION)[number];
export const TypeDistributionEnum = buildEnum(TYPES_DISTRIBUTION);

export const TEMPERATURE_DISTRIBUTIONS = ["basse", "moyenne", "haute"] as const;
export type TemperatureDistribution =
	(typeof TEMPERATURE_DISTRIBUTIONS)[number];
export const TemperatureDistributionEnum = buildEnum(TEMPERATURE_DISTRIBUTIONS);

export const TYPES_EMISSION = [
	"radiateur",
	"air_souffle",
	"plancher_chauffant",
	"plafond_chauffant",
] as const;
export type TypeEmission = (typeof TYPES_EMISSION)[number];
export const TypeEmissionEnum = buildEnum(TYPES_EMISSION);

export const ROLES = ["base", "releve", "appoint"] as const;
export type Role = (typeof ROLES)[number];
export const RoleEnum = buildEnum(ROLES);

export const TYPES_RELEVE = ["releve_chaudiere_bois", "releve_pac"] as const;
export type TypeReleve = (typeof TYPES_RELEVE)[number];
export const TypeReleveEnum = buildEnum(TYPES_RELEVE);
