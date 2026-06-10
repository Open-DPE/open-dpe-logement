import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as climat from "#rules/climat/formulas.js";
import * as localNonChauffe from "#rules/enveloppe/local-non-chauffe/formulas.js";
import * as baie from "#rules/enveloppe/baie/formulas.js";
import * as mur from "#rules/enveloppe/mur/formulas.js";
import * as plancherBas from "#rules/enveloppe/plancher-bas/formulas.js";
import * as plancherHaut from "#rules/enveloppe/plancher-haut/formulas.js";
import * as porte from "#rules/enveloppe/porte/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";

/**
 * @formule enveloppe.baie.aiu
 * @formule enveloppe.mur.aiu
 * @formule enveloppe.plancher_bas.aiu
 * @formule enveloppe.plancher_haut.aiu
 * @formule enveloppe.porte.aiu
 * @return Surface de la paroi donnant sur un local non chauffé en m²
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

export type CalculeBProps =
	| Parameters<typeof calcule_b_lnc>[0]
	| Parameters<typeof calcule_b_ets>[0]
	| Parameters<typeof calcule_b_autres>[0];

/**
 * @formule enveloppe.baie.b
 * @formule enveloppe.mur.b
 * @formule enveloppe.plancher_bas.b
 * @formule enveloppe.plancher_haut.b
 * @formule enveloppe.porte.b
 * @returns Coefficient de réduction des déperditions thermiques de la paroi
 */
export function calcule_b(props: CalculeBProps): number {
	switch (props.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.local_non_chauffe:
			return props.type_local_non_chauffe ===
				models.enveloppe.localNonChauffe.TypeLncEnum.espace_tampon_solarise
				? calcule_b_ets(props)
				: calcule_b_lnc(props);
		default:
			return calcule_b_autres(props);
	}
}

/**
 * @returns Coefficient de réduction des déperditions thermiques de la paroi donnant sur un local non chauffé
 */
function calcule_b_lnc(props: {
	mitoyennete: typeof models.enveloppe.common.MitoyenneteEnum.local_non_chauffe;
	type_local_non_chauffe: Exclude<
		models.enveloppe.localNonChauffe.TypeLnc,
		typeof models.enveloppe.localNonChauffe.TypeLncEnum.espace_tampon_solarise
	>;
	blnc: ReturnType<typeof localNonChauffe.calcule_b>;
}): number {
	return props.blnc;
}

/**
 * @param props.isolation_paroi - Indique si la paroi est isolée ou non
 * @see abaques.enveloppe.paroi.bver
 * @throws {Error} Aucune orientation d'espace tampon solarisé fournie
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de réduction des déperditions thermiques de la paroi donnant sur un espace tampon solarisé
 */
function calcule_b_ets(props: {
	mitoyennete: typeof models.enveloppe.common.MitoyenneteEnum.local_non_chauffe;
	type_local_non_chauffe: typeof models.enveloppe.localNonChauffe.TypeLncEnum.espace_tampon_solarise;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	orientations_ets: ReturnType<typeof localNonChauffe.calcule_orientations>;
	isolation_paroi: boolean;
}): number {
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
 * @return Coefficient de réduction des déperditions thermiques de la paroi ne donnant pas sur un local non chauffé
 */
function calcule_b_autres(props: {
	mitoyennete: Exclude<
		models.enveloppe.common.Mitoyennete,
		typeof models.enveloppe.common.MitoyenneteEnum.local_non_chauffe
	>;
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
 * @formule enveloppe.baie.dp
 * @formule enveloppe.mur.dp
 * @formule enveloppe.plancher_bas.dp
 * @formule enveloppe.plancher_haut.dp
 * @formule enveloppe.porte.dp
 * @param props.u : Coefficient de transmission thermique de la paroi en W/m²K
 * @returns Déperditions thermiques de la paroi en W/K
 */
export function calcule_dp(props: {
	sdep: ReturnType<typeof calcule_sdep>;
	b: ReturnType<typeof calcule_b>;
	u:
		| ReturnType<typeof baie.calcule_u>
		| ReturnType<typeof mur.calcule_u>
		| ReturnType<typeof plancherBas.calcule_u>
		| ReturnType<typeof plancherHaut.calcule_u>
		| ReturnType<typeof porte.calcule_u>;
}): number {
	const { sdep, b, u } = props;
	return sdep * b * u;
}

/**
 * @param props.annee_installation - Année d'installation de la baie ou de la porte saisie
 * @param props.annee_construction_batiment - Année de construction du bâtiment
 * @return Année d'installation de la baie ou de la porte retenue
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
 * @return Année de construction de la paroi retenue
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
