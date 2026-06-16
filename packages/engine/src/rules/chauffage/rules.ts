import type { Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as emetteur from "./emetteur/rules.js";
import * as emission from "./emission/rules.js";
import * as generateur from "./generateur/rules.js";
import * as installation from "./installation/rules.js";
import * as systeme from "./systeme/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export { emetteur, emission, generateur, installation, systeme };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cch]: cch,
		[RULES.cch_elec]: cch_elec,
		[RULES.caux_gen]: caux_gen,
		[RULES.caux_dist]: caux_dist,
		[RULES.bch]: bch,
		[RULES.bch_hp]: bch_hp,
		[RULES.bv]: bv,
		[RULES.pch]: pch,
		[RULES.f]: f,
		[RULES.as]: as,
		[RULES.ai]: ai,
		[RULES.qgw_rec]: qgw_rec,
		[RULES.qdw_rec]: qdw_rec,
		[RULES.qgen_ecs_rec]: qgen_ecs_rec,
		[RULES.effet_joule]: effet_joule,
		[RULES.nref]: nref,
		[RULES.dh]: dh,
	},

	...emetteur.REGISTRY,
	...generateur.REGISTRY,
	...installation.REGISTRY,
	...systeme.REGISTRY,
	...emission.REGISTRY,
};

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, () =>
		formulas.calcule_consommations({
			consommations: ctx.diagnostic.chauffage.generateurs.map((item) =>
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.consommations,
					item,
				),
			),
		}),
	);
}

export function cch(ctx: Context): ReturnType<typeof formulas.calcule_cch> {
	return ctx.register(NAMESPACE, RULES.cch, () =>
		formulas.calcule_cch({
			cch: ctx.diagnostic.chauffage.generateurs.map((item) =>
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.cch,
					item,
				),
			),
		}),
	);
}
export function cch_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cch_elec> {
	return ctx.register(NAMESPACE, RULES.cch_elec, () =>
		formulas.calcule_cch_elec({
			cch_elec: ctx.diagnostic.chauffage.generateurs.map((item) =>
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.cch_elec,
					item,
				),
			),
		}),
	);
}

export function caux_gen(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return ctx.register(NAMESPACE, RULES.caux_gen, () =>
		formulas.calcule_caux_gen({
			caux_gen: ctx.diagnostic.chauffage.generateurs.map((item) =>
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.caux_gen,
					item,
				),
			),
		}),
	);
}

export function caux_dist(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, () =>
		formulas.calcule_caux_dist({
			caux_dist: ctx.diagnostic.chauffage.installations.map((item) =>
				ctx.resolve(
					constants.chauffage.installation.NAMESPACE,
					constants.chauffage.installation.RULES.caux_dist,
					item,
				),
			),
		}),
	);
}

export function bch(ctx: Context): ReturnType<typeof formulas.calcule_bch> {
	return ctx.register(NAMESPACE, RULES.bch, () =>
		formulas.calcule_bch({
			bch_hp: bch_hp(ctx),
			qgw_rec: qgw_rec(ctx),
			qdw_rec: qdw_rec(ctx),
			qgen_rec: qgen_ecs_rec(ctx),
		}),
	);
}

export function bch_hp(
	ctx: Context,
): ReturnType<typeof formulas.calcule_bch_hp> {
	return ctx.register(NAMESPACE, RULES.bch_hp, () =>
		formulas.calcule_bch_hp({
			bv: bv(ctx),
			dh: dh(ctx),
		}),
	);
}

export function bv(ctx: Context): ReturnType<typeof formulas.calcule_bv> {
	return ctx.register(NAMESPACE, RULES.bv, () =>
		formulas.calcule_bv({
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			f: f(ctx),
		}),
	);
}

export function pch(ctx: Context): ReturnType<typeof formulas.calcule_pch> {
	return ctx.register(NAMESPACE, RULES.pch, () =>
		formulas.calcule_pch({
			ratio_proratisation: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.ratio_proratisation,
			),
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			tbase: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.tbase,
			),
		}),
	);
}

export function f(ctx: Context): ReturnType<typeof formulas.calcule_f> {
	return ctx.register(NAMESPACE, RULES.f, () =>
		formulas.calcule_f({
			inertie: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.inertie,
			),
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			dh: dh(ctx),
			ai: ai(ctx),
			as: as(ctx),
		}),
	);
}

export function as(ctx: Context): ReturnType<typeof formulas.calcule_as> {
	return ctx.register(NAMESPACE, RULES.as, () =>
		formulas.calcule_as({
			sse: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.sse,
			),
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
		}),
	);
}

export function ai(ctx: Context): ReturnType<typeof formulas.calcule_ai> {
	return ctx.register(NAMESPACE, RULES.ai, () =>
		formulas.calcule_ai({
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			nadeq: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.nadeq),
			nref: nref(ctx),
		}),
	);
}

export function qgw_rec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qgw_rec> {
	return ctx.register(NAMESPACE, RULES.qgw_rec, () =>
		formulas.calcule_qgw_rec({
			qgw: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.qgw),
			nref: nref(ctx),
		}),
	);
}

export function qdw_rec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_rec> {
	return ctx.register(NAMESPACE, RULES.qdw_rec, () =>
		formulas.calcule_qdw_rec({
			qdw_ind_vc: ctx.resolve(
				constants.ecs.NAMESPACE,
				constants.ecs.RULES.qdw_ind_vc,
			),
			qdw_col_vc: ctx.resolve(
				constants.ecs.NAMESPACE,
				constants.ecs.RULES.qdw_col_vc,
			),
			nref: nref(ctx),
		}),
	);
}

export function qgen_ecs_rec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qgen_ecs_rec> {
	return ctx.register(NAMESPACE, RULES.qgen_ecs_rec, () =>
		formulas.calcule_qgen_ecs_rec({
			qgen: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.qgen),
			nref: nref(ctx),
		}),
	);
}

export function effet_joule(
	ctx: Context,
): ReturnType<typeof formulas.calcule_effet_joule> {
	return ctx.register(NAMESPACE, RULES.effet_joule, () =>
		formulas.calcule_effet_joule({
			installations: ctx.diagnostic.chauffage.installations.map((item) => ({
				surface: item.surface,
				effet_joule: ctx.resolve(
					constants.chauffage.installation.NAMESPACE,
					constants.chauffage.installation.RULES.effet_joule,
					item,
				),
			})),
		}),
	);
}
export function nref(ctx: Context): ReturnType<typeof formulas.calcule_nref> {
	return ctx.register(NAMESPACE, RULES.nref, () =>
		formulas.calcule_nref({
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
			scenario: ctx.scenario,
		}),
	);
}

export function dh(ctx: Context): ReturnType<typeof formulas.calcule_dh> {
	return ctx.register(NAMESPACE, RULES.dh, () =>
		formulas.calcule_dh({
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
			scenario: ctx.scenario,
		}),
	);
}
