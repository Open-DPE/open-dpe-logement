import { enveloppe } from "@open-dpe-logement/models";
import {
	mapPosition as mapPositionParoi,
	mapParoiId,
} from "./paroi/position.js";
import type { Input, Porte } from "./types.js";
import { MappingError } from "../../errors.js";
import { mapBoolean } from "../common.js";

export type PorteProps = {
	paroi: Porte;
	input: Input;
};

export function mapPorte(props: PorteProps): enveloppe.porte.Porte {
	return {
		id: props.paroi.donnee_entree.reference,
		description: props.paroi.donnee_entree.description ?? "Non renseigné",
		isolation: mapIsolation(props.paroi),
		materiau: mapMateriau(props.paroi),
		annee_installation: null,
		u: mapU(props.paroi),
		position: mapPosition(props),
		menuiserie: mapMenuiserie(props.paroi),
		vitrage: mapVitrage(props),
	};
}

export function mapPosition(props: PorteProps): enveloppe.porte.Position {
	return {
		...mapPositionParoi(props),
		paroi_id: mapParoiId(props),
		type_pose: mapTypePose(props.paroi),
		presence_sas: mapPresenceSas(props.paroi),
	};
}

export function mapVitrage(props: PorteProps): enveloppe.porte.Vitrage | null {
	const surface = mapSurfaceVitrage(props);
	return surface ? { surface, type: mapTypeVitrage(props.paroi) } : null;
}

export function mapMenuiserie(props: Porte): enveloppe.porte.Menuiserie {
	return {
		largeur_dormant: mapLargeurDormant(props),
		presence_joint: mapPresenceJoint(props),
		presence_retour_isolation: mapPresenceRetourIsolation(props),
	};
}

export function mapLargeurDormant(props: Porte): number | null {
	return props.donnee_entree.largeur_dormant
		? props.donnee_entree.largeur_dormant * 10
		: null;
}

export function mapPresenceJoint(props: Porte): boolean | null {
	return "presence_joint" in props.donnee_entree
		? mapBoolean(props.donnee_entree.presence_joint)
		: null;
}

export function mapPresenceRetourIsolation(props: Porte): boolean | null {
	return mapBoolean(props.donnee_entree.presence_retour_isolation);
}

export function mapTypePose(props: Porte): enveloppe.common.TypePose {
	switch (props.donnee_entree.enum_type_pose_id) {
		case 1:
			return enveloppe.common.TypePoseEnum.nu_exterieur;
		case 2:
			return enveloppe.common.TypePoseEnum.nu_interieur;
		case 3:
			return enveloppe.common.TypePoseEnum.tunnel;
		default:
			throw new MappingError("enum_type_pose_id", props);
	}
}

export function mapMateriau(props: Porte): enveloppe.porte.Materiau | null {
	switch (props.donnee_entree.enum_type_porte_id) {
		case 1:
		case 2:
		case 3:
		case 4:
			return enveloppe.porte.MateriauEnum.bois;

		case 5:
		case 6:
		case 7:
		case 8:
			return enveloppe.porte.MateriauEnum.pvc;

		case 9:
		case 10:
		case 11:
		case 12:
			return enveloppe.porte.MateriauEnum.metal;

		default:
			return null;
	}
}

export function mapIsolation(props: Porte): boolean | null {
	switch (props.donnee_entree.enum_type_porte_id) {
		case 13:
		case 15:
			return true;
		default:
			return false;
	}
}

export function mapU(props: Porte): number | null {
	return props.donnee_entree.uporte_saisi || null;
}

export function mapPresenceSas(props: Porte): boolean {
	switch (props.donnee_entree.enum_type_porte_id) {
		case 14:
			return true;
		default:
			return false;
	}
}

export function mapTypeVitrage(
	props: Porte,
): enveloppe.porte.TypeVitrage | null {
	switch (props.donnee_entree.enum_type_porte_id) {
		case 2:
		case 3:
		case 6:
		case 7:
		case 10:
		case 11:
			return enveloppe.porte.TypeVitrageEnum.simple_vitrage;

		case 4:
		case 8:
		case 12:
		case 15:
			return enveloppe.porte.TypeVitrageEnum.double_vitrage;

		default:
			return null;
	}
}

export function mapSurfaceVitrage(props: PorteProps): number {
	const { paroi } = props;
	const { surface } = mapPosition(props);

	switch (paroi.donnee_entree.enum_type_porte_id) {
		case 2:
		case 6:
		case 10:
			return 0.15 * surface;

		case 3:
		case 7:
		case 11:
			return 0.45 * surface;

		case 4:
		case 8:
		case 12:
		case 15:
			return 0.3 * surface;

		default:
			return 0;
	}
}
