import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import { ValeurForfaitaireError } from "#utils/errors.js";

export type MasqueProcheProps = {
	type_masque: Exclude<
		models.enveloppe.masque.TypeMasque,
		| typeof models.enveloppe.masque.TypeMasqueEnum.homogene
		| typeof models.enveloppe.masque.TypeMasqueEnum.non_homogene
	>;
	orientation_facade: models.enveloppe.common.Orientation;
	avancee_masque: number | null;
};

export type MasqueLointainHomogeneProps = {
	type_masque: typeof models.enveloppe.masque.TypeMasqueEnum.homogene;
	orientation_facade: models.enveloppe.common.Orientation;
	hauteur_masque_alpha: number;
};

export type MasqueLointainNonHomogeneProps = {
	type_masque: typeof models.enveloppe.masque.TypeMasqueEnum.non_homogene;
	orientation_facade: models.enveloppe.common.Orientation;
	secteur_orientation: models.enveloppe.masque.Secteur;
	hauteur_masque_alpha: number;
};

export type Props =
	| MasqueProcheProps
	| MasqueLointainHomogeneProps
	| MasqueLointainNonHomogeneProps;

/**
 * @see abaques.enveloppe.masque.fe1
 * @throws {ValeurForfaitaireError}
 * @returns Facteur d'ensoleillement du masque
 */
export function calcule_fe1(props: Props): number {
	const abaque = abaques.enveloppe.masque.fe1;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.fe1;
}

/**
 * @see abaques.enveloppe.masque.fe2
 * @throws {ValeurForfaitaireError}
 * @returns Facteur d'ensoleillement du masque lointain homogène
 */
export function calcule_fe2(props: Props): number {
	const abaque = abaques.enveloppe.masque.fe2;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.fe2;
}

/**
 * @see abaques.enveloppe.masque.omb
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient d'ombrage du masque lointain non homogène
 */
export function calcule_omb(props: Props): number {
	const abaque = abaques.enveloppe.masque.omb;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.omb;
}
