import { chauffage } from "@open-dpe-logement/models";
import type {
	Input,
	EmetteurChauffage,
	GenerateurChauffage,
	InstallationChauffage,
} from "./types.js";
import * as systeme from "./systeme.js";
import { mapNonEmptyArray, resolveId } from "../common.js";
import { MappingError } from "../errors.js";

type Props = {
	input: Input;
	installation: InstallationChauffage;
};

export function mapInstallation(
	props: Props,
): chauffage.installation.Installation {
	const value: chauffage.installation.InstallationBase = {
		id: mapID(props.installation),
		description: mapDescription(props.installation),
		surface: mapSurface(props.installation),
		type: mapType(props),
		installation_collective: mapInstallationCollective(props.installation),
		comptage_individuel: null,
		regulation_terminale: null,
		programmation: mapProgrammation(props.installation),
		solaire_thermique: mapSolaireThermique(props.installation),
		systemes: mapNonEmptyArray(
			mapSystemes(props),
			"chauffage.installation.systemes",
			props,
		),
	};

	if (chauffage.installation.isInstallationChauffageCentralCollectif(value)) {
		value.comptage_individuel = mapComptageIndividuel(props.installation);
		value.regulation_terminale = mapRegulationTerminale(props.installation);
	}
	if (chauffage.installation.isInstallationChauffageCentralIndividuel(value)) {
		value.regulation_terminale = mapRegulationTerminale(props.installation);
	}
	if (chauffage.installation.isInstallationChauffageDivise(value)) {
		value.installation_collective = false;
	}

	if (!chauffage.installation.isInstallation(value))
		throw new MappingError("chauffage.installation", props);

	return value;
}

