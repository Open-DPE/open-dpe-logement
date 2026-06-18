import { validate } from "@open-dpe-logement/schemas/ventilation/installation";
import type { Consommations, UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";

export function isInstallation(data: unknown): data is Installation {
	return validate(data).isValid;
}

export function isVentilationNaturelle(
	installation: Installation,
): installation is InstallationNaturelle {
	return isTypeVentilationNaturelle(installation.type);
}

export function isVentilationMecanique(
	installation: Installation,
): installation is InstallationMecanique {
	return isTypeVentilationMecanique(installation.type);
}

export function isVentilationVMCDoubleFlux(
	installation: Installation,
): installation is InstallationVMCDoubleFlux {
	return installation.type === TypeVentilationEnum.vmc_double_flux;
}

export function isVentilationPuitClimatique(
	installation: Installation,
): installation is InstallationPuitClimatique {
	return installation.type === TypeVentilationEnum.puit_climatique;
}

export function isTypeVentilationNaturelle(type: TypeVentilation): boolean {
	return TYPES_VENTILATION_NATURELLE.includes(type as any);
}

export function isTypeVentilationMecanique(type: TypeVentilation): boolean {
	return TYPES_VENTILATION_MECANIQUE.includes(type as any);
}

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

export type InstallationData = {
	rdim: number;
	pvent_moy: number;
	hvent: number;
	qvarep_conv: number;
	qvasouf_conv: number;
	smea_conv: number;
	consommations: Consommations;
};

type InstallationType<
	T extends {
		type: TypeVentilation;
		annee_installation?: number | null;
		installation_collective?: boolean | null;
		presence_echangeur_thermique?: boolean | null;
	},
> = {
	id: UUID;
	description: string;
	surface: number;
	type: TypeVentilation;
	annee_installation: number | null;
	installation_collective: boolean | null;
	presence_echangeur_thermique: boolean | null;
} & T;

export type InstallationNaturelle = InstallationType<{
	type: TypeVentilationNaturelle;
	annee_installation: null;
	installation_collective: null;
	presence_echangeur_thermique: null;
}>;

export type InstallationVMCDoubleFlux = InstallationType<{
	type: typeof TypeVentilationEnum.vmc_double_flux;
	installation_collective: boolean;
}>;

export type InstallationPuitClimatique = InstallationType<{
	type: typeof TypeVentilationEnum.puit_climatique;
	installation_collective: boolean;
}>;

export type InstallationMecanique = InstallationType<{
	type: Exclude<
		TypeVentilationMecanique,
		| typeof TypeVentilationEnum.vmc_double_flux
		| typeof TypeVentilationEnum.puit_climatique
	>;
	presence_echangeur_thermique: null;
}>;

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

export const TYPES_VENTILATION_NATURELLE = [
	TypeVentilationEnum.ventilation_ouverture_fenetres,
	TypeVentilationEnum.ventilation_entrees_air_hautes_basses,
	TypeVentilationEnum.ventilation_naturelle_conduit_entrees_air_hygroreglables,
	TypeVentilationEnum.ventilation_naturelle_conduit,
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationNaturelle =
	(typeof TYPES_VENTILATION_NATURELLE)[number];
export const TypeVentilationNaturelleEnum = buildEnum(
	TYPES_VENTILATION_NATURELLE,
);

export const TYPES_VENTILATION_MECANIQUE = [
	TypeVentilationEnum.vmc_simple_flux_autoreglable,
	TypeVentilationEnum.vmc_simple_flux_hygroreglable_a,
	TypeVentilationEnum.vmc_simple_flux_hygroreglable_gaz,
	TypeVentilationEnum.vmc_simple_flux_hygroreglable_b,
	TypeVentilationEnum.vmc_basse_pression_autoreglable,
	TypeVentilationEnum.vmc_basse_pression_hygroreglable_a,
	TypeVentilationEnum.vmc_basse_pression_hygroreglable_b,
	TypeVentilationEnum.ventilation_hybride,
	TypeVentilationEnum.ventilation_hybride_entrees_air_hygroreglables,
	TypeVentilationEnum.ventilation_mecanique_conduit,
	TypeVentilationEnum.ventilation_mecanique_insufflation,
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationMecanique =
	(typeof TYPES_VENTILATION_MECANIQUE)[number];
export const TypeVentilationMecaniqueEnum = buildEnum(
	TYPES_VENTILATION_MECANIQUE,
);

export const TYPES_VENTILATION_HYBRIDE = [
	TypeVentilationEnum.ventilation_hybride,
	TypeVentilationEnum.ventilation_hybride_entrees_air_hygroreglables,
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationHybride = (typeof TYPES_VENTILATION_HYBRIDE)[number];
export const TypeVentilationHybrideEnum = buildEnum(TYPES_VENTILATION_HYBRIDE);
