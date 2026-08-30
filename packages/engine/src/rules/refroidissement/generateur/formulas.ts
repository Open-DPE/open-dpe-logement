import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "../../common/formulas.js";
import type * as climat from "../../climat/formulas.js";
import type * as production from "../../production/formulas.js";
import type * as refroidissement from "../../refroidissement/formulas.js";
import type * as installation from "../../refroidissement/installation/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";

/**
 * @formule refroidissement.generateur.cef
 * @formule refroidissement.generateur.cep
 * @formule refroidissement.generateur.eges
 * @returns Consommations par usage et par énergie du générateur de refroidissement
 */
export function calcule_consommations(props: {
	cfr: ReturnType<typeof calcule_cfr>;
	cfr_enr: ReturnType<typeof calcule_cfr_enr>;
	caux: ReturnType<typeof calcule_caux>;
	energie: models.refroidissement.generateur.EnergieRefroidissementEnum;
	reseau_id: string | null;
}): models.common.Consommations {
	return models.common.mergeConsommations(
		common.calcule_consommations({
			cef: props.cfr,
			cef_enr: props.cfr_enr,
			usage: models.common.USAGES.refroidissement,
			energie: props.energie,
			reseau_id: props.reseau_id,
		}),
		common.calcule_consommations({
			cef: props.caux,
			cef_enr: 0,
			usage: models.common.USAGES.auxiliaire,
			energie: models.common.ENERGIES.electricite,
			reseau_id: null,
		}),
	);
}

/**
 * @formule refroidissement.generateur.cfr
 * @returns Consommations du générateur de refroidissement en kWh/an
 */
export function calcule_cfr(props: {
	bfr: ReturnType<typeof refroidissement.calcule_bfr>;
	rdim: ReturnType<typeof calcule_rdim>;
	eer: ReturnType<typeof calcule_eer>;
}): number {
	const { rdim, eer } = props;
	const bfr = models.common.reduceParMois(props.bfr);
	return 0.9 * (bfr / eer) * rdim;
}

/**
 * @formule refroidissement.generateur.cfr_enr
 * @returns Consommations d'électricité renouvelable du générateur de refroidissement en kWh/an
 */
export function calcule_cfr_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	cfr_elec: ReturnType<typeof calcule_cfr_elec>;
}): number {
	return common.calcule_cener({
		celec: props.celec,
		celec_ac: props.celec_ac,
		usage: models.production.USAGES_ELECTRICITE.refroidissement,
		cef: props.cfr_elec,
	});
}

/**
 * @formule refroidissement.generateur.cfr_elec
 * @returns Consommation d'électricité du générateur de refroidissement en kWh/an
 */
export function calcule_cfr_elec(props: {
	cfr: ReturnType<typeof calcule_cfr>;
	energie_generateur: models.refroidissement.generateur.EnergieRefroidissementEnum;
}): number {
	return common.calcule_celec({
		cef: props.cfr,
		energie: props.energie_generateur,
	});
}

/**
 * @formule refroidissement.generateur.caux
 * @see https://github.com/dpe-audit/dpe-logement/issues/38
 * @returns Consommation d'énergie de l'auxiliaire de refroidissement en Wh/an
 */
export function calcule_caux(): number {
	return 0;
}

/**
 * @formule refroidissement.generateur.rdim
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
 * @formule refroidissement.generateur.eer
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
 * @returns Année d'installation du générateur de refroidissement retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}
