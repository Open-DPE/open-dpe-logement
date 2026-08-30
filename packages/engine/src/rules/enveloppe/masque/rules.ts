import * as models from "@open-dpe-logement/models";
import * as formulas from "./formulas.js";

type Masque = models.enveloppe.masque.Masque;

export function fe1(
	orientation_facade: models.enveloppe.common.OrientationParoiEnum,
	item: Masque,
): ReturnType<typeof formulas.calcule_fe1> | null {
	return models.enveloppe.masque.isMasqueProche(item)
		? formulas.calcule_fe1({
				type_masque: item.type,
				orientation_facade: orientation_facade,
				avancee_masque: item.profondeur,
			})
		: null;
}

export function fe2(
	orientation_facade: models.enveloppe.common.OrientationParoiEnum,
	item: Masque,
): ReturnType<typeof formulas.calcule_fe2> | null {
	return models.enveloppe.masque.isMasqueLointainHomogene(item)
		? formulas.calcule_fe2({
				type_masque: item.type,
				orientation_facade: orientation_facade,
				hauteur_alpha_masque: item.hauteur,
			})
		: null;
}

export function omb(
	orientation_facade: models.enveloppe.common.OrientationParoiEnum,
	item: Masque,
): ReturnType<typeof formulas.calcule_omb> | null {
	return models.enveloppe.masque.isMasqueLointainNonHomogene(item)
		? formulas.calcule_omb({
				type_masque: item.type,
				orientation_facade: orientation_facade,
				secteur_orientation: item.secteur,
				hauteur_alpha_masque: item.hauteur,
			})
		: null;
}
