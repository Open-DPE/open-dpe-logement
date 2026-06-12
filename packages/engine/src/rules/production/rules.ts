import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export { panneauPhotovoltaique };

export function calcule(ctx: Context): models.production.ProductionData {
	return {
		ppv: ppv(ctx),
		celec_ac: celec_ac_total(ctx),
		tapl: tapl(ctx),
	};
}

export function ppv(ctx: Context): ReturnType<typeof formulas.calcule_ppv> {
	return formulas.calcule_ppv({
		ppv: ctx.diagnostic.production.panneaux_photovoltaiques.map((item) =>
			ctx.resolve(
				constants.production.panneauPhotovoltaique.NAMESPACE,
				constants.production.panneauPhotovoltaique.RULES.ppv,
				item,
			),
		),
	});
}

export function celec_ac(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac> {
	return ctx.register(NAMESPACE, RULES.celec_ac, () =>
		formulas.calcule_celec_ac({
			celec: celec(ctx),
			celec_total: celec_total(ctx),
			celec_ac_total: celec_ac_total(ctx),
			tapl: tapl(ctx),
		}),
	);
}

export function celec_ac_total(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_total> {
	return ctx.register(NAMESPACE, RULES.celec_ac_total, () =>
		formulas.calcule_celec_ac_total({
			ppv: ppv(ctx),
			celec_total: celec_total(ctx),
			tapl: tapl(ctx),
		}),
	);
}

export function celec_total(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_total> {
	return ctx.register(NAMESPACE, RULES.celec_total, () =>
		formulas.calcule_celec_total({
			celec: celec(ctx),
		}),
	);
}

export function celec(ctx: Context): ReturnType<typeof formulas.calcule_celec> {
	return ctx.register(NAMESPACE, RULES.celec, () =>
		formulas.calcule_celec({
			celec_ch: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.cch_elec,
			),
			celec_aux_gen_ch: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.caux_gen,
			),
			celec_aux_dist_ch: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.caux_dist,
			),
			celec_ecs: ctx.resolve(
				constants.ecs.NAMESPACE,
				constants.ecs.RULES.cecs_elec,
			),
			celec_aux_gen_ecs: ctx.resolve(
				constants.ecs.NAMESPACE,
				constants.ecs.RULES.caux_gen,
			),
			celec_aux_dist_ecs: ctx.resolve(
				constants.ecs.NAMESPACE,
				constants.ecs.RULES.caux_dist,
			),
			celec_fr: ctx.resolve(
				constants.refroidissement.NAMESPACE,
				constants.refroidissement.RULES.cfr_elec,
			),
			celec_ecl: ctx.resolve(
				constants.eclairage.NAMESPACE,
				constants.eclairage.RULES.cecl,
			),
			celec_aux_vent: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.caux,
			),
			celec_autres: formulas.calcule_celec_autres({
				type_batiment: ctx.diagnostic.batiment.type,
				sh: ctx.resolve(
					constants.batiment.NAMESPACE,
					constants.batiment.RULES.sh,
				),
			}),
		}),
	);
}

export function tapl(ctx: Context): ReturnType<typeof formulas.calcule_tapl> {
	return ctx.register(NAMESPACE, RULES.tapl, () =>
		formulas.calcule_tapl({
			celec: celec(ctx),
		}),
	);
}
