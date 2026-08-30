import { enveloppe } from "@open-dpe-logement/models";
import type { Input, PontThermique } from "./types.js";
import { MappingError } from "../errors.js";
import { findReference, resolveId } from "../common.js";

export type Props = {
	pontThermique: PontThermique;
	input: Input;
};

const TYPES_LIAISON = enveloppe.pontThermique.TYPES_LIAISON;

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
	return resolveId(props.donnee_entree.reference);
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
): enveloppe.pontThermique.TypeLiaisonEnum {
	switch (props.pontThermique.donnee_entree.enum_type_liaison_id) {
		case "1":
			return TYPES_LIAISON.plancher_bas_mur;
		case "2":
			return TYPES_LIAISON.plancher_intermediaire_mur;
		case "3":
			return TYPES_LIAISON.plancher_haut_mur;
		case "4":
			return TYPES_LIAISON.refend_mur;
		case "5":
			return mapBaieId(props)
				? TYPES_LIAISON.baie_mur
				: TYPES_LIAISON.porte_mur;
	}
}

export function mapMurId(props: Props): string {
	const haystack = props.input.logement.enveloppe.mur_collection.map(
		(mur) => mur.donnee_entree.reference,
	);
	const id =
		mapReference(props.pontThermique, haystack) ?? mapMurIdViaOuverture(props);
	if (!id) throw new MappingError("mur_id", props.pontThermique);
	return id;
}

/**
 * Repli pour les liaisons baie_mur/porte_mur (type "5") : contrairement aux
 * autres types de liaison, `reference_1`/`reference_2` du pont thermique ne
 * référencent jamais le mur directement — seulement l'ouverture (ex.
 * "fen0"/"porte0", cf. `mapBaieId`/`mapPorteId`). Le mur associé se résout
 * transitivement via `reference_paroi` de cette ouverture, le même champ que
 * `paroi_id` de la baie/porte elle-même (voir
 * `enveloppe/paroi/position.ts::mapParoiId`) — constaté sur le corpus réel,
 * voir `claude/rapport-correctifs-known-failures.md` §4.
 */
function mapMurIdViaOuverture(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== "5")
		return null;

	const ouvertures = [
		...props.input.logement.enveloppe.baie_vitree_collection,
		...props.input.logement.enveloppe.porte_collection,
	];
	const ouvertureReferences = ouvertures.map(
		(ouverture) => ouverture.donnee_entree.reference,
	);
	const needles = [
		props.pontThermique.donnee_entree.reference_1,
		props.pontThermique.donnee_entree.reference_2,
	].filter(
		(needle): needle is string => needle !== null && needle !== undefined,
	);

	for (const needle of needles) {
		const matchedOuvertureRef = findReference(needle, ouvertureReferences);
		if (!matchedOuvertureRef) continue;

		const ouverture = ouvertures.find(
			(candidate) => candidate.donnee_entree.reference === matchedOuvertureRef,
		);
		if (!ouverture?.donnee_entree.reference_paroi) continue;

		const murReferences = props.input.logement.enveloppe.mur_collection.map(
			(mur) => mur.donnee_entree.reference,
		);
		const matchedMurRef = findReference(
			ouverture.donnee_entree.reference_paroi,
			murReferences,
		);
		if (matchedMurRef) return resolveId(matchedMurRef);
	}

	return null;
}

export function mapPlancherId(props: Props): string | null {
	return mapPlancherBasId(props) || mapPlancherHautId(props);
}

export function mapPlancherBasId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== "1")
		return null;
	const haystack = props.input.logement.enveloppe.plancher_bas_collection.map(
		(plancher) => plancher.donnee_entree.reference,
	);
	const id = mapReference(props.pontThermique, haystack);
	if (!id) throw new MappingError("plancher_id", props.pontThermique);
	return id;
}

export function mapPlancherHautId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== "3")
		return null;
	const haystack = props.input.logement.enveloppe.plancher_haut_collection.map(
		(plancher) => plancher.donnee_entree.reference,
	);
	const id = mapReference(props.pontThermique, haystack);
	if (!id) throw new MappingError("plancher_id", props.pontThermique);
	return id;
}

export function mapOuvertureId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== "5")
		return null;
	const id = mapBaieId(props) || mapPorteId(props);
	if (!id) throw new MappingError("ouverture_id", props.pontThermique);
	return id;
}

export function mapBaieId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== "5")
		return null;
	const haystack = props.input.logement.enveloppe.baie_vitree_collection.map(
		(baie) => baie.donnee_entree.reference,
	);
	return mapReference(props.pontThermique, haystack);
}

export function mapPorteId(props: Props): string | null {
	if (props.pontThermique.donnee_entree.enum_type_liaison_id !== "5")
		return null;
	const haystack = props.input.logement.enveloppe.porte_collection.map(
		(porte) => porte.donnee_entree.reference,
	);
	return mapReference(props.pontThermique, haystack);
}

export function mapPontThermiquePartiel(props: Props): boolean {
	return (
		props.pontThermique.donnee_entree.pourcentage_valeur_pont_thermique < 1
	);
}

function mapReference(
	pontThermique: PontThermique,
	haystack: string[],
): string | null {
	const needles = [
		pontThermique.donnee_entree.reference_1,
		pontThermique.donnee_entree.reference_2,
	].filter((needle) => needle !== null && needle !== undefined);

	for (const needle of needles) {
		const match = findReference(needle, haystack);
		if (match) return resolveId(match);
	}
	return null;
}
