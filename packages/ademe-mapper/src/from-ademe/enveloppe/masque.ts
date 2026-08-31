import { enveloppe } from "@open-dpe-logement/models";
import { createId } from "../common.js";
import type { BaieVitree, MasqueLointainNonHomogene } from "./types.js";
import { MappingError } from "../errors.js";

const TypeMasque = enveloppe.masque.TypeMasque;
const SecteurMasque = enveloppe.masque.SecteurMasque;

export type MasqueProps =
	| MasqueProcheProps
	| MasqueLointainHomogeneProps
	| MasqueLointainNonHomogeneProps;

export type MasqueProcheProps = {
	key: "masque_proche";
	baie: BaieVitree;
};

export type MasqueLointainHomogeneProps = {
	key: "masque_lointain_homogene";
	baie: BaieVitree;
};

export type MasqueLointainNonHomogeneProps = {
	key: "masque_lointain_non_homogene";
	masque: MasqueLointainNonHomogene;
};

export function mapMasque(props: MasqueProps): enveloppe.masque.Masque | null {
	switch (props.key) {
		case "masque_proche":
			return masqueProche.mapMasque(props.baie);
		case "masque_lointain_homogene":
			return masqueLointainHomogene.mapMasque(props.baie);
		case "masque_lointain_non_homogene":
			return masqueLointainNonHomogene.mapMasque(props.masque);
		default:
			const _exhaustive: never = props;
			return _exhaustive;
	}
}

export namespace masqueProche {
	export function mapMasque(
		props: BaieVitree,
	): enveloppe.masque.MasqueProche | null {
		const type = mapType(props);

		if (!type) return null;

		const value: enveloppe.masque.MasqueBase = {
			id: createId(),
			description: "Masque proche",
			type,
			hauteur: null,
			profondeur: mapProfondeur(props),
			secteur: null,
		};

		if (!enveloppe.masque.isMasqueProche(value))
			throw new MappingError("masque.type", props);

		return value;
	}

	export function mapType(
		props: BaieVitree,
	): enveloppe.masque.Masque["type"] | null {
		switch (props.donnee_entree.tv_coef_masque_proche_id) {
			case 1:
			case 2:
			case 3:
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
			case 10:
			case 11:
			case 12:
				return TypeMasque.enum.fond_balcon;

			case 13:
			case 14:
			case 15:
			case 16:
				return TypeMasque.enum.balcon_ou_auvent;

			case 17:
				return TypeMasque.enum.paroi_laterale_sans_obstacle_au_sud;

			case 18:
				return TypeMasque.enum.paroi_laterale_avec_obstacle_au_sud;

			default:
				return null;
		}
	}

	export function mapProfondeur(
		props: BaieVitree,
	): enveloppe.masque.Masque["profondeur"] {
		switch (props.donnee_entree.tv_coef_masque_proche_id) {
			case 1:
			case 5:
			case 9:
			case 13:
				return 0.5;

			case 2:
			case 6:
			case 10:
			case 14:
				return 1.5;

			case 3:
			case 7:
			case 11:
			case 15:
				return 2.5;

			case 4:
			case 8:
			case 12:
			case 16:
				return 3.5;

			default:
				return null;
		}
	}
}

export namespace masqueLointainHomogene {
	export function mapMasque(
		props: BaieVitree,
	): enveloppe.masque.MasqueLointainHomogene | null {
		const type = mapType(props);

		if (!type) return null;

		const value: enveloppe.masque.MasqueBase = {
			id: createId(),
			description: "Masque lointain homogène",
			type,
			hauteur: mapHauteur(props),
			profondeur: null,
			secteur: null,
		};

		if (!enveloppe.masque.isMasqueLointainHomogene(value))
			throw new MappingError("masque.type", props);

		return value;
	}

	export function mapType(
		props: BaieVitree,
	): enveloppe.masque.Masque["type"] | null {
		return props.donnee_entree.tv_coef_masque_lointain_homogene_id
			? TypeMasque.enum.homogene
			: null;
	}

	export function mapHauteur(
		props: BaieVitree,
	): enveloppe.masque.Masque["hauteur"] | null {
		switch (props.donnee_entree.tv_coef_masque_lointain_homogene_id) {
			case 1:
			case 5:
			case 9:
				return 7.5;

			case 2:
			case 6:
			case 10:
				return 22.5;

			case 3:
			case 7:
			case 11:
				return 45;

			case 4:
			case 8:
			case 12:
				return 60;

			default:
				return null;
		}
	}
}

export namespace masqueLointainNonHomogene {
	export function mapMasque(
		props: MasqueLointainNonHomogene,
	): enveloppe.masque.MasqueLointainNonHomogene | null {
		const value: enveloppe.masque.MasqueBase = {
			id: createId(),
			description: "Masque lointain non homogène",
			type: TypeMasque.enum.non_homogene,
			hauteur: mapHauteur(props),
			profondeur: null,
			secteur: mapSecteur(props),
		};

		if (!enveloppe.masque.isMasqueLointainNonHomogene(value))
			throw new MappingError("masque.type", props);

		return value;
	}

	export function mapHauteur(
		props: MasqueLointainNonHomogene,
	): enveloppe.masque.Masque["hauteur"] {
		switch (props.tv_coef_masque_lointain_non_homogene_id) {
			case 1:
			case 5:
			case 9:
			case 13:
			case 17:
				return 7.5;

			case 2:
			case 6:
			case 10:
			case 14:
			case 18:
				return 22.5;

			case 3:
			case 7:
			case 11:
			case 15:
			case 19:
				return 45;

			case 4:
			case 8:
			case 12:
			case 16:
			case 20:
				return 75;

			default:
				return null;
		}
	}

	export function mapSecteur(
		props: MasqueLointainNonHomogene,
	): enveloppe.masque.Masque["secteur"] {
		switch (props.tv_coef_masque_lointain_non_homogene_id) {
			case 1:
			case 2:
			case 3:
			case 4:
				return SecteurMasque.enum.lateral;

			case 5:
			case 6:
			case 7:
			case 8:
				return SecteurMasque.enum.central;

			case 9:
			case 10:
			case 11:
			case 12:
				return SecteurMasque.enum.lateral_sud;

			case 13:
			case 14:
			case 15:
			case 16:
				return SecteurMasque.enum.central_sud;

			case 17:
			case 18:
			case 19:
			case 20:
				return SecteurMasque.enum.lateral;

			default:
				return null;
		}
	}
}
