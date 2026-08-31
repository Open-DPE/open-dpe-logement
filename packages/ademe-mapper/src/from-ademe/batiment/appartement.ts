import { batiment } from "@open-dpe-logement/models";
import { createId } from "../common.js";
import type { Input, LogementVisite } from "./types.js";
import { MappingError } from "../errors.js";

type Props = {
	logement_visite: LogementVisite;
	input: Input;
};

export function mapAppartement(props: Props): batiment.appartement.Appartement {
	return {
		id: createId(),
		description: mapDescription(props.logement_visite),
		surface_habitable: mapSurfaceHabitable(props),
		hauteur_sous_plafond: mapHauteurSousPlafond(props),
		position: mapPosition(props.logement_visite),
		typologie: mapTypologie(props.logement_visite),
	};
}

export function supports(props: Props): boolean {
	return (
		null != props.logement_visite.surface_habitable_logement &&
		props.logement_visite.surface_habitable_logement > 0
	);
}

export function mapDescription(
	props: Props["logement_visite"],
): batiment.appartement.Appartement["description"] {
	return props.description;
}

export function mapSurfaceHabitable(
	props: Props,
): batiment.appartement.Appartement["surface_habitable"] {
	if (
		props.logement_visite.surface_habitable_logement &&
		props.logement_visite.surface_habitable_logement > 0
	) {
		return props.logement_visite.surface_habitable_logement;
	}
	throw new MappingError(
		"batiment.appartements.surface_habitable",
		props.logement_visite,
	);
}

export function mapHauteurSousPlafond(
	props: Props,
): batiment.appartement.Appartement["hauteur_sous_plafond"] {
	return props.input.logement.caracteristique_generale.hsp;
}

export function mapPosition(
	props: Props["logement_visite"],
): batiment.appartement.Appartement["position"] {
	const PositionAppartement = batiment.appartement.PositionAppartement;
	switch (props.enum_position_etage_logement_id) {
		case "1":
			return PositionAppartement.enum.rdc;
		case "2":
			return PositionAppartement.enum.etage_intermediaire;
		case "3":
			return PositionAppartement.enum.dernier_etage;
	}
}

export function mapTypologie(
	props: Props["logement_visite"],
): batiment.appartement.Appartement["typologie"] {
	const TypologieAppartement = batiment.appartement.TypologieAppartement;
	switch (props.enum_typologie_logement_id) {
		case "1":
			return TypologieAppartement.enum.T1;
		case "2":
			return TypologieAppartement.enum.T2;
		case "3":
			return TypologieAppartement.enum.T3;
		case "4":
			return TypologieAppartement.enum.T4;
		case "5":
			return TypologieAppartement.enum.T5;
		case "6":
			return TypologieAppartement.enum.T6;
		case "7":
			return TypologieAppartement.enum.T7;
	}
}
