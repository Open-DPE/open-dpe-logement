import type { Consommations, UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";

/**
 * @see https://schemas.open-dpe.fr/ventilation/installation
 */
export type Installation = InstallationNaturelle | InstallationMecanique;

export function isInstallation(
	installation: InstallationBase,
): installation is Installation {
	return (
		isVentilationNaturelle(installation) || isVentilationMecanique(installation)
	);
}

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

export type InstallationBase = {
	id: UUID;
	description: string;
	surface: number;
	type: TypeVentilation;
	annee_installation: number | null;
	installation_collective: boolean | null;
	presence_echangeur_thermique: boolean | null;
};

type _Installation<
	T extends Partial<
		Pick<
			InstallationBase,
			| "type"
			| "annee_installation"
			| "installation_collective"
			| "presence_echangeur_thermique"
		>
	>,
> = InstallationBase & T;

export type InstallationNaturelle = _Installation<{
	type: TypeVentilationNaturelle;
	annee_installation: null;
	installation_collective: null;
	presence_echangeur_thermique: null;
}>;

export function isVentilationNaturelle(
	installation: InstallationBase,
): installation is InstallationNaturelle {
	return isTypeVentilationNaturelle(installation.type);
}

export type InstallationMecanique =
	| InstallationVMCDoubleFlux
	| InstallationPuitClimatique
	| InstallationMecaniqueAutres;

export function isVentilationMecanique(
	installation: InstallationBase,
): installation is InstallationMecanique {
	return isTypeVentilationMecanique(installation.type);
}

export type InstallationVMCDoubleFlux = _Installation<{
	type: typeof TypeVentilationEnum.vmc_double_flux;
	installation_collective: boolean;
}>;

export function isVentilationVMCDoubleFlux(
	installation: InstallationBase,
): installation is InstallationVMCDoubleFlux {
	return installation.type === TypeVentilationEnum.vmc_double_flux;
}

export type InstallationPuitClimatique = _Installation<{
	type: typeof TypeVentilationEnum.puit_climatique;
	installation_collective: boolean;
}>;

export function isVentilationPuitClimatique(
	installation: InstallationBase,
): installation is InstallationPuitClimatique {
	return installation.type === TypeVentilationEnum.puit_climatique;
}

export type InstallationMecaniqueAutres = _Installation<{
	type: Exclude<
		TypeVentilationMecanique,
		| typeof TypeVentilationEnum.vmc_double_flux
		| typeof TypeVentilationEnum.puit_climatique
	>;
	presence_echangeur_thermique: null;
}>;

export function isVentilationMecaniqueAutres(
	installation: InstallationBase,
): installation is InstallationMecaniqueAutres {
	return (
		installation.type !== TypeVentilationEnum.vmc_double_flux &&
		installation.type !== TypeVentilationEnum.puit_climatique &&
		isTypeVentilationMecanique(installation.type)
	);
}

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

export function isTypeVentilationNaturelle(type: TypeVentilation): boolean {
	return (TYPES_VENTILATION_NATURELLE as readonly TypeVentilation[]).includes(
		type,
	);
}

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

export function isTypeVentilationMecanique(type: TypeVentilation): boolean {
	return (TYPES_VENTILATION_MECANIQUE as readonly TypeVentilation[]).includes(
		type,
	);
}

export const TYPES_VENTILATION_HYBRIDE = [
	TypeVentilationEnum.ventilation_hybride,
	TypeVentilationEnum.ventilation_hybride_entrees_air_hygroreglables,
] as const satisfies readonly TypeVentilation[];
export type TypeVentilationHybride = (typeof TYPES_VENTILATION_HYBRIDE)[number];
export const TypeVentilationHybrideEnum = buildEnum(TYPES_VENTILATION_HYBRIDE);
