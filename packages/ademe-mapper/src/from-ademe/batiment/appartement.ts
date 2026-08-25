import { batiment } from "@open-dpe-logement/models";
import { createId } from "../common.js";
import type { Input, LogementVisite } from "./types.js";

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

export function mapDescription(
	props: Props["logement_visite"],
): batiment.appartement.Appartement["description"] {
	return props.description;
}

export function mapSurfaceHabitable(
	props: Props,
): batiment.appartement.Appartement["surface_habitable"] {
	return props.logement_visite.surface_habitable_logement;
}

export function mapHauteurSousPlafond(
	props: Props,
): batiment.appartement.Appartement["hauteur_sous_plafond"] {
	return props.input.logement.caracteristique_generale.hsp;
}

export function mapPosition(
	props: Props["logement_visite"],
): batiment.appartement.Appartement["position"] {
	const PositionEnum = batiment.appartement.PositionEnum;
	switch (props.enum_position_etage_logement_id) {
		case 1:
			return PositionEnum.rdc;
		case 2:
			return PositionEnum.etage_intermediaire;
		case 3:
			return PositionEnum.dernier_etage;
	}
}

export function mapTypologie(
	props: Props["logement_visite"],
): batiment.appartement.Appartement["typologie"] {
	const TypologieEnum = batiment.appartement.TypologieEnum;
	switch (props.enum_typologie_logement_id) {
		case 1:
			return TypologieEnum.T1;
		case 2:
			return TypologieEnum.T2;
		case 3:
			return TypologieEnum.T3;
		case 4:
			return TypologieEnum.T4;
		case 5:
			return TypologieEnum.T5;
		case 6:
			return TypologieEnum.T6;
		case 7:
			return TypologieEnum.T7;
	}
}
