import { enveloppe } from "@open-dpe-logement/models";
import { MappingError } from "../../errors.js";
import { mapIsolation } from "./paroi/isolation.js";
import type { Input, PlancherBas } from "./types.js";
import {
	mapPosition as mapPositionParoi,
	mapMitoyennete,
} from "./paroi/position.js";

export type PlancherBasProps = {
	paroi: PlancherBas;
	input: Input;
};

const TypePlancherBasEnum = enveloppe.plancherBas.TypePlancherBasEnum;
const InertieEnum = enveloppe.common.InertieEnum;

export function mapPlancherBas(
	props: PlancherBasProps,
): enveloppe.plancherBas.PlancherBas {
	return {
		id: mapId(props.paroi),
		description: mapDescription(props.paroi),
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

export function mapPosition(
	props: PlancherBasProps,
): enveloppe.plancherBas.Position {
	const value: enveloppe.plancherBas.PositionBase = {
		...mapPositionParoi(props),
		surface_ue: surfaceUe(props.paroi),
		perimetre_ue: perimetreUe(props.paroi),
	};

	if (!enveloppe.plancherBas.isPosition(value))
		throw new MappingError("position", props.paroi);

	return value;
}

export function mapId(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["id"] {
	return props.donnee_entree.reference;
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
		case 1:
			return TypePlancherBasEnum.plancher_avec_ou_sans_remplissage;
		case 2:
			return TypePlancherBasEnum.plancher_entre_solives_metalliques;
		case 3:
			return TypePlancherBasEnum.plancher_entre_solives_bois;
		case 4:
			return TypePlancherBasEnum.plancher_bois_sur_solives_metalliques;
		case 5:
			return TypePlancherBasEnum.bardeaux_et_remplissage;
		case 6:
			return TypePlancherBasEnum.voutains_sur_solives_metalliques;
		case 7:
			return TypePlancherBasEnum.voutains_briques_ou_moellons;
		case 8:
			return TypePlancherBasEnum.dalle_beton;
		case 9:
			return TypePlancherBasEnum.plancher_bois_sur_solives_bois;
		case 10:
			return TypePlancherBasEnum.plancher_lourd_type_entrevous_terre_cuite_ou_poutrelles_beton;
		case 11:
			return TypePlancherBasEnum.plancher_entrevous_isolant;
		case 12:
			return TypePlancherBasEnum.plancher_entrevous_isolant;
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

export function inertie(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.PlancherBas["inertie"] {
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

export function surfaceUe(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.Position["surface_ue"] {
	const mitoyennete = mapMitoyennete(props);
	switch (mitoyennete) {
		case enveloppe.common.MitoyenneteEnum.exterieur:
		case enveloppe.common.MitoyenneteEnum.local_non_accessible:
		case enveloppe.common.MitoyenneteEnum.local_non_residentiel:
		case enveloppe.common.MitoyenneteEnum.local_residentiel:
			return (
				props.donnee_entree.surface_ue ||
				props.donnee_entree.surface_paroi_opaque
			);
		default:
			return null;
	}
}

export function perimetreUe(
	props: PlancherBasProps["paroi"],
): enveloppe.plancherBas.Position["perimetre_ue"] {
	const mitoyennete = mapMitoyennete(props);
	switch (mitoyennete) {
		case enveloppe.common.MitoyenneteEnum.exterieur:
		case enveloppe.common.MitoyenneteEnum.local_non_accessible:
		case enveloppe.common.MitoyenneteEnum.local_non_residentiel:
		case enveloppe.common.MitoyenneteEnum.local_residentiel: {
			if (props.donnee_entree.perimetre_ue)
				return props.donnee_entree.perimetre_ue;

			if (props.donnee_entree.surface_ue)
				return props.donnee_entree.surface_ue / 4;

			return props.donnee_entree.surface_paroi_opaque / 4;
		}

		default:
			return null;
	}
}
