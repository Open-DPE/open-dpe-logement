import {
	TypeVentilation,
	TypeVentilationNaturelle,
	TypeVentilationMecanique,
	TypeVentilationHybride,
} from "./enums.js";

import {
	Installation,
	InstallationBase,
	InstallationNaturelle,
	InstallationMecanique,
	InstallationVMCDoubleFlux,
	InstallationPuitClimatique,
	InstallationMecaniqueAutres,
} from "./types.js";

export function isInstallation(value: InstallationBase): value is Installation {
	return isVentilationNaturelle(value) || isVentilationMecanique(value);
}

export function isVentilationNaturelle(
	value: InstallationBase,
): value is InstallationNaturelle {
	return isTypeVentilationNaturelle(value.type);
}

export function isVentilationMecanique(
	value: InstallationBase,
): value is InstallationMecanique {
	return (
		isVentilationVMCDoubleFlux(value) ||
		isVentilationPuitClimatique(value) ||
		isVentilationMecaniqueAutres(value)
	);
}

export function isVentilationVMCDoubleFlux(
	value: InstallationBase,
): value is InstallationVMCDoubleFlux {
	return value.type === TypeVentilation.enum.vmc_double_flux;
}

export function isVentilationPuitClimatique(
	value: InstallationBase,
): value is InstallationPuitClimatique {
	return value.type === TypeVentilation.enum.puit_climatique;
}

export function isVentilationMecaniqueAutres(
	value: InstallationBase,
): value is InstallationMecaniqueAutres {
	return (
		isTypeVentilationMecanique(value.type) &&
		value.type !== TypeVentilation.enum.vmc_double_flux &&
		value.type !== TypeVentilation.enum.puit_climatique
	);
}

export function isTypeVentilationNaturelle(
	value: TypeVentilation,
): value is TypeVentilationNaturelle {
	return (
		value === TypeVentilation.enum.ventilation_ouverture_fenetres ||
		value === TypeVentilation.enum.ventilation_entrees_air_hautes_basses ||
		value ===
			TypeVentilation.enum
				.ventilation_naturelle_conduit_entrees_air_hygroreglables ||
		value === TypeVentilation.enum.ventilation_naturelle_conduit
	);
}

export function isTypeVentilationMecanique(
	value: TypeVentilation,
): value is TypeVentilationMecanique {
	return !isTypeVentilationNaturelle(value);
}

export function isTypeVentilationHybride(
	value: TypeVentilation,
): value is TypeVentilationHybride {
	return (
		value === TypeVentilation.enum.ventilation_hybride ||
		value ===
			TypeVentilation.enum.ventilation_hybride_entrees_air_hygroreglables
	);
}
