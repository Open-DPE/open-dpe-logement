import * as models from "@open-dpe-logement/models";

/**
 * @formule enveloppe.local_non_chauffe.paroi.aue
 * @see https://github.com/dpe-audit/dpe-logement/issues/40
 * @param props.mitoyennete : Mitoyenneté de la paroi du local non chauffé
 * @param props.surface : Surface de la paroi du local non chauffé en m²
 * @returns Surface de la paroi du local non chauffé donnant sur l'extérieur ou en contact avec le sol en m²
 */
export function calcule_aue(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
	surface: number;
}): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.exterieur:
		case models.enveloppe.common.MitoyenneteEnum.enterre:
		case models.enveloppe.common.MitoyenneteEnum.local_non_accessible:
			return props.surface;
		default:
			return 0;
	}
}

/**
 * @formule enveloppe.local_non_chauffe.paroi.aiu
 * @param props.mitoyennete : Mitoyenneté de la paroi du local non chauffé
 * @param props.surface : Surface de la paroi du local non chauffé en m²
 * @returns Surface de la paroi du local non chauffé donnant sur un espace chauffé en m²
 */
export function calcule_aiu(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
	surface: number;
}): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.local_residentiel:
		case models.enveloppe.common.MitoyenneteEnum.local_non_residentiel:
			return props.surface;
		default:
			return 0;
	}
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/39
 * @param props.isolation : État d'isolation de la paroi séparant le local non chauffé de l'extérieur
 * @returns État d'isolation retenu
 */
export function set_isolation(props: { isolation: boolean | null }): boolean {
	return props.isolation ? true : false;
}
