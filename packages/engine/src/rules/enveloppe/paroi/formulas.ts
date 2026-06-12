import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import type * as climat from "#rules/climat/formulas.js";
import type * as localNonChauffe from "#rules/enveloppe/local-non-chauffe/formulas.js";
import { ValeurForfaitaireError } from "#rules/errors.js";

/**
 * @formule enveloppe.baie.aiu
 * @formule enveloppe.mur.aiu
 * @formule enveloppe.plancher_bas.aiu
 * @formule enveloppe.plancher_haut.aiu
 * @formule enveloppe.porte.aiu
 * @returns Surface de la paroi donnant sur un local non chauffé en m²
 */
export function calcule_aiu(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
	surface: number;
}): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.local_non_chauffe:
			return props.surface;
		default:
			return 0;
	}
}

/**
 * @formule enveloppe.baie.sdep
 * @formule enveloppe.mur.sdep
 * @formule enveloppe.plancher_bas.sdep
 * @formule enveloppe.plancher_haut.sdep
 * @formule enveloppe.porte.sdep
 * @param props.surface : Surface de la paroi en m²
 * @param props.mitoyennete : Mitoyenneté de la paroi
 * @returns Surface déperditive de la paroi en m²
 */
export function calcule_sdep(props: {
	surface: number;
	mitoyennete: models.enveloppe.common.Mitoyennete;
}): number {
	const { surface, mitoyennete } = props;
	return mitoyennete !==
		models.enveloppe.common.MitoyenneteEnum.local_residentiel
		? surface
		: 0;
}

/**
 * @see calcule_blnc
 * @see calcule_bver
 * @see calcule_b_autres
 * @formule enveloppe.baie.b
 * @formule enveloppe.mur.b
 * @formule enveloppe.plancher_bas.b
 * @formule enveloppe.plancher_haut.b
 * @formule enveloppe.porte.b
 * Coefficient de réduction des déperditions thermiques de la paroi
 */
export type b = number;

/**
 * @guard {@linkcode models.enveloppe.common.isPositionParoiLocalNonChauffe} && {@linkcode models.enveloppe.localNonChauffe.isAutreLocalNonChauffe}
 * @returns Coefficient de réduction des déperditions thermiques de la paroi donnant sur un local non chauffé
 */
export function calcule_b_lnc(props: { blnc: localNonChauffe.b }): b {
	return props.blnc;
}

/**
 * @guard {@linkcode models.enveloppe.common.isPositionParoiLocalNonChauffe} && {@linkcode models.enveloppe.localNonChauffe.isAutreLocalNonChauffe}
 * @see abaques.enveloppe.paroi.bver
 * @throws {Error} Aucune orientation d'espace tampon solarisé fournie
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de réduction des déperditions thermiques de la paroi donnant sur un espace tampon solarisé
 */
export function calcule_b_ets(props: {
	type_local_non_chauffe: models.enveloppe.localNonChauffe.TypeLnc;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	orientations_ets: ReturnType<typeof localNonChauffe.calcule_orientations>;
	isolation_paroi: boolean;
}): b {
	const { zone_climatique, orientations_ets, isolation_paroi } = props;
	const abaque = abaques.enveloppe.paroi.bver;
	const data = abaque.load();

	const values = orientations_ets.map((orientation_ets) => {
		const query = { zone_climatique, orientation_ets, isolation_paroi };
		const match = abaque.search(query, data).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.bver;
	});
	return values.reduce((acc, value) => acc + value, 0) / values.length;
}

/**
 * @guard {@linkcode models.enveloppe.common.isPositionParoiAutres}
 * @returns Coefficient de réduction des déperditions thermiques de la paroi ne donnant pas sur un local non chauffé
 */
export function calcule_b_autres(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
}): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.local_non_residentiel:
			return 0.2;
		case models.enveloppe.common.MitoyenneteEnum.local_non_accessible:
			return 0.95;
		case models.enveloppe.common.MitoyenneteEnum.local_residentiel:
			return 0;
		default:
			return 1;
	}
}

/**
 * @param props.annee_installation - Année d'installation de la baie ou de la porte saisie
 * @param props.annee_construction_batiment - Année de construction du bâtiment
 * @returns Année d'installation de la baie ou de la porte retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}

/**
 * @param props.annee_construction - Année de construction de la paroi saisie
 * @param props.annee_renovation - Année de rénovation de la paroi saisie
 * @param props.annee_construction_batiment - Année de construction du bâtiment
 * @returns Année de construction de la paroi retenue
 */
export function set_annee_construction(props: {
	annee_construction: number | null;
	annee_renovation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_construction, annee_renovation, annee_construction_batiment } =
		props;
	return annee_construction ?? annee_renovation ?? annee_construction_batiment;
}
