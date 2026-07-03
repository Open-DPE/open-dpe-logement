import * as models from "@open-dpe-logement/models";

type TypeVentilation = models.ventilation.installation.TypeVentilation;
const TypeVentilationEnum = models.ventilation.installation.TypeVentilationEnum;

/**
 * @XSD //ventilation_collection/ventilation/donnee_entree/enum_type_ventilation_id
 */
export const TYPES_VENTILATION: Record<number, TypeVentilation> = {
	1: {
		type: TypeVentilationEnum.ventilation_ouverture_fenetres,
		annee_installation: null,
		installation_collective: null,
		presence_echangeur_thermique: null,
	},
	2: TypeVentilationEnum.ventilation_entrees_air_hautes_basses,
	3: TypeVentilationEnum.vmc_simple_flux_autoreglable,
	4: TypeVentilationEnum.vmc_simple_flux_autoreglable,
	5: TypeVentilationEnum.vmc_simple_flux_autoreglable,
	6: TypeVentilationEnum.vmc_simple_flux_autoreglable,
	7: TypeVentilationEnum.vmc_simple_flux_hygroreglable_a,
	8: TypeVentilationEnum.vmc_simple_flux_hygroreglable_a,
	9: TypeVentilationEnum.vmc_simple_flux_hygroreglable_a,
	10: TypeVentilationEnum.vmc_simple_flux_hygroreglable_gaz,
	11: TypeVentilationEnum.vmc_simple_flux_hygroreglable_gaz,
	12: TypeVentilationEnum.vmc_simple_flux_hygroreglable_gaz,
	13: TypeVentilationEnum.vmc_simple_flux_hygroreglable_b,
	14: TypeVentilationEnum.vmc_simple_flux_hygroreglable_b,
	15: TypeVentilationEnum.vmc_simple_flux_hygroreglable_b,
	16: TypeVentilationEnum.vmc_basse_pression_autoreglable,
	17: TypeVentilationEnum.vmc_basse_pression_hygroreglable_a,
	18: TypeVentilationEnum.vmc_basse_pression_hygroreglable_b,
	19: TypeVentilationEnum.vmc_double_flux,
	20: TypeVentilationEnum.vmc_double_flux,
	21: TypeVentilationEnum.vmc_double_flux,
	22: TypeVentilationEnum.vmc_double_flux,
	23: TypeVentilationEnum.vmc_double_flux,
	24: TypeVentilationEnum.vmc_double_flux,
	25: TypeVentilationEnum.ventilation_naturelle_conduit,
	26: TypeVentilationEnum.ventilation_hybride,
	27: TypeVentilationEnum.ventilation_hybride,
	28: TypeVentilationEnum.ventilation_hybride,
	29: TypeVentilationEnum.ventilation_hybride_entrees_air_hygroreglables,
	30: TypeVentilationEnum.ventilation_hybride_entrees_air_hygroreglables,
	31: TypeVentilationEnum.ventilation_hybride_entrees_air_hygroreglables,
	32: TypeVentilationEnum.ventilation_mecanique_conduit,
	33: TypeVentilationEnum.ventilation_mecanique_conduit,
	34: TypeVentilationEnum.ventilation_naturelle_conduit_entrees_air_hygroreglables,
	35: TypeVentilationEnum.puit_climatique,
	36: TypeVentilationEnum.puit_climatique,
	37: TypeVentilationEnum.puit_climatique,
	38: TypeVentilationEnum.puit_climatique,
} as const;
