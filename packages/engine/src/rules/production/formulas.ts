import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as eclairage from "#rules/eclairage/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as refroidissement from "#rules/refroidissement/formulas.js";
import * as ventiletion from "#rules/ventilation/formulas.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique/formulas.js";
import { mergeParMois, reduceParMois } from "#utils/helpers.js";

/**
 * Coefficient de calage représentant le taux d'auto-production maximum pouvant être atteint lorsque
 * la production d'électricité renouvelable augmente
 */
export const TAPLP = {
	[models.production.UsageElectriciteEnum.chauffage]: 0.02,
	[models.production.UsageElectriciteEnum.refroidissement]: 0.25,
	[models.production.UsageElectriciteEnum.ecs]: 0.05,
	[models.production.UsageElectriciteEnum.eclairage]: 0.02,
	[models.production.UsageElectriciteEnum.auxiliaires_ventilation]: 0.5,
	[models.production.UsageElectriciteEnum.auxiliaires_distribution]: 0.1,
	[models.production.UsageElectriciteEnum.autres]: 0.45,
};

/**
 * @return Production photovoltaïque totale en kWh/an
 */
export function calcule_ppv(props: {
	ppv: ReturnType<typeof panneauPhotovoltaique.calcule_ppv>[];
}): number {
	return reduceParMois(mergeParMois(props.ppv));
}

/**
 * @return Électricité photovoltaïque autoconsommée en kWh/an
 */
export function calcule_celec_ac(props: {
	ppv: ReturnType<typeof calcule_ppv>;
	celec: ReturnType<typeof calcule_celec>;
	tapl: ReturnType<typeof calcule_tapl>;
}): number {
	const { ppv, celec, tapl } = props;
	const tcv = ppv / celec;
	const tap = 1 / (1 / tcv + 1 / tapl);
	return celec * tap;
}

/**
 * @return Coefficient de calage représentant le taux d'auto-production maximum pouvant être atteint lorsque la production d'électricité renouvelable augmente
 */
export function calcule_tapl(props: {
	celec_ch: ReturnType<typeof calcule_celec_ch>;
	celec_ecs: ReturnType<typeof calcule_celec_ecs>;
	celec_fr: ReturnType<typeof calcule_celec_fr>;
	celec_ecl: ReturnType<typeof calcule_celec_ecl>;
	celec_aux_vent: ReturnType<typeof calcule_celec_aux_vent>;
	celec_aux_dist: ReturnType<typeof calcule_celec_aux_dist>;
	celec_autres: ReturnType<typeof calcule_celec_autres>;
}): number {
	let aplp = 0;
	aplp += props.celec_ch * TAPLP.chauffage;
	aplp += props.celec_ecs * TAPLP.ecs;
	aplp += props.celec_fr * TAPLP.refroidissement;
	aplp += props.celec_ecl * TAPLP.eclairage;
	aplp += props.celec_aux_vent * TAPLP.auxiliaires_ventilation;
	aplp += props.celec_aux_dist * TAPLP.auxiliaires_distribution;
	aplp += props.celec_autres * TAPLP.autres;
	return aplp / Object.values(props).reduce((acc, val) => acc + val, 0);
}

/**
 * @returns Électricité photovoltaïque autoconsommée par usage en kWh/an
 */
export function calcule_celec_ac_usage(props: {
	celec: ReturnType<typeof calcule_celec>;
	celec_ac: ReturnType<typeof calcule_celec_ac>;
	tapl: ReturnType<typeof calcule_tapl>;
	celec_usage:
		| ReturnType<typeof calcule_celec_ch>
		| ReturnType<typeof calcule_celec_ecs>
		| ReturnType<typeof calcule_celec_fr>
		| ReturnType<typeof calcule_celec_ecl>
		| ReturnType<typeof calcule_celec_aux_vent>
		| ReturnType<typeof calcule_celec_aux_dist>
		| ReturnType<typeof calcule_celec_autres>;
	usage: models.production.UsageElectricite;
}): number {
	const { celec, celec_ac, tapl, celec_usage, usage } = props;
	return ((TAPLP[usage] * celec_usage) / (tapl * celec)) * celec_ac;
}

/**
 * @return Électricité consommée en kWh/an
 */
export function calcule_celec(props: {
	celec_ch: ReturnType<typeof calcule_celec_ch>;
	celec_ecs: ReturnType<typeof calcule_celec_ecs>;
	celec_fr: ReturnType<typeof calcule_celec_fr>;
	celec_ecl: ReturnType<typeof calcule_celec_ecl>;
	celec_aux_vent: ReturnType<typeof calcule_celec_aux_vent>;
	celec_aux_dist: ReturnType<typeof calcule_celec_aux_dist>;
	celec_autres: ReturnType<typeof calcule_celec_autres>;
}): number {
	return Object.values(props).reduce((acc, val) => acc + val, 0);
}

/**
 * @return Électricité consommée pour le chauffage en kWh/an
 */
export function calcule_celec_ch(props: {
	cch_elec: ReturnType<typeof chauffage.calcule_cch_elec>;
	caux_gen: ReturnType<typeof chauffage.calcule_caux_gen>;
}): number {
	return props.cch_elec + props.caux_gen;
}

/**
 * @return Électricité consommée pour l'eau chaude sanitaire en kWh/an
 */
export function calcule_celec_ecs(props: {
	cecs_elec: ReturnType<typeof ecs.calcule_cecs_elec>;
	caux_gen: ReturnType<typeof ecs.calcule_caux_gen>;
}): number {
	return props.cecs_elec + props.caux_gen;
}

/**
 * @return Électricité consommée pour le refroidissement en kWh/an
 */
export function calcule_celec_fr(props: {
	cfr_elec: ReturnType<typeof refroidissement.calcule_cfr_elec>;
}): number {
	return props.cfr_elec;
}

/**
 * @return Électricité consommée pour l'éclairage en kWh/an
 */
export function calcule_celec_ecl(props: {
	cecl: ReturnType<typeof eclairage.calcule_cecl>;
}): number {
	return props.cecl;
}

/**
 * @return Électricité consommée pour les auxiliaires de distribution en kWh/an
 */
export function calcule_celec_aux_dist(props: {
	caux_dist_ch: ReturnType<typeof chauffage.calcule_caux_dist>;
	caux_dist_ecs: ReturnType<typeof ecs.calcule_caux_dist>;
}): number {
	return props.caux_dist_ch + props.caux_dist_ecs;
}

/**
 * @return Électricité consommée pour l'éclairage en kWh/an
 */
export function calcule_celec_aux_vent(props: {
	caux_vent: ReturnType<typeof ventiletion.calcule_caux>;
}): number {
	return props.caux_vent;
}

/**
 * @return Électricité consommée pour les autres usages en kWh/an
 */
export function calcule_celec_autres(props: {
	type_batiment: models.batiment.TypeBatiment;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const { type_batiment, sh } = props;
	switch (type_batiment) {
		case models.batiment.TypeBatimentEnum.maison:
			return sh * 29;
		case models.batiment.TypeBatimentEnum.immeuble:
			return sh * (27 + 1.1);
	}
}
