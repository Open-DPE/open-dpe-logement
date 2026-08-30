import * as z from "zod";

export const TYPES_VENTILATION = {
	ventilation_ouverture_fenetres: "ventilation_ouverture_fenetres",
	ventilation_entrees_air_hautes_basses:
		"ventilation_entrees_air_hautes_basses",
	ventilation_naturelle_conduit_entrees_air_hygroreglables:
		"ventilation_naturelle_conduit_entrees_air_hygroreglables",
	ventilation_naturelle_conduit: "ventilation_naturelle_conduit",
	vmc_simple_flux_autoreglable: "vmc_simple_flux_autoreglable",
	vmc_simple_flux_hygroreglable_a: "vmc_simple_flux_hygroreglable_a",
	vmc_simple_flux_hygroreglable_gaz: "vmc_simple_flux_hygroreglable_gaz",
	vmc_simple_flux_hygroreglable_b: "vmc_simple_flux_hygroreglable_b",
	vmc_basse_pression_autoreglable: "vmc_basse_pression_autoreglable",
	vmc_basse_pression_hygroreglable_a: "vmc_basse_pression_hygroreglable_a",
	vmc_basse_pression_hygroreglable_b: "vmc_basse_pression_hygroreglable_b",
	vmc_double_flux: "vmc_double_flux",
	ventilation_hybride: "ventilation_hybride",
	ventilation_hybride_entrees_air_hygroreglables:
		"ventilation_hybride_entrees_air_hygroreglables",
	ventilation_mecanique_conduit: "ventilation_mecanique_conduit",
	ventilation_mecanique_insufflation: "ventilation_mecanique_insufflation",
	puit_climatique: "puit_climatique",
} as const;

export const TypeVentilationEnum = z.enum(TYPES_VENTILATION);

export const TypeVentilationNaturelleEnum = TypeVentilationEnum.extract([
	TYPES_VENTILATION.ventilation_ouverture_fenetres,
	TYPES_VENTILATION.ventilation_entrees_air_hautes_basses,
	TYPES_VENTILATION.ventilation_naturelle_conduit_entrees_air_hygroreglables,
	TYPES_VENTILATION.ventilation_naturelle_conduit,
]);

export const TypeVentilationMecaniqueEnum = TypeVentilationEnum.extract([
	TYPES_VENTILATION.vmc_simple_flux_autoreglable,
	TYPES_VENTILATION.vmc_simple_flux_hygroreglable_a,
	TYPES_VENTILATION.vmc_simple_flux_hygroreglable_gaz,
	TYPES_VENTILATION.vmc_simple_flux_hygroreglable_b,
	TYPES_VENTILATION.vmc_basse_pression_autoreglable,
	TYPES_VENTILATION.vmc_basse_pression_hygroreglable_a,
	TYPES_VENTILATION.vmc_basse_pression_hygroreglable_b,
	TYPES_VENTILATION.ventilation_hybride,
	TYPES_VENTILATION.ventilation_hybride_entrees_air_hygroreglables,
	TYPES_VENTILATION.ventilation_mecanique_conduit,
	TYPES_VENTILATION.ventilation_mecanique_insufflation,
	TYPES_VENTILATION.vmc_double_flux,
	TYPES_VENTILATION.puit_climatique,
]);

export const TypeVentilationHybrideEnum = TypeVentilationEnum.extract([
	TYPES_VENTILATION.ventilation_hybride,
	TYPES_VENTILATION.ventilation_hybride_entrees_air_hygroreglables,
]);

export type TypeVentilationEnum = z.infer<typeof TypeVentilationEnum>;

export type TypeVentilationNaturelleEnum = z.infer<
	typeof TypeVentilationNaturelleEnum
>;

export type TypeVentilationMecaniqueEnum = z.infer<
	typeof TypeVentilationMecaniqueEnum
>;

export type TypeVentilationHybrideEnum = z.infer<
	typeof TypeVentilationHybrideEnum
>;
