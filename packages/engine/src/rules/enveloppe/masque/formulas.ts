import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import { ValeurForfaitaireError } from "../../errors.js";

/**
 * @guard {@linkcode models.enveloppe.masque.isMasqueProche}
 * @see abaques.enveloppe.masque.fe1
 * @throws {ValeurForfaitaireError}
 * @returns Facteur d'ensoleillement du masque
 */
export function calcule_fe1(props: {
	type_masque: models.enveloppe.masque.TypeMasqueEnum;
	orientation_facade: models.enveloppe.common.OrientationParoiEnum;
	avancee_masque: number | null;
}): number {
	const abaque = abaques.enveloppe.masque.fe1;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.fe1;
}

/**
 * @guard {@linkcode models.enveloppe.masque.isMasqueLointainHomogene}
 * @see abaques.enveloppe.masque.fe2
 * @throws {ValeurForfaitaireError}
 * @returns Facteur d'ensoleillement du masque lointain homogène
 */
export function calcule_fe2(props: {
	type_masque: models.enveloppe.masque.TypeMasqueEnum;
	orientation_facade: models.enveloppe.common.OrientationParoiEnum;
	hauteur_alpha_masque: number;
}): number {
	const abaque = abaques.enveloppe.masque.fe2;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.fe2;
}

/**
 * @guard {@linkcode models.enveloppe.masque.isMasqueLointainNonHomogene}
 * @see abaques.enveloppe.masque.omb
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient d'ombrage du masque lointain non homogène
 */
export function calcule_omb(props: {
	type_masque: models.enveloppe.masque.TypeMasqueEnum;
	orientation_facade: models.enveloppe.common.OrientationParoiEnum;
	secteur_orientation: models.enveloppe.masque.SecteurEnum;
	hauteur_alpha_masque: number;
}): number {
	const abaque = abaques.enveloppe.masque.omb;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.omb;
}
