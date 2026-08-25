import { enveloppe } from "@open-dpe-logement/models";
import { mapIsolation } from "./paroi/isolation.js";
import { mapPosition } from "./paroi/position.js";
import type { Input, PlancherHaut } from "./types.js";

export type PlancherHautProps = {
	paroi: PlancherHaut;
	input: Input;
};

const ConfigurationEnum = enveloppe.plancherHaut.ConfigurationEnum;
const TypePlancherHautEnum = enveloppe.plancherHaut.TypePlancherHautEnum;
const InertieEnum = enveloppe.common.InertieEnum;

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
	return props.donnee_entree.reference;
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
		case 8:
		case 11:
		case 16:
			return ConfigurationEnum.terrasse;

		case 12:
		case 13:
			return ConfigurationEnum.rampants;
	}
	switch (props.donnee_entree.enum_type_adjacence_id) {
		case 1:
		case 2:
		case 3:
		case 5:
		case 6:
			return ConfigurationEnum.rampants;
		default:
			return ConfigurationEnum.plancher;
	}
}

export function mapType(
	props: PlancherHautProps["paroi"],
): enveloppe.plancherHaut.PlancherHaut["type"] {
	switch (props.donnee_entree.enum_type_plancher_haut_id) {
		case 1:
			return TypePlancherHautEnum.plafond_avec_ou_sans_remplissage;
		case 2:
			return TypePlancherHautEnum.plafond_entre_solives_metalliques;
		case 3:
			return TypePlancherHautEnum.plafond_entre_solives_bois;
		case 4:
			return TypePlancherHautEnum.plafond_bois_sur_solives_metalliques;
		case 5:
			return TypePlancherHautEnum.plafond_bois_sous_solives_metalliques;
		case 6:
			return TypePlancherHautEnum.bardeaux_et_remplissage;
		case 7:
			return TypePlancherHautEnum.plafond_bois_sur_solives_bois;
		case 8:
			return TypePlancherHautEnum.plafond_bois_sous_solives_bois;
		case 9:
			return TypePlancherHautEnum.dalle_beton;
		case 10:
			return TypePlancherHautEnum.plafond_lourd;
		case 11:
			return TypePlancherHautEnum.combles_amenages_sous_rampant;
		case 12:
			return TypePlancherHautEnum.toiture_chaume;
		case 13:
			return TypePlancherHautEnum.plafond_patre;
		case 14:
			return TypePlancherHautEnum.bac_acier;
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
			case 1:
				return InertieEnum.lourde;
			case 0:
				return InertieEnum.legere;
		}
	}
	return null;
}
