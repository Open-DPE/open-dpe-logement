import { chauffage } from "@open-dpe-logement/models";
import type {
	Input,
	EmetteurChauffage,
	GenerateurChauffage,
	InstallationChauffage,
} from "./types.js";
import { MappingError } from "../errors.js";
import { resolveId, toNonEmptyArray } from "../common.js";
import { supports as supportsGenerateur } from "./generateur.js";
import { supports as supportsEmetteur } from "./emetteur.js";

type Props = {
	input: Input;
	generateur: GenerateurChauffage;
	installation: InstallationChauffage;
};

/**
 * @see supports
 */
export function mapSysteme(props: Props): chauffage.systeme.Systeme | null {
	if (!supportsGenerateur(props.generateur)) return null;

	const value: chauffage.systeme.SystemeBase = {
		id: mapID(props.generateur),
		description: mapDescription(props.generateur),
		type: mapType(props),
		generateur_id: mapGenerateurID(props.generateur),
		reseau: reseau.mapReseau(props),
	};

	if (chauffage.systeme.isSystemeCentral(value)) {
		return value;
	} else if (chauffage.systeme.isSystemeDivise(value)) {
		value.reseau = null;
		return value;
	} else {
		throw new MappingError("chauffage.systeme", props.generateur);
	}
}

export function mapID(props: GenerateurChauffage): string {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(props: GenerateurChauffage): string {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapType(props: Props): chauffage.TypeChauffage {
	return reseau.mapTypeDistribution(props)
		? chauffage.TypeChauffage.enum.central
		: chauffage.TypeChauffage.enum.divise;
}

export function mapGenerateurID(props: GenerateurChauffage): string {
	return resolveId(props.donnee_entree.reference);
}

export namespace reseau {
	export function mapReseau(props: Props): chauffage.systeme.Reseau | null {
		const type_distribution = mapTypeDistribution(props);

		if (type_distribution === null) return null;

		const value: chauffage.systeme.ReseauBase = {
			type_distribution,
			presence_fluide_frigorigene: mapPresenceFluideFrigorigene(props),
			presence_circulateur_externe: mapPresenceCirculateurExterne(
				props.installation,
			),
			temperature_distribution: mapTemperatureDistribution(props),
			niveaux_desservis: mapNiveauxDesservis(props.installation),
			isolation: mapIsolation(props),
			emetteurs: [],
		};

		if (chauffage.systeme.isReseauHydraulique(value)) {
			value.emetteurs = toNonEmptyArray(mapEmetteurs(props));
		} else if (chauffage.systeme.isReseauAeraulique(value)) {
			value.temperature_distribution = null;
			value.emetteurs = [];
		} else {
			throw new MappingError("chauffage.systeme.reseau", props.generateur);
		}

		return value;
	}

	export function mapTypeDistribution(
		props: Props,
	): chauffage.systeme.TypeDistribution | null {
		for (const emetteur of fetchEmetteurs(props)) {
			switch (emetteur.donnee_entree.enum_type_emission_distribution_id) {
				case "11":
				case "12":
				case "13":
				case "14":
				case "15":
				case "16":
				case "17":
				case "18":
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
				case "43":
				case "44":
				case "45":
					return chauffage.systeme.TypeDistribution.enum.hydraulique;

				case "5":
				case "42":
				case "46":
				case "47":
				case "48":
				case "49":
					return chauffage.systeme.TypeDistribution.enum.aeraulique;

				default:
					continue;
			}
		}
		return null;
	}

	export function mapPresenceFluideFrigorigene(props: Props): boolean {
		for (const emetteur of fetchEmetteurs(props)) {
			switch (emetteur.donnee_entree.enum_type_emission_distribution_id) {
				case "42":
				case "43":
				case "44":
				case "45":
					return true;
				default:
					continue;
			}
		}
		return false;
	}

	export function mapPresenceCirculateurExterne(
		props: InstallationChauffage,
	): boolean {
		switch (props.donnee_entree.enum_type_installation_id) {
			case "1":
				return false;
			case "2":
			case "3":
			case "4":
				return true;
		}
	}

	export function mapTemperatureDistribution(
		props: Props,
	): chauffage.emetteur.TemperatureDistribution | null {
		let values = fetchEmetteurs(props)
			.map((emetteur) => emetteur.donnee_entree.enum_temp_distribution_ch_id)
			.filter((value) => value !== null && value !== undefined);

		values = Array.from(new Set(values));

		switch (true) {
			case values.includes("4"):
				return chauffage.emetteur.TemperatureDistribution.enum.haute;
			case values.includes("3"):
				return chauffage.emetteur.TemperatureDistribution.enum.moyenne;
			case values.includes("2"):
				return chauffage.emetteur.TemperatureDistribution.enum.basse;
			default:
				return null;
		}
	}

	export function mapNiveauxDesservis(props: InstallationChauffage): number {
		return props.donnee_entree.nombre_niveau_installation_ch > 0
			? props.donnee_entree.nombre_niveau_installation_ch
			: 1;
	}

	export function mapIsolation(props: Props): boolean | null {
		for (const emetteur of fetchEmetteurs(props)) {
			if (null != emetteur.donnee_entree.reseau_distribution_isole) {
				return emetteur.donnee_entree.reseau_distribution_isole;
			}
		}
		return null;
	}

	export function mapEmetteurs(props: Props): string[] {
		return fetchEmetteurs(props)
			.filter((emetteur) => supportsEmetteur(emetteur))
			.map((emetteur) => resolveId(emetteur.donnee_entree.reference));
	}

	function fetchEmetteurs(props: Props): EmetteurChauffage[] {
		return props.installation.emetteur_chauffage_collection.filter(
			(emetteur) =>
				emetteur.donnee_entree.enum_lien_generateur_emetteur_id ===
				props.generateur.donnee_entree.enum_lien_generateur_emetteur_id,
		);
	}
}
