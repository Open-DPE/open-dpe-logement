import * as z from "zod";

export const TypeVentilation = z.enum({
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
});

export type TypeVentilation = z.infer<typeof TypeVentilation>;

export const TypeVentilationNaturelle = TypeVentilation.extract([
	"ventilation_ouverture_fenetres",
	"ventilation_entrees_air_hautes_basses",
	"ventilation_naturelle_conduit_entrees_air_hygroreglables",
	"ventilation_naturelle_conduit",
]);

export type TypeVentilationNaturelle = z.infer<typeof TypeVentilationNaturelle>;

export const TypeVentilationMecanique = TypeVentilation.extract([
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
	"vmc_double_flux",
	"puit_climatique",
]);

export type TypeVentilationMecanique = z.infer<typeof TypeVentilationMecanique>;

export const TypeVentilationHybride = TypeVentilation.extract([
	"ventilation_hybride",
	"ventilation_hybride_entrees_air_hygroreglables",
]);

export type TypeVentilationHybride = z.infer<typeof TypeVentilationHybride>;
