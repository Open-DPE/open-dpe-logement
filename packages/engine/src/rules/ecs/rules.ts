import type { Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

import * as generateur from "./generateur/rules.js";
import * as installation from "./installation/rules.js";
import * as systeme from "./systeme/rules.js";

export { generateur, installation, systeme };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cecs]: cecs,
		[RULES.cecs_elec]: cecs_elec,
		[RULES.caux]: caux,
		[RULES.caux_gen]: caux_gen,
		[RULES.caux_dist]: caux_dist,
		[RULES.qgw]: qgw,
		[RULES.qgen]: qgen,
		[RULES.qdw_ind_vc]: qdw_ind_vc,
		[RULES.qdw_col_vc]: qdw_col_vc,
		[RULES.qdw_col_hvc]: qdw_col_hvc,
		[RULES.becs]: becs,
		[RULES.nadeq]: nadeq,
		[RULES.nmax]: nmax,
	},

	...generateur.REGISTRY,
	...installation.REGISTRY,
	...systeme.REGISTRY,
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

export function cecs(ctx: Context): ReturnType<typeof formulas.calcule_cecs> {
	return ctx.register(NAMESPACE, RULES.cecs, () =>
		formulas.calcule_cecs({
			cecs: _generateurs(ctx).map(({ cecs }) => cecs),
		}),
	);
}

export function cecs_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	return ctx.register(NAMESPACE, RULES.cecs_elec, () =>
		formulas.calcule_cecs_elec({
			cecs_elec: _generateurs(ctx).map(({ cecs_elec }) => cecs_elec),
		}),
	);
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, () =>
		formulas.calcule_caux({
			caux_gen: caux_gen(ctx),
			caux_dist: caux_dist(ctx),
		}),
	);
}

export function caux_gen(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return ctx.register(NAMESPACE, RULES.caux_gen, () =>
		formulas.calcule_caux_gen({
			caux_gen: _generateurs(ctx).map(({ caux_gen }) => caux_gen),
		}),
	);
}

export function caux_dist(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, () =>
		formulas.calcule_caux_dist({
			caux_dist: _installations(ctx).map(({ caux_dist }) => caux_dist),
		}),
	);
}

export function qgw(ctx: Context): ReturnType<typeof formulas.calcule_qgw> {
	return ctx.register(NAMESPACE, RULES.qgw, () =>
		formulas.calcule_qgw({
			qgw: _generateurs(ctx).map(({ qgw }) => qgw),
		}),
	);
}

export function qgen(ctx: Context): ReturnType<typeof formulas.calcule_qgen> {
	return ctx.register(NAMESPACE, RULES.qgen, () =>
		formulas.calcule_qgen({
			qgen: _generateurs(ctx).map(({ qgen }) => qgen),
		}),
	);
}

export function qdw_ind_vc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_ind_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_ind_vc, () =>
		formulas.calcule_qdw_ind_vc({
			qdw_ind_vc: _installations(ctx).map(({ qdw_ind_vc }) => qdw_ind_vc),
		}),
	);
}

export function qdw_col_vc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_col_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_vc, () =>
		formulas.calcule_qdw_col_vc({
			qdw_col_vc: _installations(ctx).map(({ qdw_col_vc }) => qdw_col_vc),
		}),
	);
}

export function qdw_col_hvc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_col_hvc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_hvc, () =>
		formulas.calcule_qdw_col_hvc({
			qdw_col_hvc: _installations(ctx).map(({ qdw_col_hvc }) => qdw_col_hvc),
		}),
	);
}

export function becs(ctx: Context): ReturnType<typeof formulas.calcule_becs> {
	return ctx.register(NAMESPACE, RULES.becs, () =>
		formulas.calcule_becs({
			scenario: ctx.scenario,
			nadeq: nadeq(ctx),
			nj: ctx.resolve(constants.climat.NAMESPACE, constants.climat.RULES.nj),
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
		}),
	);
}

export function nadeq(ctx: Context): ReturnType<typeof formulas.calcule_nadeq> {
	return ctx.register(NAMESPACE, RULES.nadeq, () =>
		formulas.calcule_nadeq({
			logements: ctx.diagnostic.batiment.logements,
			nmax: nmax(ctx),
		}),
	);
}

export function nmax(ctx: Context): ReturnType<typeof formulas.calcule_nmax> {
	return ctx.register(NAMESPACE, RULES.nmax, () =>
		formulas.calcule_nmax({
			type_batiment: ctx.diagnostic.batiment.type,
			logements: ctx.diagnostic.batiment.logements,
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
		}),
	);
}

function _generateurs(ctx: Context) {
	return ctx.once(NAMESPACE, "generateurs", () =>
		ctx.diagnostic.ecs.generateurs.map((item) => ({
			...item,
			consommations: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.consommations,
				item,
			),
			cecs: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.cecs,
				item,
			),
			cecs_elec: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.cecs_elec,
				item,
			),
			caux_gen: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.caux_gen,
				item,
			),
			qgw: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.qgw,
				item,
			),
			qgen: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.qgen,
				item,
			),
		})),
	);
}

function _installations(ctx: Context) {
	return ctx.once(NAMESPACE, "installations", () =>
		ctx.diagnostic.ecs.installations.map((item) => ({
			...item,
			caux_dist: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.caux_dist,
				item,
			),
			qdw_col_hvc: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.qdw_col_hvc,
				item,
			),
			qdw_col_vc: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.qdw_col_vc,
				item,
			),
			qdw_ind_vc: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.qdw_ind_vc,
				item,
			),
		})),
	);
}
