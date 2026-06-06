import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as climat from "#rules/climat/registry.js";
import * as ecs from "#rules/ecs/registry.js";
import * as enveloppe from "#rules/enveloppe/registry.js";
import * as generateurRules from "#rules/chauffage/generateur/index.js";
import * as installationRules from "#rules/chauffage/installation/index.js";
import * as systemeRules from "#rules/chauffage/systeme/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";
import { generateur } from "./index.js";

export function register(ctx: Context): void {
	generateurRules.rules.register(ctx);
	installationRules.rules.register(ctx);
	systemeRules.rules.register(ctx);

	ctx.register(ID, RULES.consommations, () => consommations(ctx));
	ctx.register(ID, RULES.cch, () => cch(ctx));
	ctx.register(ID, RULES.cch_elec, () => cch_elec(ctx));
	ctx.register(ID, RULES.caux_gen, () => caux_gen(ctx));
	ctx.register(ID, RULES.caux_dist, () => caux_dist(ctx));
	ctx.register(ID, RULES.bch, () => bch(ctx));
	ctx.register(ID, RULES.bch_hp, () => bch_hp(ctx));
	ctx.register(ID, RULES.bv, () => bv(ctx));
	ctx.register(ID, RULES.pch, () => pch(ctx));
	ctx.register(ID, RULES.f, () => f(ctx));
	ctx.register(ID, RULES.as, () => as(ctx));
	ctx.register(ID, RULES.ai, () => ai(ctx));
	ctx.register(ID, RULES.qgw_rec, () => qgw_rec(ctx));
	ctx.register(ID, RULES.qdw_rec, () => qdw_rec(ctx));
	ctx.register(ID, RULES.qgen_ecs_rec, () => qgen_ecs_rec(ctx));
	ctx.register(ID, RULES.effet_joule, () => effet_joule(ctx));
	ctx.register(ID, RULES.nref, () => nref(ctx));
	ctx.register(ID, RULES.dh, () => dh(ctx));
}

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		consommations: ctx.diagnostic.chauffage.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.consommations, item),
		),
	});
}

export function cch(ctx: Context): ReturnType<typeof formulas.calcule_cch> {
	return formulas.calcule_cch({
		cch: ctx.diagnostic.chauffage.generateurs.map((generateur) =>
			ctx.resolve(generateurRules.ID, generateurRules.RULES.cch, generateur),
		),
	});
}

export function cch_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cch_elec> {
	return formulas.calcule_cch_elec({
		cch_elec: ctx.diagnostic.chauffage.generateurs.map((generateur) =>
			ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.cch_elec,
				generateur,
			),
		),
	});
}

export function caux_gen(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return formulas.calcule_caux_gen({
		caux_gen: ctx.diagnostic.chauffage.generateurs.map((generateur) =>
			ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.caux_gen,
				generateur,
			),
		),
	});
}

export function caux_dist(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return formulas.calcule_caux_dist({
		caux_dist: ctx.diagnostic.chauffage.installations.map((installation) =>
			ctx.resolve(
				installationRules.ID,
				installationRules.RULES.caux_dist,
				installation,
			),
		),
	});
}

export function bch(ctx: Context): ReturnType<typeof formulas.calcule_bch> {
	return formulas.calcule_bch({
		bch_hp: ctx.resolve(ID, RULES.bch_hp),
		qgw_rec: ctx.resolve(ID, RULES.qgw_rec),
		qdw_rec: ctx.resolve(ID, RULES.qdw_rec),
		qgen_rec: ctx.resolve(ID, RULES.qgen_ecs_rec),
	});
}

export function bch_hp(
	ctx: Context,
): ReturnType<typeof formulas.calcule_bch_hp> {
	return formulas.calcule_bch_hp({
		bv: ctx.resolve(ID, RULES.bv),
		dh: ctx.resolve(ID, RULES.dh),
	});
}

export function bv(ctx: Context): ReturnType<typeof formulas.calcule_bv> {
	return formulas.calcule_bv({
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		f: ctx.resolve(ID, RULES.f),
	});
}

export function pch(ctx: Context): ReturnType<typeof formulas.calcule_pch> {
	return formulas.calcule_pch({
		ratio_proratisation: ctx.resolve(
			batiment.ID,
			batiment.RULES.ratio_proratisation,
		),
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		tbase: ctx.resolve(climat.ID, climat.RULES.tbase),
	});
}

export function f(ctx: Context): ReturnType<typeof formulas.calcule_f> {
	return formulas.calcule_f({
		inertie: ctx.resolve(enveloppe.ID, enveloppe.RULES.inertie),
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		dh: ctx.resolve(ID, RULES.dh),
		ai: ctx.resolve(ID, RULES.ai),
		as: ctx.resolve(ID, RULES.as),
	});
}

export function as(ctx: Context): ReturnType<typeof formulas.calcule_as> {
	return formulas.calcule_as({
		sse: ctx.resolve(enveloppe.ID, enveloppe.RULES.sse),
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
	});
}

export function ai(ctx: Context): ReturnType<typeof formulas.calcule_ai> {
	return formulas.calcule_ai({
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		nadeq: ctx.resolve(ecs.ID, ecs.RULES.nadeq),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function qgw_rec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qgw_rec> {
	return formulas.calcule_qgw_rec({
		qgw: ctx.resolve(ecs.ID, ecs.RULES.qgw),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function qdw_rec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_rec> {
	return formulas.calcule_qdw_rec({
		qdw_ind_vc: ctx.resolve(ecs.ID, ecs.RULES.qdw_ind_vc),
		qdw_col_vc: ctx.resolve(ecs.ID, ecs.RULES.qdw_col_vc),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function qgen_ecs_rec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qgen_ecs_rec> {
	return formulas.calcule_qgen_ecs_rec({
		qgen: ctx.resolve(ecs.ID, ecs.RULES.qgen),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function effet_joule(
	ctx: Context,
): ReturnType<typeof formulas.calcule_effet_joule> {
	return formulas.calcule_effet_joule({
		installations: ctx.diagnostic.chauffage.installations.map(
			(installation) => ({
				surface: installation.surface,
				effet_joule: installationRules.rules.effet_joule(ctx, installation),
			}),
		),
	});
}

export function nref(ctx: Context): ReturnType<typeof formulas.calcule_nref> {
	return formulas.calcule_nref({
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
		scenario: ctx.scenario,
	});
}

export function dh(ctx: Context): ReturnType<typeof formulas.calcule_dh> {
	return formulas.calcule_dh({
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
		scenario: ctx.scenario,
	});
}

export function applique(ctx: Context): models.chauffage.ChauffageWithData {
	const sumMois = (v: models.common.ParMois<number>): number =>
		Object.values(v).reduce((s: number, n: number) => s + n, 0);
	return {
		...ctx.diagnostic.chauffage,
		data: {
			bch: sumMois(ctx.resolve(ID, RULES.bch)),
			pch: ctx.resolve(ID, RULES.pch),
			as: sumMois(ctx.resolve(ID, RULES.as)),
			ai: sumMois(ctx.resolve(ID, RULES.ai)),
			qgw_rec: sumMois(ctx.resolve(ID, RULES.qgw_rec)),
			qdw_rec: sumMois(ctx.resolve(ID, RULES.qdw_rec)),
			qgen_ecs_rec: sumMois(ctx.resolve(ID, RULES.qgen_ecs_rec)),
			effet_joule: ctx.resolve(ID, RULES.effet_joule),
		},
	};
}
