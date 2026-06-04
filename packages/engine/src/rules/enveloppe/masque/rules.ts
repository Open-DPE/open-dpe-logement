import * as models from "@open-dpe-logement/models";
import * as formulas from "./formulas.js";

type Masque = models.enveloppe.masque.Masque;

export function fe1(
	orientation_facade: models.enveloppe.common.Orientation,
	item: Masque,
): ReturnType<typeof formulas.calcule_fe1> {
	return formulas.calcule_fe1(prepare(orientation_facade, item));
}

export function fe2(
	orientation_facade: models.enveloppe.common.Orientation,
	item: Masque,
): ReturnType<typeof formulas.calcule_fe2> {
	return formulas.calcule_fe2(prepare(orientation_facade, item));
}

export function omb(
	orientation_facade: models.enveloppe.common.Orientation,
	item: Masque,
): ReturnType<typeof formulas.calcule_omb> {
	return formulas.calcule_omb(prepare(orientation_facade, item));
}

export function prepare(
	orientation_facade: models.enveloppe.common.Orientation,
	item: Masque,
): formulas.Props {
	switch (item.type) {
		case models.enveloppe.masque.TypeMasqueEnum.homogene:
			return {
				type_masque: item.type,
				orientation_facade: orientation_facade,
				hauteur_masque_alpha: item.hauteur,
			};
		case models.enveloppe.masque.TypeMasqueEnum.non_homogene:
			return {
				type_masque: item.type,
				orientation_facade: orientation_facade,
				secteur_orientation: item.secteur!,
				hauteur_masque_alpha: item.hauteur,
			};
		default:
			return {
				type_masque: item.type,
				orientation_facade: orientation_facade,
				avancee_masque: item.profondeur,
			};
	}
}
