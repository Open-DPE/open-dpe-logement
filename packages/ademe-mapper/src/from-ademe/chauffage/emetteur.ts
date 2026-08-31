import { chauffage } from "@open-dpe-logement/models";
import type {
	Input,
	InstallationChauffage,
	EmetteurChauffage,
} from "./types.js";
import { mapAnneeEtablissement, resolveId } from "../common.js";
import { MappingError } from "../errors.js";

type Props = {
	input: Input;
	installation: InstallationChauffage;
	emetteur: EmetteurChauffage;
};

/**
 * Retourne `null` si l'émetteur d'origine est un émetteur direct ou un émetteur d'air chaud
 */
export function mapEmetteur(props: Props): chauffage.emetteur.Emetteur | null {
	if (!supports(props.emetteur)) return null;

	return {
		id: mapID(props.emetteur),
		description: mapDescription(props.emetteur),
		type: mapType(props.emetteur),
		temperature_distribution: mapTemperatureDistribution(props.emetteur),
		presence_robinet_thermostatique: mapPresenceRobinetThermostatique(
			props.emetteur,
		),
		annee_installation: mapAnneeInstallation(props),
	};
}

export function supports(props: EmetteurChauffage): boolean {
	switch (props.donnee_entree.enum_type_emission_distribution_id) {
		case "11":
		case "12":
		case "13":
		case "14":
		case "43":
		case "15":
		case "16":
		case "17":
		case "18":
		case "44":
		case "24":
		case "25":
		case "26":
		case "27":
		case "28":
		case "29":
		case "30":
		case "31":
		case "32":
		case "33":
		case "34":
		case "35":
		case "36":
		case "37":
		case "38":
		case "39":
		case "41":
		case "45":
			return true;
		default:
			return false;
	}
}

export function mapID(
	props: EmetteurChauffage,
): chauffage.emetteur.Emetteur["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: EmetteurChauffage,
): chauffage.emetteur.Emetteur["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapType(
	props: EmetteurChauffage,
): chauffage.emetteur.Emetteur["type"] {
	switch (props.donnee_entree.enum_type_emission_distribution_id) {
		case "11":
		case "12":
		case "13":
		case "14":
		case "43":
			return chauffage.emetteur.TypeEmetteur.enum.plancher_chauffant;
		case "15":
		case "16":
		case "17":
		case "18":
		case "44":
			return chauffage.emetteur.TypeEmetteur.enum.plafond_chauffant;
		case "24":
		case "25":
		case "26":
		case "27":
		case "28":
		case "29":
		case "30":
		case "31":
			return chauffage.emetteur.TypeEmetteur.enum.radiateur_monotube;
		case "32":
		case "33":
		case "34":
		case "35":
		case "36":
		case "37":
		case "38":
		case "39":
			return chauffage.emetteur.TypeEmetteur.enum.radiateur_bitube;
		case "41":
		case "45":
			return chauffage.emetteur.TypeEmetteur.enum.radiateur;

		default:
			throw new MappingError("chauffage.emetteur.type", props);
	}
}

export function mapTemperatureDistribution(
	props: EmetteurChauffage,
): chauffage.emetteur.Emetteur["temperature_distribution"] {
	switch (props.donnee_entree.enum_temp_distribution_ch_id) {
		case "2":
			return chauffage.emetteur.TemperatureDistribution.enum.basse;
		case "3":
			return chauffage.emetteur.TemperatureDistribution.enum.moyenne;
		case "4":
			return chauffage.emetteur.TemperatureDistribution.enum.haute;
	}

	switch (props.donnee_entree.enum_type_emission_distribution_id) {
		case "12":
		case "14":
		case "16":
		case "18":
		case "25":
		case "27":
		case "29":
		case "31":
		case "33":
		case "35":
		case "37":
		case "39":
			return chauffage.emetteur.TemperatureDistribution.enum.moyenne;
		case "11":
		case "13":
		case "15":
		case "17":
		case "24":
		case "26":
		case "28":
		case "30":
		case "32":
		case "34":
		case "36":
		case "38":
			return chauffage.emetteur.TemperatureDistribution.enum.haute;
		default:
			return null;
	}
}

export function mapPresenceRobinetThermostatique(
	props: EmetteurChauffage,
): chauffage.emetteur.Emetteur["presence_robinet_thermostatique"] {
	switch (props.donnee_entree.enum_type_emission_distribution_id) {
		case "28":
		case "29":
		case "30":
		case "31":
		case "36":
		case "37":
		case "38":
		case "39":
			return true;
		case "24":
		case "25":
		case "26":
		case "27":
		case "32":
		case "33":
		case "34":
		case "35":
			return false;
		default:
			return false;
	}
}

export function mapAnneeInstallation(
	props: Props,
): chauffage.emetteur.Emetteur["annee_installation"] {
	switch (props.emetteur.donnee_entree.enum_periode_installation_emetteur_id) {
		case "1":
			return 1980;
		case "2":
			return 2000;
		case "3":
			return mapAnneeEtablissement(props.input);
		default:
			return null;
	}
}
