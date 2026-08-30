import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import type * as climat from "../../../climat/formulas.js";
import { ValeurForfaitaireError } from "../../..//errors.js";

export { calcule_c1 } from "../../../climat/formulas.js";

/**
 * @formule enveloppe.local_non_chauffe.baie.aue
 * @see https://github.com/dpe-audit/dpe-logement/issues/40
 * @param props.mitoyennete : Mitoyenneté de la paroi du local non chauffé
 * @param props.surface : Surface de la paroi du local non chauffé en m²
 * @returns Surface de la paroi du local non chauffé donnant sur l'extérieur ou en contact avec le sol en m²
 */
export function calcule_aue(props: {
	mitoyennete: models.enveloppe.common.MitoyenneteEnum;
	surface: number;
}): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MITOYENNETES.exterieur:
		case models.enveloppe.common.MITOYENNETES.enterre:
		case models.enveloppe.common.MITOYENNETES.local_non_accessible:
			return props.surface;
		default:
			return 0;
	}
}

/**
 * @formule enveloppe.local_non_chauffe.baie.aiu
 * @param props.mitoyennete : Mitoyenneté de la paroi du local non chauffé
 * @param props.surface : Surface de la paroi du local non chauffé en m²
 * @returns Surface de la paroi du local non chauffé donnant sur un espace chauffé en m²
 */
export function calcule_aiu(props: {
	mitoyennete: models.enveloppe.common.MitoyenneteEnum;
	surface: number;
}): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MITOYENNETES.local_residentiel:
		case models.enveloppe.common.MITOYENNETES.local_non_residentiel:
			return props.surface;
		default:
			return 0;
	}
}

/**
 * @formule enveloppe.local_non_chauffe.baie.sst
 * @param props.surface : Surface de la baie de l'espace tampon solarisé donnant sur l'extérieur en m²
 * @returns Surface sud équivalente de la baie de l'espace tampon solarisé donnant sur l'extérieur en m²/mois
 */
export function calcule_sst(props: {
	surface: number;
	t: ReturnType<typeof calcule_t>;
	c1: ReturnType<typeof climat.calcule_c1>;
}): models.common.ParMois<number> {
	const { surface, t, c1 } = props;
	return models.common.createParMois(
		(mois) => surface * (0.8 * t + 0.024) * c1[mois],
	);
}

/**
 * @formule enveloppe.local_non_chauffe.baie.t
 * @see https://github.com/dpe-audit/dpe-logement/issues/44
 * @see abaques.enveloppe.localNonChauffe.t
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transparence de la baie séparant l'espace tampon solarisé de l'extérieur
 */
export function calcule_t(props: {
	type_vitrage: ReturnType<typeof set_type_vitrage>;
	materiau: ReturnType<typeof set_materiau>;
	presence_rupteur_pont_thermique: ReturnType<
		typeof set_presence_rupteur_pont_thermique
	>;
}): number {
	const abaque = abaques.enveloppe.localNonChauffe.t;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.t;
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/39
 * @returns État d'isolation de la baie séparant le local non chauffé de l'extérieur
 */
export function set_isolation(props: {
	type_vitrage: ReturnType<typeof set_type_vitrage>;
}): boolean {
	switch (props.type_vitrage) {
		case models.enveloppe.baie.TYPES_VITRAGE.triple_vitrage:
		case models.enveloppe.baie.TYPES_VITRAGE.triple_vitrage_fe:
			return true;
		default:
			return false;
	}
}

/**
 * @param props.type_vitrage : Type de vitrage de la baie séparant le local non chauffé de l'extérieur saisi
 * @returns Type de vitrage de la baie séparant le local non chauffé de l'extérieur retenu
 */
export function set_type_vitrage(props: {
	type_vitrage: models.enveloppe.baie.TypeVitrageEnum | null;
}): models.enveloppe.baie.TypeVitrageEnum {
	return (
		props.type_vitrage ?? models.enveloppe.baie.TYPES_VITRAGE.simple_vitrage
	);
}

/**
 * @param props.materiau : Matériau de la baie séparant le local non chauffé de l'extérieur saisi
 * @returns Matériau de la baie séparant le local non chauffé de l'extérieur retenu
 */
export function set_materiau(props: {
	materiau: models.enveloppe.baie.MateriauEnum | null;
}): models.enveloppe.baie.MateriauEnum {
	return props.materiau ?? models.enveloppe.baie.MATERIAUX.pvc;
}

/**
 * @param props.presence_rupteur_pont_thermique : Présence d'un rupteur de pont thermique sur la baie séparant le local non chauffé de l'extérieur saisie
 * @returns Présence d'un rupteur de pont thermique sur la baie séparant le local non chauffé de l'extérieur retenue
 */
export function set_presence_rupteur_pont_thermique(props: {
	presence_rupteur_pont_thermique: boolean | null;
}): boolean {
	return props.presence_rupteur_pont_thermique ?? false;
}
