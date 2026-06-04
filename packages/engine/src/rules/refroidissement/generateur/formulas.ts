import { abaques } from "@open-dpe-logement/abaques";
import * as climat from "#rules/climat/formulas.js";
import * as refroidissement from "#rules/refroidissement/formulas.js";
import * as installation from "#rules/refroidissement/installation/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import { reduceParMois } from "#utils/helpers.js";

/**
 * @doctrine refroidissement.generateur.cfr
 * @returns Consommations du générateur de refroidissement en kWh/an
 */
export function calcule_cfr(props: {
	bfr: ReturnType<typeof refroidissement.calcule_bfr>;
	rdim: ReturnType<typeof calcule_rdim>;
	eer: ReturnType<typeof calcule_eer>;
}): number {
	const { rdim, eer } = props;
	const bfr = reduceParMois(props.bfr);
	return 0.9 * (bfr / eer) * rdim;
}

/**
 * @doctrine refroidissement.generateur.caux
 * @see https://github.com/dpe-audit/dpe-logement/issues/38
 * @returns Consommation d'énergie de l'auxiliaire de refroidissement en Wh/an
 */
export function calcule_caux(): number {
	return 0;
}

/**
 * @doctrine refroidissement.generateur.rdim
 * @param props.installations - Liste des installations de refroidissement associées au générateur
 * @param props.installations[].n_generateurs - Nombre de générateurs de refroidissement associés à chaque installation
 * @returns Ratio de dimensionnement du générateur de refroidissement
 */
export function calcule_rdim(props: {
	installations: {
		rdim: ReturnType<typeof installation.calcule_rdim>;
		n_generateurs: number;
	}[];
}): number {
	const { installations } = props;
	return installations.reduce((s, i) => s + i.rdim * (1 / i.n_generateurs), 0);
}

/**
 * @doctrine refroidissement.generateur.eer
 * @param props.seer_saisi - Coefficient d'efficience énergétique saisonnier du générateur connu et justifié (SEER)
 * @see abaques.refroidissement.eer
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient d'efficience énergétique du générateur de refroidissement (EER)
 */
export function calcule_eer(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	seer_saisi: number | null;
}): number {
	const { seer_saisi } = props;
	if (seer_saisi && seer_saisi > 0) return seer_saisi * 0.95;

	const abaque = abaques.refroidissement.eer;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.eer;
}

/**
 * @param props.annee_installation - Année d'installation du générateur de refroidissement saisie
 * @param props.annee_construction_batiment - Année de construction du bâtiment
 * @return Année d'installation du générateur de refroidissement retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}
