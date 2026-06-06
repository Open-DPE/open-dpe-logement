import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as ecs from "#rules/ecs/registry.js";
import * as refroidissement from "#rules/refroidissement/registry.js";
import * as eclairage from "#rules/eclairage/registry.js";
import * as ventilation from "#rules/ventilation/registry.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context) {
	panneauPhotovoltaique.rules.register(ctx);

	ctx.register(ID, RULES.ppv, () => ppv(ctx));
	ctx.register(ID, RULES.celec_ac_total, () => celec_ac_total(ctx));
	ctx.register(ID, RULES.celec_ac, () => celec_ac(ctx));
	ctx.register(ID, RULES.celec_total, () => celec_total(ctx));
	ctx.register(ID, RULES.celec, () => celec(ctx));
	ctx.register(ID, RULES.tapl, () => tapl(ctx));
}

export function ppv(ctx: Context): ReturnType<typeof formulas.calcule_ppv> {
	return formulas.calcule_ppv({
		ppv: ctx.diagnostic.production.panneaux_photovoltaiques.map((item) =>
			ctx.resolve(
				panneauPhotovoltaique.ID,
				panneauPhotovoltaique.RULES.ppv,
				item,
			),
		),
	});
}

export function celec_ac(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac> {
	return formulas.calcule_celec_ac({
		celec: ctx.resolve(ID, RULES.celec),
		celec_total: ctx.resolve(ID, RULES.celec_total),
		celec_ac_total: ctx.resolve(ID, RULES.celec_ac_total),
		tapl: ctx.resolve(ID, RULES.tapl),
	});
}

export function celec_ac_total(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_total> {
	return formulas.calcule_celec_ac_total({
		ppv: ctx.resolve(ID, RULES.ppv),
		celec_total: ctx.resolve(ID, RULES.celec_total),
		tapl: ctx.resolve(ID, RULES.tapl),
	});
}

export function celec_total(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_total> {
	return formulas.calcule_celec_total({
		celec: ctx.resolve(ID, RULES.celec),
	});
}

export function celec(ctx: Context): ReturnType<typeof formulas.calcule_celec> {
	return formulas.calcule_celec({
		celec_ch: ctx.resolve(chauffage.ID, chauffage.RULES.cch_elec),
		celec_aux_gen_ch: ctx.resolve(chauffage.ID, chauffage.RULES.caux_gen),
		celec_aux_dist_ch: ctx.resolve(chauffage.ID, chauffage.RULES.caux_dist),
		celec_ecs: ctx.resolve(ecs.ID, ecs.RULES.cecs_elec),
		celec_aux_gen_ecs: ctx.resolve(ecs.ID, ecs.RULES.caux_gen),
		celec_aux_dist_ecs: ctx.resolve(ecs.ID, ecs.RULES.caux_dist),
		celec_fr: ctx.resolve(refroidissement.ID, refroidissement.RULES.cfr_elec),
		celec_ecl: ctx.resolve(eclairage.ID, eclairage.RULES.cecl),
		celec_aux_vent: ctx.resolve(ventilation.ID, ventilation.RULES.caux),
		celec_autres: formulas.calcule_celec_autres({
			type_batiment: ctx.diagnostic.batiment.type,
			sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		}),
	});
}

export function tapl(ctx: Context): ReturnType<typeof formulas.calcule_tapl> {
	return formulas.calcule_tapl({
		celec: ctx.resolve(ID, RULES.celec),
	});
}

export function applique(ctx: Context): models.production.ProductionWithData {
	return {
		...ctx.diagnostic.production,
		data: {
			ppv: ctx.resolve(ID, RULES.ppv),
			celec_ac: ctx.resolve(ID, RULES.celec_ac_total),
			tapl: ctx.resolve(ID, RULES.tapl),
		},
	};
}
