import { common, refroidissement } from "@open-dpe-logement/models";
import type { Climatisation } from "./types.js";
import { MappingError } from "../errors.js";
import { resolveId } from "../common.js";

type Props = Climatisation;

export function mapGenerateur(
	props: Props,
): refroidissement.generateur.Generateur {
	const value: refroidissement.generateur.GenerateurBase = {
		id: mapID(props),
		description: mapDescription(props),
		type: mapType(props),
		energie: mapEnergie(props),
		annee_installation: mapAnneeInstallation(props),
		seer: mapSeer(props),
		reseau_froid_id: null,
	};

	if (!refroidissement.generateur.isGenerateur(value))
		throw new MappingError("refroidissement.generateur.type", props);

	return value;
}

export function mapID(
	props: Props,
): refroidissement.generateur.Generateur["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: Props,
): refroidissement.generateur.Generateur["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapType(
	props: Props,
): refroidissement.generateur.TypeGenerateurEnum {
	switch (props.donnee_entree.enum_type_generateur_fr_id) {
		case "1":
		case "2":
		case "3":
			return refroidissement.generateur.TYPES_GENERATEUR.pac_air_air;

		case "4":
		case "5":
		case "6":
		case "7":
			return refroidissement.generateur.TYPES_GENERATEUR.pac_air_eau;

		case "8":
		case "9":
		case "10":
		case "11":
			return refroidissement.generateur.TYPES_GENERATEUR.pac_eau_eau;

		case "12":
		case "13":
		case "14":
		case "15":
			return refroidissement.generateur.TYPES_GENERATEUR.pac_eau_glycolee_eau;

		case "16":
		case "17":
		case "18":
		case "19":
			return refroidissement.generateur.TYPES_GENERATEUR.pac_geothermique;

		case "20":
		case "21":
			return refroidissement.generateur.TYPES_GENERATEUR
				.autre_systeme_thermodynamique;

		case "22":
			return refroidissement.generateur.TYPES_GENERATEUR.autre;

		case "23":
			return refroidissement.generateur.TYPES_GENERATEUR.reseau_froid;

		default:
			throw new MappingError("refroidissement.generateur.type", props);
	}
}

export function mapEnergie(
	props: Props,
): refroidissement.generateur.EnergieRefroidissementEnum {
	switch (props.donnee_entree.enum_type_energie_id) {
		case "1":
		case "12":
			return common.ENERGIES.electricite;
		case "2":
			return common.ENERGIES.gaz_naturel;
		case "9":
		case "10":
		case "13":
			return common.ENERGIES.gpl;
		case "15":
			return common.ENERGIES.reseau_froid;
	}

	switch (props.donnee_entree.enum_type_generateur_fr_id) {
		case "21":
			return common.ENERGIES.gaz_naturel;
		case "23":
			return common.ENERGIES.reseau_froid;
		default:
			return common.ENERGIES.electricite;
	}
}

export function mapAnneeInstallation(props: Props): number | null {
	switch (props.donnee_entree.enum_periode_installation_fr_id) {
		case "1":
			return 2007;
		case "2":
			return 2014;
		case "3":
			return 2016;
		default:
			return null;
	}
}

export function mapSeer(climatisation: Props): number | null {
	switch (climatisation.donnee_entree.enum_methode_saisie_carac_sys_id) {
		case "6":
		case "8":
			return climatisation.donnee_intermediaire.eer
				? climatisation.donnee_intermediaire.eer / 0.95
				: null;
		default:
			return null;
	}
}
