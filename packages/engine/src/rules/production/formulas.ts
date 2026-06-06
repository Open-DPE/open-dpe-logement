import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as eclairage from "#rules/eclairage/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as refroidissement from "#rules/refroidissement/formulas.js";
import * as ventiletion from "#rules/ventilation/formulas.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique/formulas.js";

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
	return models.common.reduceParMois(models.common.mergeParMois(props.ppv));
}

/**
 * @return Coefficient de calage représentant le taux d'auto-production maximum pouvant être atteint lorsque la production d'électricité renouvelable augmente
 */
export function calcule_tapl(props: {
	celec: ReturnType<typeof calcule_celec>;
}): number {
	return Object.keys(props.celec).reduce((tapl, key) => {
		const k = key as models.production.UsageElectricite;
		return tapl + props.celec[k] * TAPLP[k];
	}, 0);
}

/**
 * @return Électricité photovoltaïque autoconsommée en kWh/an
 */
export function calcule_celec_ac_total(props: {
	ppv: ReturnType<typeof calcule_ppv>;
	celec_total: ReturnType<typeof calcule_celec_total>;
	tapl: ReturnType<typeof calcule_tapl>;
}): number {
	const { ppv, celec_total, tapl } = props;
	if (!celec_total) return 0;
	const tcv = ppv / celec_total;
	const tap = 1 / (1 / tcv + 1 / tapl);
	return celec_total * tap;
}

/**
 * @returns Électricité photovoltaïque autoconsommée par usage en kWh/an
 */
export function calcule_celec_ac(props: {
	celec: ReturnType<typeof calcule_celec>;
	celec_total: ReturnType<typeof calcule_celec_total>;
	celec_ac_total: ReturnType<typeof calcule_celec_ac_total>;
	tapl: ReturnType<typeof calcule_tapl>;
}): models.production.ParUsageElectricite<number> {
	const { celec, celec_total, celec_ac_total, tapl } = props;
	const usages = models.production.UsageElectriciteEnum;

	const celec_ac = (usage: models.production.UsageElectricite) => {
		return (
			((TAPLP[usage] * celec[usage]) / (tapl * celec_total)) * celec_ac_total
		);
	};
	return {
		[usages.chauffage]: celec_ac(usages.chauffage),
		[usages.ecs]: celec_ac(usages.ecs),
		[usages.refroidissement]: celec_ac(usages.refroidissement),
		[usages.eclairage]: celec_ac(usages.eclairage),
		[usages.auxiliaires_ventilation]: celec_ac(usages.auxiliaires_ventilation),
		[usages.auxiliaires_distribution]: celec_ac(
			usages.auxiliaires_distribution,
		),
		[usages.autres]: celec_ac(usages.autres),
	};
}

/**
 * @return Électricité totale consommée en kWh/an
 */
export function calcule_celec_total(props: {
	celec: ReturnType<typeof calcule_celec>;
}): number {
	return Object.values(props.celec).reduce((acc, val) => acc + val, 0);
}

/**
 * @return Électricité consommée par usage en kWh/an
 */
export function calcule_celec(props: {
	celec_ch: ReturnType<typeof chauffage.calcule_cch_elec>;
	celec_aux_gen_ch: ReturnType<typeof chauffage.calcule_caux_gen>;
	celec_aux_dist_ch: ReturnType<typeof chauffage.calcule_caux_dist>;
	celec_ecs: ReturnType<typeof ecs.calcule_cecs_elec>;
	celec_aux_dist_ecs: ReturnType<typeof ecs.calcule_caux_dist>;
	celec_aux_gen_ecs: ReturnType<typeof ecs.calcule_caux_gen>;
	celec_ecl: ReturnType<typeof eclairage.calcule_cecl>;
	celec_fr: ReturnType<typeof refroidissement.calcule_cfr_elec>;
	celec_aux_vent: ReturnType<typeof ventiletion.calcule_caux>;
	celec_autres: ReturnType<typeof calcule_celec_autres>;
}): models.production.ParUsageElectricite<number> {
	const usages = models.production.UsageElectriciteEnum;
	return {
		[usages.chauffage]: props.celec_ch + props.celec_aux_gen_ch,
		[usages.ecs]: props.celec_ecs + props.celec_aux_gen_ecs,
		[usages.refroidissement]: props.celec_fr,
		[usages.eclairage]: props.celec_ecl,
		[usages.auxiliaires_ventilation]: props.celec_aux_vent,
		[usages.auxiliaires_distribution]:
			props.celec_aux_dist_ch + props.celec_aux_dist_ecs,
		[usages.autres]: props.celec_autres,
	};
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
