import { enveloppe } from "@open-dpe-logement/models";
import { mapIsolation } from "./paroi/isolation.js";
import { mapPosition } from "./paroi/position.js";
import type { Input, PlancherHaut } from "./types.js";
import { resolveId } from "../common.js";

export type PlancherHautProps = {
	paroi: PlancherHaut;
	input: Input;
};

const CONFIGURATIONS = enveloppe.plancherHaut.CONFIGURATIONS;
const TYPES_PLANCHER_HAUT = enveloppe.plancherHaut.TYPES_PLANCHER_HAUT;
const INERTIES = enveloppe.common.INERTIES;

export function mapPlancherHaut(
	props: PlancherHautProps,
): enveloppe.plancherHaut.PlancherHaut {
	return {
		id: mapId(props.paroi),
		description: mapDescription(props.paroi),
		configuration: mapConfiguration(props.paroi),
		type: mapType(props.paroi),
		u: mapU(props.paroi),
		u0: mapU0(props.paroi),
		inertie: inertie(props.paroi),
		annee_construction: null,
		annee_renovation: null,
		position: mapPosition(props),
		isolation: mapIsolation(props),
	};
}

export function mapId(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapConfiguration(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["configuration"] {
	switch (props.donnee_entree.enum_type_plancher_haut_id) {
		case "8":
		case "11":
		case "16":
			return CONFIGURATIONS.terrasse;

		case "12":
		case "13":
			return CONFIGURATIONS.rampants;
	}
	switch (props.donnee_entree.enum_type_adjacence_id) {
		case "1":
		case "2":
		case "3":
		case "5":
		case "6":
			return CONFIGURATIONS.rampants;
		default:
			return CONFIGURATIONS.plancher;
	}
}

export function mapType(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["type"] {
	switch (props.donnee_entree.enum_type_plancher_haut_id) {
		case "1":
			return TYPES_PLANCHER_HAUT.plafond_avec_ou_sans_remplissage;
		case "2":
			return TYPES_PLANCHER_HAUT.plafond_entre_solives_metalliques;
		case "3":
			return TYPES_PLANCHER_HAUT.plafond_entre_solives_bois;
		case "4":
			return TYPES_PLANCHER_HAUT.plafond_bois_sur_solives_metalliques;
		case "5":
			return TYPES_PLANCHER_HAUT.plafond_bois_sous_solives_metalliques;
		case "6":
			return TYPES_PLANCHER_HAUT.bardeaux_et_remplissage;
		case "7":
			return TYPES_PLANCHER_HAUT.plafond_bois_sur_solives_bois;
		case "8":
			return TYPES_PLANCHER_HAUT.plafond_bois_sous_solives_bois;
		case "9":
			return TYPES_PLANCHER_HAUT.dalle_beton;
		case "10":
			return TYPES_PLANCHER_HAUT.plafond_lourd;
		case "11":
			return TYPES_PLANCHER_HAUT.combles_amenages_sous_rampant;
		case "12":
			return TYPES_PLANCHER_HAUT.toiture_chaume;
		case "13":
			return TYPES_PLANCHER_HAUT.plafond_patre;
		case "14":
			return TYPES_PLANCHER_HAUT.bac_acier;
		default:
			return null;
	}
}

export function mapU(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["u"] {
	return props.donnee_entree.uph_saisi || null;
}

export function mapU0(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["u0"] {
	return props.donnee_entree.uph0_saisi || null;
}

export function inertie(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["inertie"] {
	if ("paroi_lourde" in props.donnee_entree) {
		switch (props.donnee_entree.paroi_lourde) {
			case true:
				return INERTIES.lourde;
			case false:
				return INERTIES.legere;
		}
	}
	return null;
}
