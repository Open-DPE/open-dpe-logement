import { ecs } from "@open-dpe-logement/models";
import type { Input, InstallationEcs, GenerateurEcs } from "./types.js";
import { mapBoolean } from "../common.js";

type Props = {
	input: Input;
	installation: InstallationEcs;
	generateur: GenerateurEcs;
};

export function mapSysteme(props: Props): ecs.systeme.Systeme {
	return {
		id: mapID(props.generateur),
		description: mapDescription(props.generateur),
		generateur_id: mapGenerateurID(props.generateur),
		reseau: mapReseau(props.installation),
	};
}

export function mapID(props: GenerateurEcs): ecs.systeme.Systeme["id"] {
	return props.donnee_entree.reference;
}

export function mapDescription(
	props: GenerateurEcs,
): ecs.systeme.Systeme["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapGenerateurID(
	props: GenerateurEcs,
): ecs.systeme.Systeme["generateur_id"] {
	return props.donnee_entree.reference;
}

export function mapReseau(
	props: InstallationEcs,
): ecs.systeme.Systeme["reseau"] {
	return {
		alimentation_contigue: mapAlimentationContigue(props),
		niveaux_desservis: mapNiveauxDesservis(props),
		isolation: mapIsolation(props),
		bouclage: mapBouclage(props),
	};
}

export function mapAlimentationContigue(
	props: InstallationEcs,
): ecs.systeme.Reseau["alimentation_contigue"] {
	switch (props.donnee_entree.tv_rendement_distribution_ecs_id) {
		case 1:
		case 4:
		case 6:
			return true;
		default:
			return false;
	}
}

export function mapNiveauxDesservis(
	props: InstallationEcs,
): ecs.systeme.Reseau["niveaux_desservis"] {
	return props.donnee_entree.nombre_niveau_installation_ecs > 0
		? props.donnee_entree.nombre_niveau_installation_ecs
		: 1;
}

export function mapIsolation(
	props: InstallationEcs,
): ecs.systeme.Reseau["isolation"] {
	return mapBoolean(props.donnee_entree.reseau_distribution_isole);
}

export function mapBouclage(
	props: InstallationEcs,
): ecs.systeme.Reseau["bouclage"] {
	const Enum = ecs.systeme.BouclageEnum;
	switch (props.donnee_entree.enum_bouclage_reseau_ecs_id) {
		case 1:
			return Enum.non_boucle;
		case 2:
			return Enum.boucle;
		case 3:
			return Enum.trace;
		default:
			return null;
	}
}
