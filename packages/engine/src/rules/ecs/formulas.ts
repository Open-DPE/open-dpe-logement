import * as models from "@open-dpe-logement/models";
import type * as batiment from "../batiment/formulas.js";
import type * as climat from "../climat/formulas.js";
import * as generateur from "./generateur/formulas.js";
import * as installation from "./installation/formulas.js";
import * as systeme from "./systeme/formulas.js";

export { generateur, installation, systeme };

/**
 * @formule ecs.cef
 * @formule ecs.cep
 * @formule ecs.eges
 * @returns Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	consommations: ReturnType<typeof generateur.calcule_consommations>[];
}): models.common.Consommations {
	return models.common.mergeConsommations(...props.consommations);
}

/**
 * @formule ecs.cecs
 * @returns Consommations d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs(props: {
	cecs: ReturnType<typeof generateur.calcule_cecs>[];
}): number {
	return props.cecs.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.cecs_elec
 * @returns Consommation d'électricité d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_elec(props: {
	cecs_elec: ReturnType<typeof generateur.calcule_cecs_elec>[];
}): number {
	return props.cecs_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.caux
 * @returns Consommations des auxiliaires de l'eau chaude sanitaire en kWh/an
 */
export function calcule_caux(props: {
	caux_gen: ReturnType<typeof calcule_caux_gen>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
}): number {
	return props.caux_gen + props.caux_dist;
}

/**
 * @formule ecs.caux_gen
 * @returns Consommations des auxiliaires de génération en kWh/an
 */
export function calcule_caux_gen(props: {
	caux_gen: ReturnType<typeof generateur.calcule_caux_gen>[];
}): number {
	return props.caux_gen.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.caux_dist
 * @returns Consommations des auxiliaires de distribution en kWh/an
 */
export function calcule_caux_dist(props: {
	caux_dist: ReturnType<typeof installation.calcule_caux_dist>[];
}): number {
	return props.caux_dist.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.qgw
 * @returns Pertes de stockage en Wh/an
 */
export function calcule_qgw(props: {
	qgw: ReturnType<typeof generateur.calcule_qgw>[];
}): number {
	return props.qgw.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.qgen
 * @returns Pertes de génération d'eau chaude sanitaire en Wh/an
 */
export function calcule_qgen(props: {
	qgen: ReturnType<typeof generateur.calcule_qgen>[];
}): number {
	return props.qgen.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.qdw_ind_vc
 * @returns Pertes de distribution individuelle en volume chauffé d'eau chaude sanitaire en Wh/an
 */
export function calcule_qdw_ind_vc(props: {
	qdw_ind_vc: ReturnType<typeof installation.calcule_qdw_ind_vc>[];
}): number {
	return props.qdw_ind_vc.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.qdw_col_vc
 * @returns Pertes de distribution collective en volume chauffé en Wh/an
 */
export function calcule_qdw_col_vc(props: {
	qdw_col_vc: ReturnType<typeof installation.calcule_qdw_col_vc>[];
}): number {
	return props.qdw_col_vc.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.qdw_col_hvc
 * @returns Pertes de distribution collective hors du volume chauffé en Wh/an
 */
export function calcule_qdw_col_hvc(props: {
	qdw_col_hvc: ReturnType<typeof installation.calcule_qdw_col_hvc>[];
}): number {
	return props.qdw_col_hvc.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.becs
 * @returns Besoins d'eau chaude sanitaire en kWh/mois
 */
export function calcule_becs(props: {
	scenario: models.common.ScenarioEnum;
	nadeq: ReturnType<typeof calcule_nadeq>;
	nj: ReturnType<typeof climat.calcule_nj>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
}): models.common.ParMois<number> {
	const { scenario, nadeq } = props;
	return models.common.createParMois((mois) => {
		const tefs = props.sollicitations[mois].tefs;
		const nj = props.nj[mois];
		switch (scenario) {
			case models.common.SCENARIOS.conventionnel:
				return (1.163 * nadeq * 56 * (40 - tefs) * nj) / 1000;
			case models.common.SCENARIOS.depensier:
				return (1.163 * nadeq * 79 * (40 - tefs) * nj) / 1000;
		}
	});
}

/**
 * @formule ecs.nadeq
 * @param props.logements : Nombre de logements
 * @returns Nombre d'adultes équivalent
 */
export function calcule_nadeq(props: {
	logements: number;
	nmax: ReturnType<typeof calcule_nmax>;
}): number {
	const { logements, nmax } = props;
	return nmax < 1.75
		? nmax * logements
		: logements * (1.75 + 0.3 * (nmax - 1.75));
}

/**
 * @formule ecs.nmax
 * @param props.logements : Nombre de logements
 * @returns Coefficient d'occupation maximal
 */
export function calcule_nmax(props: {
	type_batiment: models.batiment.TypeBatimentEnum;
	logements: number;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const { type_batiment, logements, sh } = props;
	const shmoy = sh / logements;

	switch (type_batiment) {
		case models.batiment.TYPES_BATIMENT.maison:
			if (shmoy < 30) return 1;
			if (shmoy < 70) return 1.75 - 0.01875 * (70 - shmoy);
			return 0.025 * shmoy;

		case models.batiment.TYPES_BATIMENT.immeuble:
			if (shmoy < 10) return 1;
			if (shmoy < 50) return 1.75 - 0.01875 * (50 - shmoy);
			return 0.035 * shmoy;
	}
}
