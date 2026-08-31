import { enveloppe } from "@open-dpe-logement/models";
import {
	mapPosition as mapPositionParoi,
	mapParoiId,
} from "./paroi/position.js";
import type { Input, Porte } from "./types.js";
import { MappingError } from "../errors.js";
import { resolveId } from "../common.js";

export type PorteProps = {
	paroi: Porte;
	input: Input;
};

export function mapPorte(props: PorteProps): enveloppe.porte.Porte {
	return {
		id: resolveId(props.paroi.donnee_entree.reference),
		description: props.paroi.donnee_entree.description ?? "Non renseigné",
		isolation: mapIsolation(props.paroi),
		materiau: mapMateriau(props.paroi),
		annee_installation: null,
		u: mapU(props.paroi),
		position: position.mapPosition(props),
		menuiserie: menuiserie.mapMenuiserie(props.paroi),
		vitrage: vitrage.mapVitrage(props),
	};
}

export namespace position {
	export function mapPosition(props: PorteProps): enveloppe.porte.Position {
		return {
			...mapPositionParoi(props),
			paroi_id: mapParoiId(props),
			type_pose: mapTypePose(props.paroi),
			presence_sas: mapPresenceSas(props.paroi),
		};
	}

	export function mapTypePose(props: Porte): enveloppe.common.TypePose {
		switch (props.donnee_entree.enum_type_pose_id) {
			case "1":
				return enveloppe.common.TypePose.enum.nu_exterieur;
			case "2":
				return enveloppe.common.TypePose.enum.nu_interieur;
			case "3":
				return enveloppe.common.TypePose.enum.tunnel;
			default:
				throw new MappingError("enum_type_pose_id", props);
		}
	}

	export function mapPresenceSas(props: Porte): boolean {
		switch (props.donnee_entree.enum_type_porte_id) {
			case "14":
				return true;
			default:
				return false;
		}
	}
}

export namespace vitrage {
	export function mapVitrage(props: PorteProps): enveloppe.porte.Vitrage {
		const value: enveloppe.porte.VitrageBase = {
			surface: mapSurface(props),
			type: mapType(props.paroi),
		};

		if (enveloppe.porte.isVitrageSansVitrage(value)) value.type = null;

		return value;
	}

	export function mapType(props: Porte): enveloppe.porte.TypeVitrage | null {
		switch (props.donnee_entree.enum_type_porte_id) {
			case "2":
			case "3":
			case "6":
			case "7":
			case "10":
			case "11":
				return enveloppe.porte.TypeVitrage.enum.simple_vitrage;

			case "4":
			case "8":
			case "12":
			case "15":
				return enveloppe.porte.TypeVitrage.enum.double_vitrage;

			default:
				return null;
		}
	}

	export function mapSurface(props: PorteProps): number {
		const { paroi } = props;
		const { surface } = position.mapPosition(props);

		switch (paroi.donnee_entree.enum_type_porte_id) {
			case "2":
			case "6":
			case "10":
				return 0.15 * surface;

			case "3":
			case "7":
			case "11":
				return 0.45 * surface;

			case "4":
			case "8":
			case "12":
			case "15":
				return 0.3 * surface;

			default:
				return 0;
		}
	}
}

export namespace menuiserie {
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
			? (props.donnee_entree.presence_joint ?? null)
			: null;
	}

	export function mapPresenceRetourIsolation(props: Porte): boolean | null {
		return props.donnee_entree.presence_retour_isolation ?? null;
	}
}

export function mapMateriau(
	props: Porte,
): enveloppe.porte.MateriauPorte | null {
	switch (props.donnee_entree.enum_type_porte_id) {
		case "1":
		case "2":
		case "3":
		case "4":
			return enveloppe.porte.MateriauPorte.enum.bois;

		case "5":
		case "6":
		case "7":
		case "8":
			return enveloppe.porte.MateriauPorte.enum.pvc;

		case "9":
		case "10":
		case "11":
		case "12":
			return enveloppe.porte.MateriauPorte.enum.metal;

		default:
			return null;
	}
}

export function mapIsolation(props: Porte): boolean | null {
	switch (props.donnee_entree.enum_type_porte_id) {
		case "13":
		case "15":
			return true;
		default:
			return false;
	}
}

export function mapU(props: Porte): number | null {
	return props.donnee_entree.uporte_saisi || null;
}
