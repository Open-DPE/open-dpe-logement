import { TYPES_CHAUFFAGE } from "../enums.js";
import {
	InstallationBase,
	Installation,
	InstallationChauffageCentralCollectif,
	InstallationChauffageCentralIndividuel,
	InstallationChauffageDivise,
} from "./types.js";

export function isInstallation(value: InstallationBase): value is Installation {
	return (
		isInstallationChauffageCentralCollectif(value) ||
		isInstallationChauffageCentralIndividuel(value) ||
		isInstallationChauffageDivise(value)
	);
}

export function isInstallationChauffageCentralCollectif(
	value: InstallationBase,
): value is InstallationChauffageCentralCollectif {
	return (
		value.type === TYPES_CHAUFFAGE.central &&
		value.installation_collective === true
	);
}

export function isInstallationChauffageCentralIndividuel(
	value: InstallationBase,
): value is InstallationChauffageCentralIndividuel {
	return (
		value.type === TYPES_CHAUFFAGE.central &&
		value.installation_collective === false
	);
}

export function isInstallationChauffageDivise(
	value: InstallationBase,
): value is InstallationChauffageDivise {
	return value.type === TYPES_CHAUFFAGE.divise;
}