export function mapID(props: InstallationChauffage): string {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(props: InstallationChauffage): string {
	return props.donnee_entree.description ?? "Non renseigné";
}

/**
 * Déduction de la surface chauffée de l'éventuelle installation d'appoint électrique dans la salle de bain.
 */
export function mapSurface(props: InstallationChauffage): number {
	return props.donnee_entree.surface_chauffee - salleDeBain.mapSurface(props);
}

export function mapType(props: Props): chauffage.TypeChauffage {
	for (const s of mapSystemes(props)) {
		if (s.type === chauffage.TypeChauffage.enum.central) {
			return chauffage.TypeChauffage.enum.central;
		}
	}
	return chauffage.TypeChauffage.enum.divise;
}

export function mapInstallationCollective(
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

export function mapComptageIndividuel(props: InstallationChauffage): boolean {
	return fetchEmetteurs(props).some((emetteur) => {
		switch (emetteur.donnee_entree.tv_intermittence_id) {
			case 170:
			case 171:
			case 172:
			case 173:
			case 174:
			case 175:
			case 176:
			case 177:
			case 178:
			case 179:
			case 180:
			case 181:
			case 182:
			case 183:
			case 184:
			case 185:
			case 186:
			case 187:
			case 188:
				return true;
			default:
				return false;
		}
	});
}

export function mapRegulationTerminale(props: InstallationChauffage): boolean {
	return fetchEmetteurs(props).some(
		(emetteur) => emetteur.donnee_entree.enum_type_regulation_id === "2",
	);
}

export function mapProgrammation(
	props: InstallationChauffage,
): chauffage.installation.TypeProgrammation {
	const TypeProgrammation = chauffage.installation.TypeProgrammation;
	const emetteur = fetchEmetteurs(props)[0];
	if (!emetteur) return TypeProgrammation.enum.absent;

	switch (emetteur.donnee_entree.enum_equipement_intermittence_id) {
		case "1":
			return TypeProgrammation.enum.absent;
		case "2":
			return TypeProgrammation.enum.central_sans_minimum_temperature;
		case "3":
			return TypeProgrammation.enum.central_avec_minimum_temperature;
		case "4":
			return TypeProgrammation.enum.terminal_avec_minimum_temperature;
		case "5":
			return TypeProgrammation.enum
				.terminal_avec_minimum_temperature_detection_presence;
		case "6":
			return TypeProgrammation.enum.central_collectif_sans_detection_presence;
		case "7":
			return TypeProgrammation.enum.central_collectif_avec_detection_presence;
		default:
			return TypeProgrammation.enum.absent;
	}
}

export function mapSolaireThermique(
	props: InstallationChauffage,
): chauffage.installation.SolaireThermique | null {
	const usage = mapUsageSolaire(props);
	if (usage === null) return null;

	return {
		usage,
		annee_installation: null,
		fch: mapFch(props),
	};
}

export function mapUsageSolaire(
	props: InstallationChauffage,
): chauffage.installation.UsageSolaire | null {
	switch (props.donnee_entree.enum_cfg_installation_ch_id) {
		case "2":
		case "7":
			return chauffage.installation.UsageSolaire.enum.chauffage;
		default:
			return null;
	}
}

export function mapFch(props: InstallationChauffage): number | null {
	return props.donnee_entree.fch_saisi || null;
}

export function mapSystemes(props: Props): chauffage.systeme.Systeme[] {
	return fetchGenerateurs(props.installation)
		.map((generateur) => systeme.mapSysteme({ ...props, generateur }))
		.filter((systeme) => systeme !== null);
}

function fetchEmetteurs(props: InstallationChauffage): EmetteurChauffage[] {
	return props.emetteur_chauffage_collection.filter(
		(emetteur) =>
			emetteur.donnee_entree.enum_lien_generateur_emetteur_id !== "3",
	);
}

function fetchGenerateurs(props: InstallationChauffage): GenerateurChauffage[] {
	return props.generateur_chauffage_collection.filter(
		(generateur) =>
			generateur.donnee_entree.enum_lien_generateur_emetteur_id !== "3",
	);
}

/**
 * Reconstitution des installations appoints électrique dans la salle de bain.
 */
export namespace salleDeBain {
	export function mapInstallation(
		props: Props,
	): chauffage.installation.Installation | null {
		if (fetchEmetteurs(props.installation).length === 0) return null;

		return {
			id: mapID(props.installation),
			description: "Salle de bain",
			surface: mapSurface(props.installation),
			type: chauffage.TypeChauffage.enum.divise,
			installation_collective: false,
			comptage_individuel: null,
			regulation_terminale: null,
			// Installation reconstituée toujours "divise" : programmation
			// restreinte à son sous-ensemble (pas de variantes collectives).
			programmation: mapProgrammation(
				props.installation,
			) as chauffage.installation.InstallationChauffageDivise["programmation"],
			solaire_thermique: null,
			systemes: mapNonEmptyArray(
				mapSystemes(props),
				"chauffage.installation.systemes",
				props,
			),
		};
	}

	export function mapID(props: InstallationChauffage): string {
		return resolveId(`sdb:${props.donnee_entree.reference}`);
	}

	export function mapSurface(props: InstallationChauffage): number {
		const max = 0.1 * props.donnee_entree.surface_chauffee;
		const value = fetchEmetteurs(props).reduce(
			(acc, emetteur) => acc + emetteur.donnee_entree.surface_chauffee,
			0,
		);
		return value ? Math.min(value, max) : max;
	}

	export function mapSystemes(props: Props): chauffage.systeme.Systeme[] {
		return fetchGenerateurs(props.installation)
			.map((generateur) => systeme.mapSysteme({ ...props, generateur }))
			.filter(
				(systeme): systeme is chauffage.systeme.Systeme => systeme !== null,
			);
	}

	export function mapProgrammation(
		props: InstallationChauffage,
	): chauffage.installation.TypeProgrammation {
		const TypeProgrammation = chauffage.installation.TypeProgrammation;
		const emetteur = fetchEmetteurs(props)[0];
		if (!emetteur) return TypeProgrammation.enum.absent;

		switch (emetteur.donnee_entree.enum_equipement_intermittence_id) {
			case "1":
				return TypeProgrammation.enum.absent;
			case "2":
				return TypeProgrammation.enum.central_sans_minimum_temperature;
			case "3":
				return TypeProgrammation.enum.central_avec_minimum_temperature;
			case "4":
				return TypeProgrammation.enum.terminal_avec_minimum_temperature;
			case "5":
				return TypeProgrammation.enum
					.terminal_avec_minimum_temperature_detection_presence;
			default:
				return TypeProgrammation.enum.absent;
		}
	}

	function fetchEmetteurs(props: InstallationChauffage): EmetteurChauffage[] {
		return props.emetteur_chauffage_collection.filter(
			(emetteur) =>
				emetteur.donnee_entree.enum_lien_generateur_emetteur_id === "3",
		);
	}

	function fetchGenerateurs(
		props: InstallationChauffage,
	): GenerateurChauffage[] {
		return props.generateur_chauffage_collection.filter(
			(generateur) =>
				generateur.donnee_entree.enum_lien_generateur_emetteur_id === "3",
		);
	}
}
