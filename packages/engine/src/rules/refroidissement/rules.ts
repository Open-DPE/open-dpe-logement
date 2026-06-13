import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as generateur from "./generateur/rules.js";
import * as installation from "./installation/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export { generateur, installation };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cfr]: cfr,
		[RULES.cfr_elec]: cfr_elec,
		[RULES.caux]: caux,
		[RULES.bfr]: bfr,
		[RULES.fut]: fut,
		[RULES.rbth]: rbth,
		[RULES.as]: as,
		[RULES.ai]: ai,
		[RULES.e]: e,
		[RULES.textmoy]: textmoy,
		[RULES.nref]: nref,
		[RULES.tint]: tint,
		[RULES.t]: t,
		[RULES.cin]: cin,
	},

	...generateur.REGISTRY,
	...installation.REGISTRY,
};

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, () =>
		formulas.calcule_consommations({
			consommations: _generateurs(ctx).map(
				({ consommations }) => consommations,
			),
		}),
	);
}

export function cfr(ctx: Context): ReturnType<typeof formulas.calcule_cfr> {
	return ctx.register(NAMESPACE, RULES.cfr, () =>
		formulas.calcule_cfr({
			cfr: _generateurs(ctx).map(({ cfr }) => cfr),
		}),
	);
}

export function cfr_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cfr_elec> {
	return ctx.register(NAMESPACE, RULES.cfr_elec, () =>
		formulas.calcule_cfr_elec({
			cfr_elec: _generateurs(ctx).map(({ cfr_elec }) => cfr_elec),
		}),
	);
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, () =>
		formulas.calcule_caux({
			caux: _generateurs(ctx).map(({ caux }) => caux),
		}),
	);
}

export function bfr(ctx: Context): ReturnType<typeof formulas.calcule_bfr> {
	return ctx.register(NAMESPACE, RULES.bfr, () =>
		formulas.calcule_bfr({
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			tint: tint(ctx),
			as: as(ctx),
			ai: ai(ctx),
			fut: fut(ctx),
			rbth: rbth(ctx),
			textmoy: textmoy(ctx),
			nref: nref(ctx),
		}),
	);
}

export function fut(ctx: Context): ReturnType<typeof formulas.calcule_fut> {
	return ctx.register(NAMESPACE, RULES.fut, () =>
		formulas.calcule_fut({
			rbth: rbth(ctx),
			t: t(ctx),
		}),
	);
}

export function rbth(ctx: Context): ReturnType<typeof formulas.calcule_rbth> {
	return ctx.register(NAMESPACE, RULES.rbth, () =>
		formulas.calcule_rbth({
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			as: as(ctx),
			ai: ai(ctx),
			cin: cin(ctx),
			tint: tint(ctx),
			textmoy: textmoy(ctx),
			nref: nref(ctx),
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
			e: e(ctx),
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

export function e(ctx: Context): ReturnType<typeof formulas.calcule_e> {
	return ctx.register(NAMESPACE, RULES.e, () =>
		formulas.calcule_e({
			scenario: ctx.scenario,
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
		}),
	);
}

export function textmoy(
	ctx: Context,
): ReturnType<typeof formulas.calcule_textmoy> {
	return ctx.register(NAMESPACE, RULES.textmoy, () =>
		formulas.calcule_textmoy({
			scenario: ctx.scenario,
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
		}),
	);
}

export function nref(ctx: Context): ReturnType<typeof formulas.calcule_nref> {
	return ctx.register(NAMESPACE, RULES.nref, () =>
		formulas.calcule_nref({
			scenario: ctx.scenario,
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
		}),
	);
}

export function tint(ctx: Context): ReturnType<typeof formulas.calcule_tint> {
	return ctx.register(NAMESPACE, RULES.tint, () =>
		formulas.calcule_tint({ scenario: ctx.scenario }),
	);
}

export function t(ctx: Context): ReturnType<typeof formulas.calcule_t> {
	return ctx.register(NAMESPACE, RULES.t, () =>
		formulas.calcule_t({
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			cin: cin(ctx),
		}),
	);
}

export function cin(ctx: Context): ReturnType<typeof formulas.calcule_cin> {
	return ctx.register(NAMESPACE, RULES.cin, () =>
		formulas.calcule_cin({
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			inertie: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.inertie,
			),
		}),
	);
}

function _generateurs(ctx: Context) {
	return ctx.once(NAMESPACE, "generateurs", () =>
		ctx.diagnostic.refroidissement.generateurs.map((item) => ({
			consommations: ctx.resolve(
				constants.refroidissement.generateur.NAMESPACE,
				constants.refroidissement.generateur.RULES.consommations,
				item,
			),
			cfr: ctx.resolve(
				constants.refroidissement.generateur.NAMESPACE,
				constants.refroidissement.generateur.RULES.cfr,
				item,
			),
			cfr_elec: ctx.resolve(
				constants.refroidissement.generateur.NAMESPACE,
				constants.refroidissement.generateur.RULES.cfr_elec,
				item,
			),
			caux: ctx.resolve(
				constants.refroidissement.generateur.NAMESPACE,
				constants.refroidissement.generateur.RULES.caux,
				item,
			),
		})),
	);
}
