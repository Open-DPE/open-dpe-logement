import { ecs } from "@open-dpe-logement/models";
import type { Input, InstallationEcs } from "./types.js";
import {
	mapAnneeEtablissement,
	resolveId,
	toNonEmptyArray,
} from "../common.js";
import * as systeme from "./systeme.js";

export { systeme };

type Props = {
	input: Input;
	installation: InstallationEcs;
};

export function mapInstallation(props: Props): ecs.installation.Installation {
	return {
		id: mapID(props.installation),
		description: mapDescription(props.installation),
		surface: mapSurface(props.installation),
		systemes: mapSystemes(props),
		installation_collective: mapInstallationCollective(props.installation),
		solaire_thermique: mapSolaireThermique(props),
	};
}

export function mapID(
	props: InstallationEcs,
): ecs.installation.Installation["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: InstallationEcs,
): ecs.installation.Installation["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapSurface(
	props: InstallationEcs,
): ecs.installation.Installation["surface"] {
	return props.donnee_entree.surface_habitable;
}

export function mapInstallationCollective(
	props: InstallationEcs,
): ecs.installation.Installation["installation_collective"] {
	switch (props.donnee_entree.enum_type_installation_id) {
		case "2":
		case "3":
		case "4":
			return true;
		default:
			return false;
	}
}

export function mapSystemes(
	props: Props,
): ecs.installation.Installation["systemes"] {
	const systemes = props.installation.generateur_ecs_collection.map((item) =>
		systeme.mapSysteme({
			input: props.input,
			installation: props.installation,
			generateur: item,
		}),
	);

	return toNonEmptyArray(systemes);
}

export function mapSolaireThermique(
	props: Props,
): ecs.installation.SolaireThermique | null {
	const usage = mapUsageSolaire(props.installation);
	if (!usage) return null;

	return {
		usage,
		annee_installation: mapAnneeInstallationSolaire(props),
		fecs: mapFecs(props.installation),
	};
}

export function mapUsageSolaire(
	props: InstallationEcs,
): ecs.installation.SolaireThermique["usage"] | null {
	const Enum = ecs.installation.UsageSolaire.enum;
	switch (props.donnee_entree.enum_type_installation_solaire_id) {
		case "2":
		case "3":
			return Enum.ecs;
		case "4":
			return Enum.chauffage_ecs;
		default:
			return null;
	}
}

export function mapAnneeInstallationSolaire(
	props: Props,
): ecs.installation.SolaireThermique["annee_installation"] | null {
	switch (props.installation.donnee_entree.enum_type_installation_solaire_id) {
		case "3":
			return mapAnneeEtablissement(props.input);
		default:
			return null;
	}
}

export function mapFecs(
	props: InstallationEcs,
): ecs.installation.SolaireThermique["fecs"] | null {
	return props.donnee_entree.fecs_saisi || null;
}
