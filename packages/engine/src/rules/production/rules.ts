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
	ctx.register(ID, RULES.celec, () => celec(ctx));
	ctx.register(ID, RULES.celec_ch, () => celec_ch(ctx));
	ctx.register(ID, RULES.celec_ecs, () => celec_ecs(ctx));
	ctx.register(ID, RULES.celec_fr, () => celec_fr(ctx));
	ctx.register(ID, RULES.celec_ecl, () => celec_ecl(ctx));
	ctx.register(ID, RULES.celec_aux_vent, () => celec_aux_vent(ctx));
	ctx.register(ID, RULES.celec_aux_dist, () => celec_aux_dist(ctx));
	ctx.register(ID, RULES.celec_autres, () => celec_autres(ctx));
	ctx.register(ID, RULES.celec_ac, () => celec_ac(ctx));
	ctx.register(ID, RULES.celec_ac_ch, () => celec_ac_ch(ctx));
	ctx.register(ID, RULES.celec_ac_ecs, () => celec_ac_ecs(ctx));
	ctx.register(ID, RULES.celec_ac_fr, () => celec_ac_fr(ctx));
	ctx.register(ID, RULES.celec_ac_ecl, () => celec_ac_ecl(ctx));
	ctx.register(ID, RULES.celec_ac_aux_vent, () => celec_ac_aux_vent(ctx));
	ctx.register(ID, RULES.celec_ac_aux_dist, () => celec_ac_aux_dist(ctx));
	ctx.register(ID, RULES.celec_ac_autres, () => celec_ac_autres(ctx));
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
		ppv: ctx.resolve(ID, RULES.ppv),
		celec: ctx.resolve(ID, RULES.celec),
		tapl: ctx.resolve(ID, RULES.tapl),
	});
}

export function celec_ac_ch(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_ch),
		usage: models.production.UsageElectriciteEnum.chauffage,
	});
}

export function celec_ac_ecs(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_ecs),
		usage: models.production.UsageElectriciteEnum.ecs,
	});
}

export function celec_ac_fr(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_fr),
		usage: models.production.UsageElectriciteEnum.refroidissement,
	});
}

export function celec_ac_ecl(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_ecl),
		usage: models.production.UsageElectriciteEnum.eclairage,
	});
}

export function celec_ac_aux_vent(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_aux_vent),
		usage: models.production.UsageElectriciteEnum.auxiliaires_ventilation,
	});
}

export function celec_ac_aux_dist(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_aux_dist),
		usage: models.production.UsageElectriciteEnum.auxiliaires_distribution,
	});
}

export function celec_ac_autres(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ac_usage> {
	return formulas.calcule_celec_ac_usage({
		celec: ctx.resolve(ID, RULES.celec),
		celec_ac: ctx.resolve(ID, RULES.celec_ac),
		tapl: ctx.resolve(ID, RULES.tapl),
		celec_usage: ctx.resolve(ID, RULES.celec_autres),
		usage: models.production.UsageElectriciteEnum.autres,
	});
}

export function celec(ctx: Context): ReturnType<typeof formulas.calcule_celec> {
	return formulas.calcule_celec({
		celec_ch: ctx.resolve(ID, RULES.celec_ch),
		celec_ecs: ctx.resolve(ID, RULES.celec_ecs),
		celec_fr: ctx.resolve(ID, RULES.celec_fr),
		celec_ecl: ctx.resolve(ID, RULES.celec_ecl),
		celec_aux_vent: ctx.resolve(ID, RULES.celec_aux_vent),
		celec_aux_dist: ctx.resolve(ID, RULES.celec_aux_dist),
		celec_autres: ctx.resolve(ID, RULES.celec_autres),
	});
}

export function celec_ch(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ch> {
	return formulas.calcule_celec_ch({
		cch_elec: ctx.resolve(chauffage.ID, chauffage.RULES.cch_elec),
		caux_gen: ctx.resolve(chauffage.ID, chauffage.RULES.caux_gen),
	});
}

export function celec_ecs(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ecs> {
	return formulas.calcule_celec_ecs({
		cecs_elec: ctx.resolve(ecs.ID, ecs.RULES.cecs_elec),
		caux_gen: ctx.resolve(chauffage.ID, chauffage.RULES.caux_gen),
	});
}

export function celec_fr(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_fr> {
	return formulas.calcule_celec_fr({
		cfr_elec: ctx.resolve(refroidissement.ID, refroidissement.RULES.cfr_elec),
	});
}

export function celec_ecl(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_ecl> {
	return formulas.calcule_celec_ecl({
		cecl: ctx.resolve(eclairage.ID, eclairage.RULES.cecl),
	});
}

export function celec_aux_dist(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_aux_dist> {
	return formulas.calcule_celec_aux_dist({
		caux_dist_ch: ctx.resolve(chauffage.ID, chauffage.RULES.caux_dist),
		caux_dist_ecs: ctx.resolve(ecs.ID, ecs.RULES.caux_dist),
	});
}

export function celec_aux_vent(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_aux_vent> {
	return formulas.calcule_celec_aux_vent({
		caux_vent: ctx.resolve(ventilation.ID, ventilation.RULES.caux),
	});
}

export function celec_autres(
	ctx: Context,
): ReturnType<typeof formulas.calcule_celec_autres> {
	return formulas.calcule_celec_autres({
		type_batiment: ctx.diagnostic.batiment.type,
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
	});
}

export function tapl(ctx: Context): ReturnType<typeof formulas.calcule_tapl> {
	return formulas.calcule_tapl({
		celec_ch: ctx.resolve(ID, RULES.celec_ch),
		celec_ecs: ctx.resolve(ID, RULES.celec_ecs),
		celec_fr: ctx.resolve(ID, RULES.celec_fr),
		celec_ecl: ctx.resolve(ID, RULES.celec_ecl),
		celec_aux_vent: ctx.resolve(ID, RULES.celec_aux_vent),
		celec_aux_dist: ctx.resolve(ID, RULES.celec_aux_dist),
		celec_autres: ctx.resolve(ID, RULES.celec_autres),
	});
}
