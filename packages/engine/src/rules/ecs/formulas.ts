import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as generateur from "#rules/ecs/generateur/formulas.js";
import * as installation from "#rules/ecs/installation/formulas.js";
import { createParMois } from "#utils/helpers.js";

/**
 * @doctrine ecs.cef
 * @doctrine ecs.cep
 * @doctrine ecs.eges
 * @return Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	consommations: ReturnType<typeof generateur.calcule_consommations>[];
}): models.common.Consommations {
	return models.common.mergeConsommations(...props.consommations);
}

/**
 * @doctrine ecs.cecs
 * @return Consommations d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs(props: {
	cecs: ReturnType<typeof generateur.calcule_cecs>[];
}): number {
	return props.cecs.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.cecs_elec
 * @return Consommation d'électricité d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_elec(props: {
	cecs_elec: ReturnType<typeof generateur.calcule_cecs_elec>[];
}): number {
	return props.cecs_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.caux
 * @return Consommations des auxiliaires de l'eau chaude sanitaire en kWh/an
 */
export function calcule_caux(props: {
	caux_gen: ReturnType<typeof calcule_caux_gen>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
}): number {
	return props.caux_gen + props.caux_dist;
}

/**
 * @doctrine ecs.caux_gen
 * @return Consommations des auxiliaires de génération en kWh/an
 */
export function calcule_caux_gen(props: {
	caux_gen: ReturnType<typeof generateur.calcule_caux_gen>[];
}): number {
	return props.caux_gen.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.caux_dist
 * @return Consommations des auxiliaires de distribution en kWh/an
 */
export function calcule_caux_dist(props: {
	caux_dist: ReturnType<typeof installation.calcule_caux_dist>[];
}): number {
	return props.caux_dist.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.qgw
 * @return Pertes de stockage en Wh/an
 */
export function calcule_qgw(props: {
	qgw: ReturnType<typeof generateur.calcule_qgw>[];
}): number {
	return props.qgw.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.qgen
 * @return Pertes de génération d'eau chaude sanitaire en Wh/an
 */
export function calcule_qgen(props: {
	qgen: ReturnType<typeof generateur.calcule_qgen>[];
}): number {
	return props.qgen.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.qdw_ind_vc
 * @return Pertes de distribution individuelle en volume chauffé d'eau chaude sanitaire en Wh/an
 */
export function calcule_qdw_ind_vc(props: {
	qdw_ind_vc: ReturnType<typeof installation.calcule_qdw_ind_vc>[];
}): number {
	return props.qdw_ind_vc.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.qdw_col_vc
 * @return Pertes de distribution collective en volume chauffé en Wh/an
 */
export function calcule_qdw_col_vc(props: {
	qdw_col_vc: ReturnType<typeof installation.calcule_qdw_col_vc>[];
}): number {
	return props.qdw_col_vc.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.qdw_col_hvc
 * @return Pertes de distribution collective hors du volume chauffé en Wh/an
 */
export function calcule_qdw_col_hvc(props: {
	qdw_col_hvc: ReturnType<typeof installation.calcule_qdw_col_hvc>[];
}): number {
	return props.qdw_col_hvc.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.becs
 * @returns Besoins d'eau chaude sanitaire en kWh/mois
 */
export function calcule_becs(props: {
	scenario: models.common.Scenario;
	nadeq: ReturnType<typeof calcule_nadeq>;
	nj: ReturnType<typeof climat.calcule_nj>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
}): models.common.ParMois<number> {
	const { scenario, nadeq } = props;
	return createParMois((mois) => {
		const tefs = props.sollicitations[mois].tefs;
		const nj = props.nj[mois];
		switch (scenario) {
			case models.common.ScenarioEnum.conventionnel:
				return (1.163 * nadeq * 56 * (40 - tefs) * nj) / 1000;
			case models.common.ScenarioEnum.depensier:
				return (1.163 * nadeq * 79 * (40 - tefs) * nj) / 1000;
		}
	});
}

/**
 * @doctrine ecs.nadeq
 * @param props.logements : Nombre de logements
 * @return Nombre d'adultes équivalent
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
 * @doctrine ecs.nmax
 * @param props.logements : Nombre de logements
 * @return Coefficient d'occupation maximal
 */
export function calcule_nmax(props: {
	type_batiment: models.batiment.TypeBatiment;
	logements: number;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const { type_batiment, logements, sh } = props;
	const shmoy = sh / logements;

	switch (type_batiment) {
		case models.batiment.TypeBatimentEnum.maison:
			if (shmoy < 30) return 1;
			if (shmoy < 70) return 1.75 - 0.01875 * (70 - shmoy);
			return 0.025 * shmoy;

		case models.batiment.TypeBatimentEnum.immeuble:
			if (shmoy < 10) return 1;
			if (shmoy < 50) return 1.75 - 0.01875 * (50 - shmoy);
			return 0.035 * shmoy;
	}
}
