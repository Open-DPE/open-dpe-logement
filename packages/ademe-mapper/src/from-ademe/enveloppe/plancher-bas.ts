import { enveloppe } from "@open-dpe-logement/models";
import { MappingError } from "../errors.js";
import { mapIsolation } from "./paroi/isolation.js";
import type { Input, PlancherBas } from "./types.js";
import {
	mapPosition as mapPositionParoi,
	mapMitoyennete,
} from "./paroi/position.js";
import { resolveId } from "../common.js";

export type PlancherBasProps = {
	paroi: PlancherBas;
	input: Input;
};

const TYPES_PLANCHER_BAS = enveloppe.plancherBas.TYPES_PLANCHER_BAS;
const INERTIES = enveloppe.common.INERTIES;

export function mapPlancherBas(
	props: PlancherBasProps,
): enveloppe.plancherBas.PlancherBas {
	return {
		id: mapId(props.paroi),
		description: mapDescription(props.paroi),
		type: mapType(props.paroi),
		u: mapU(props.paroi),
		u0: mapU0(props.paroi),
		inertie: mapInertie(props.paroi),
		annee_construction: null,
		annee_renovation: null,
		position: mapPosition(props),
		isolation: mapIsolation(props),
	};
}

export function mapPosition(
	props: PlancherBasProps,
): enveloppe.plancherBas.Position {
	const value: enveloppe.plancherBas.PositionBase = {
		...mapPositionParoi(props),
		surface_ue: mapSurfaceUe(props.paroi),
		perimetre_ue: mapPerimetreUe(props.paroi),
	};

	if (enveloppe.plancherBas.isPositionTerrePlein(value)) {
		value.local_non_chauffe_id = null;
	} else if (enveloppe.plancherBas.isPositionAutres(value)) {
		value.surface_ue = null;
		value.perimetre_ue = null;
	} else {
		throw new MappingError("position", props.paroi);
	}

	// `models` n'exporte pas de garde composite pour `Position` (croisement
	// mitoyennete x surface_ue/perimetre_ue) : l'axe mitoyennete est déjà
	// validé par `mapPositionParoi` (partagé avec les autres parois).
	return value as enveloppe.plancherBas.Position;
}

export function mapId(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapType(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["type"] {
	switch (props.donnee_entree.enum_type_plancher_bas_id) {
		case "1":
			return TYPES_PLANCHER_BAS.plancher_avec_ou_sans_remplissage;
		case "2":
			return TYPES_PLANCHER_BAS.plancher_entre_solives_metalliques;
		case "3":
			return TYPES_PLANCHER_BAS.plancher_entre_solives_bois;
		case "4":
			return TYPES_PLANCHER_BAS.plancher_bois_sur_solives_metalliques;
		case "5":
			return TYPES_PLANCHER_BAS.bardeaux_et_remplissage;
		case "6":
			return TYPES_PLANCHER_BAS.voutains_sur_solives_metalliques;
		case "7":
			return TYPES_PLANCHER_BAS.voutains_briques_ou_moellons;
		case "8":
			return TYPES_PLANCHER_BAS.dalle_beton;
		case "9":
			return TYPES_PLANCHER_BAS.plancher_bois_sur_solives_bois;
		case "10":
			return TYPES_PLANCHER_BAS.plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton;
		case "11":
			return TYPES_PLANCHER_BAS.plancher_entrevous_isolant;
		case "12":
			return TYPES_PLANCHER_BAS.plancher_entrevous_isolant;
		default:
			return null;
	}
}

export function mapU(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["u"] {
	return props.donnee_entree.upb_saisi || null;
}

export function mapU0(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["u0"] {
	return props.donnee_entree.upb0_saisi || null;
}

export function mapInertie(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["inertie"] {
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

export function mapSurfaceUe(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.Position["surface_ue"] {
	const mitoyennete = mapMitoyennete(props);
	switch (mitoyennete) {
		case enveloppe.common.MITOYENNETES.enterre:
		case enveloppe.common.MITOYENNETES.vide_sanitaire:
		case enveloppe.common.MITOYENNETES.terre_plein:
		case enveloppe.common.MITOYENNETES.sous_sol_non_chauffe:
			return (
				props.donnee_entree.surface_ue ||
				props.donnee_entree.surface_paroi_opaque
			);
		default:
			return null;
	}
}

export function mapPerimetreUe(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.Position["perimetre_ue"] {
	const mitoyennete = mapMitoyennete(props);
	switch (mitoyennete) {
		case enveloppe.common.MITOYENNETES.enterre:
		case enveloppe.common.MITOYENNETES.vide_sanitaire:
		case enveloppe.common.MITOYENNETES.terre_plein:
		case enveloppe.common.MITOYENNETES.sous_sol_non_chauffe: {
			if (props.donnee_entree.perimetre_ue)
				return props.donnee_entree.perimetre_ue;

			return props.donnee_entree.surface_ue
				? props.donnee_entree.surface_ue / 4
				: props.donnee_entree.surface_paroi_opaque / 4;
		}

		default:
			return null;
	}
}
