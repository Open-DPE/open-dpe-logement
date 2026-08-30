import { ventilation } from "@open-dpe-logement/models";
import { resolveId } from "../common.js";
import type { Input, Ventilation } from "./types.js";
import { MappingError } from "../errors.js";

const TYPES_VENTILATION = ventilation.installation.TYPES_VENTILATION;

export function mapInstallation(props: {
	input: Input;
	ventilation: Ventilation;
}): ventilation.installation.Installation {
	const value: ventilation.installation.InstallationBase = {
		id: mapId(props.ventilation),
		description: mapDescription(props.ventilation),
		surface: mapSurface(props.ventilation),
		type: mapType(props.ventilation),
		annee_installation: mapAnneeInstallation(props),
		installation_collective: mapInstallationCollective(props.ventilation),
		presence_echangeur_thermique: mapPresenceEchangeurThermique(
			props.ventilation,
		),
	};

	if (!ventilation.installation.isInstallation(value))
		throw new MappingError("ventilation.installation.type", props);

	return value;
}

export function mapId(
	props: Ventilation,
): ventilation.installation.Installation["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: Ventilation,
): ventilation.installation.Installation["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapSurface(
	props: Ventilation,
): ventilation.installation.Installation["surface"] {
	return props.donnee_entree.surface_ventile;
}

export function mapType(
	props: Ventilation,
): ventilation.installation.Installation["type"] {
	switch (props.donnee_entree.enum_type_ventilation_id) {
		case "1":
			return TYPES_VENTILATION.ventilation_ouverture_fenetres;
		case "2":
			return TYPES_VENTILATION.ventilation_entrees_air_hautes_basses;
		case "3":
		case "4":
		case "5":
		case "6":
			return TYPES_VENTILATION.vmc_simple_flux_autoreglable;
		case "7":
		case "8":
		case "9":
			return TYPES_VENTILATION.vmc_simple_flux_hygroreglable_a;
		case "10":
		case "11":
		case "12":
			return TYPES_VENTILATION.vmc_simple_flux_hygroreglable_gaz;
		case "13":
		case "14":
		case "15":
			return TYPES_VENTILATION.vmc_simple_flux_hygroreglable_b;
		case "16":
			return TYPES_VENTILATION.vmc_basse_pression_autoreglable;
		case "17":
			return TYPES_VENTILATION.vmc_basse_pression_hygroreglable_a;
		case "18":
			return TYPES_VENTILATION.vmc_basse_pression_hygroreglable_b;
		case "19":
		case "20":
		case "21":
		case "22":
		case "23":
		case "24":
			return TYPES_VENTILATION.vmc_double_flux;
		case "25":
			return TYPES_VENTILATION.ventilation_naturelle_conduit;
		case "26":
		case "27":
		case "28":
			return TYPES_VENTILATION.ventilation_hybride;
		case "29":
		case "30":
		case "31":
			return TYPES_VENTILATION.ventilation_hybride_entrees_air_hygroreglables;
		case "32":
		case "33":
			return TYPES_VENTILATION.ventilation_mecanique_conduit;
		case "34":
			return TYPES_VENTILATION.ventilation_naturelle_conduit_entrees_air_hygroreglables;
		case "35":
		case "36":
		case "37":
		case "38":
			return TYPES_VENTILATION.puit_climatique;
	}
}

export function mapAnneeInstallation(props: {
	input: Input;
	ventilation: Ventilation;
}): ventilation.installation.Installation["annee_installation"] {
	switch (props.ventilation.donnee_entree.enum_type_ventilation_id) {
		case "3":
			return 1981;

		case "4":
		case "7":
		case "10":
		case "13":
		case "26":
		case "29":
			return 2000;

		case "5":
		case "8":
		case "11":
		case "14":
		case "19":
		case "21":
		case "23":
		case "27":
		case "30":
		case "32":
		case "35":
		case "37":
			return 2012;

		case "6":
		case "9":
		case "12":
		case "15":
		case "20":
		case "22":
		case "24":
		case "28":
		case "31":
		case "33":
		case "36":
		case "38":
			return 2013;

		default:
			return null;
	}
}

export function mapInstallationCollective(
	props: Ventilation,
): ventilation.installation.Installation["installation_collective"] {
	switch (props.donnee_entree.enum_type_ventilation_id) {
		case "1":
		case "2":
		case "25":
		case "34":
			return null;

		case "21":
		case "22":
			return true;

		default:
			return false;
	}
}

export function mapPresenceEchangeurThermique(
	props: Ventilation,
): ventilation.installation.Installation["presence_echangeur_thermique"] {
	switch (props.donnee_entree.enum_type_ventilation_id) {
		case "19":
		case "20":
		case "21":
		case "22":
		case "37":
		case "38":
			return true;

		case "23":
		case "24":
		case "35":
		case "36":
			return false;

		default:
			return null;
	}
}
