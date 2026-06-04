import type { Consommations, UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";

/**
 * @see https://schemas.open-dpe.fr/ventilation/installation
 */
export type Installation =
	| InstallationNaturelle
	| InstallationMecanique
	| InstallationVMCDoubleFlux
	| InstallationPuitClimatique;

export type InstallationWithData<T extends Installation = Installation> = T & {
	data: InstallationData;
};

type InstallationGeneric<T> = {
	id: UUID;
	description: string;
	surface: number;
	type: TypeVentilation;
	annee_installation: number | null;
	installation_collective: boolean | null;
	presence_echangeur_thermique: boolean | null;
} & T;

export type InstallationNaturelle = InstallationGeneric<{
	type: TypeVentilationNaturelle;
	annee_installation: null;
	installation_collective: null;
}>;

export type InstallationMecanique = InstallationGeneric<{
	type: TypeVentilationMecanique;
	installation_collective: boolean;
	presence_echangeur_thermique: null;
}>;

export type InstallationVMCDoubleFlux = InstallationGeneric<{
	type: typeof TypeVentilationEnum.vmc_double_flux;
	installation_collective: boolean;
}>;

export type InstallationPuitClimatique = InstallationGeneric<{
	type: typeof TypeVentilationEnum.puit_climatique;
	installation_collective: boolean;
}>;

export type InstallationData = {
	rdim: number;
	qvarep_conv: number;
	qvasouf_conv: number;
	smea_conv: number;
	consommations: Consommations;
};

export const TYPES_VENTILATION = [
	"ventilation_ouverture_fenetres",
	"ventilation_entrees_air_hautes_basses",
	"ventilation_naturelle_conduit_entrees_air_hygroreglables",
	"ventilation_naturelle_conduit",
	"vmc_simple_flux_autoreglable",
	"vmc_simple_flux_hygroreglable_a",
	"vmc_simple_flux_hygroreglable_gaz",
	"vmc_simple_flux_hygroreglable_b",
	"vmc_basse_pression_autoreglable",
	"vmc_basse_pression_hygroreglable_a",
	"vmc_basse_pression_hygroreglable_b",
	"vmc_double_flux",
	"ventilation_hybride",
	"ventilation_hybride_entrees_air_hygroreglables",
	"ventilation_mecanique_conduit",
	"ventilation_mecanique_insufflation",
	"puit_climatique",
] as const;
export type TypeVentilation = (typeof TYPES_VENTILATION)[number];
export const TypeVentilationEnum = buildEnum(TYPES_VENTILATION);

export const TYPES_VENTILATION_NATURELLE: readonly TypeVentilation[] = [
	"ventilation_ouverture_fenetres",
	"ventilation_entrees_air_hautes_basses",
	"ventilation_naturelle_conduit_entrees_air_hygroreglables",
	"ventilation_naturelle_conduit",
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationNaturelle =
	(typeof TYPES_VENTILATION_NATURELLE)[number];
export const TypeVentilationNaturelleEnum = buildEnum(
	TYPES_VENTILATION_NATURELLE,
);

export const TYPES_VENTILATION_MECANIQUE = [
	"vmc_simple_flux_autoreglable",
	"vmc_simple_flux_hygroreglable_a",
	"vmc_simple_flux_hygroreglable_gaz",
	"vmc_simple_flux_hygroreglable_b",
	"vmc_basse_pression_autoreglable",
	"vmc_basse_pression_hygroreglable_a",
	"vmc_basse_pression_hygroreglable_b",
	"ventilation_hybride",
	"ventilation_hybride_entrees_air_hygroreglables",
	"ventilation_mecanique_conduit",
	"ventilation_mecanique_insufflation",
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationMecanique =
	(typeof TYPES_VENTILATION_MECANIQUE)[number];
export const TypeVentilationMecaniqueEnum = buildEnum(
	TYPES_VENTILATION_MECANIQUE,
);

export const TYPES_VENTILATION_HYBRIDE: readonly TypeVentilation[] = [
	"ventilation_hybride",
	"ventilation_hybride_entrees_air_hygroreglables",
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationHybride = (typeof TYPES_VENTILATION_HYBRIDE)[number];
export const TypeVentilationHybrideEnum = buildEnum(TYPES_VENTILATION_HYBRIDE);
