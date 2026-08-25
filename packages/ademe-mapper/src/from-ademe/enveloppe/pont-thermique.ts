import { enveloppe } from "@open-dpe-logement/models";
import type { Input, PontThermique } from "./types.js";
import { MappingError } from "../../errors.js";
import { mapReferences } from "../common.js";

export type Props = {
	pontThermique: PontThermique;
	input: Input;
};

const TypeLiaisonEnum = enveloppe.pontThermique.TypeLiaisonEnum;

export function mapPontThermique(
	props: Props,
): enveloppe.pontThermique.PontThermique {
	return {
		id: mapId(props.pontThermique),
		description: mapDescription(props.pontThermique),
		longueur: mapLongueur(props),
		kpt: mapKpt(props),
		liaison: mapLiaison(props),
	};
}

export function mapId(props: PontThermique): string {
	return props.donnee_entree.reference;
}

export function mapDescription(props: PontThermique): string {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapLongueur(props: Props): number {
	return props.pontThermique.donnee_entree.l;
}

export function mapKpt(props: Props): number | null {
	return props.pontThermique.donnee_entree.k_saisi || null;
}

export function mapLiaison(props: Props): enveloppe.pontThermique.Liaison {
	const value: enveloppe.pontThermique.LiaisonBase = {
		type: mapTypeLiaison(props),
		mur_id: mapMurId(props),
		plancher_id: mapPlancherId(props),
		ouverture_id: mapOuvertureId(props),
		pont_thermique_partiel: mapPontThermiquePartiel(props),
	};

	if (!enveloppe.pontThermique.isLiaison(value))
		throw new MappingError("liaison", props.pontThermique);

	return value;
}

export function mapTypeLiaison(
	props: Props,
): enveloppe.pontThermique.TypeLiaison {
	switch (props.pontThermique.donnee_entree.enum_type_liaison_id) {
		case 1:
			return TypeLiaisonEnum.plancher_bas_mur;
		case 2:
			return TypeLiaisonEnum.plancher_intermediaire_mur;
		case 3:
			return TypeLiaisonEnum.plancher_haut_mur;
		case 4:
			return TypeLiaisonEnum.refend_mur;
		case 5:
			return mapBaieId(props)
				? TypeLiaisonEnum.baie_mur
				: TypeLiaisonEnum.porte_mur;
	}
}

export function mapMurId(props: Props): string {
	const haystack = props.input.logement.enveloppe.mur_collection;
	const id = mapReference(props.pontThermique, haystack);
	if (!id) throw new MappingError("mur_id", props.pontThermique);
	return id;
}

export function mapPlancherId(props: Props): string | null {
	return mapPlancherBasId(props) || mapPlancherHautId(props);
}

export function mapPlancherBasId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== 1) return null;
	const haystack = props.input.logement.enveloppe.plancher_bas_collection;
	const id = mapReference(props.pontThermique, haystack);
	if (!id) throw new MappingError("plancher_id", props.pontThermique);
	return id;
}

export function mapPlancherHautId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== 3) return null;
	const haystack = props.input.logement.enveloppe.plancher_haut_collection;
	const id = mapReference(props.pontThermique, haystack);
	if (!id) throw new MappingError("plancher_id", props.pontThermique);
	return id;
}

export function mapOuvertureId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== 5) return null;
	const id = mapBaieId(props) || mapPorteId(props);
	if (!id) throw new MappingError("ouverture_id", props.pontThermique);
	return id;
}

export function mapBaieId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== 5) return null;
	const haystack = props.input.logement.enveloppe.baie_vitree_collection;
	return mapReference(props.pontThermique, haystack);
}

export function mapPorteId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== 5) return null;
	const haystack = props.input.logement.enveloppe.porte_collection;
	return mapReference(props.pontThermique, haystack);
}

export function mapPontThermiquePartiel(props: Props): boolean | null {
	return (
		props.pontThermique.donnee_entree.pourcentage_valeur_pont_thermique < 1
	);
}

function mapReference(
	pontThermique: PontThermique,
	haystack: Array<{ donnee_entree: { reference: string } }>,
) {
	const needle =
		pontThermique.donnee_entree.reference_1 ||
		pontThermique.donnee_entree.reference_2;

	if (needle) {
		for (const item of haystack) {
			const ref = mapReferences(needle, item.donnee_entree.reference);
			if (ref) return ref;
		}
	}

	return null;
}
