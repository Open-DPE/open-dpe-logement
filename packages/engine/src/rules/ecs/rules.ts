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
			consommations: ctx.diagnostic.ecs.generateurs.map((item) =>
				ctx.resolve(
					constants.ecs.generateur.NAMESPACE,
					constants.ecs.generateur.RULES.consommations,
					item,
				),
			),
		}),
	);
}

export function cecs(ctx: Context): ReturnType<typeof formulas.calcule_cecs> {
	return ctx.register(NAMESPACE, RULES.cecs, () =>
		formulas.calcule_cecs({
			cecs: ctx.diagnostic.ecs.generateurs.map((item) =>
				ctx.resolve(
					constants.ecs.generateur.NAMESPACE,
					constants.ecs.generateur.RULES.cecs,
					item,
				),
			),
		}),
	);
}

export function cecs_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	return ctx.register(NAMESPACE, RULES.cecs_elec, () =>
		formulas.calcule_cecs_elec({
			cecs_elec: ctx.diagnostic.ecs.generateurs.map((item) =>
				ctx.resolve(
					constants.ecs.generateur.NAMESPACE,
					constants.ecs.generateur.RULES.cecs_elec,
					item,
				),
			),
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
			caux_gen: ctx.diagnostic.ecs.generateurs.map((item) =>
				ctx.resolve(
					constants.ecs.generateur.NAMESPACE,
					constants.ecs.generateur.RULES.caux_gen,
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
			caux_dist: ctx.diagnostic.ecs.installations.map((item) =>
				ctx.resolve(
					constants.ecs.installation.NAMESPACE,
					constants.ecs.installation.RULES.caux_dist,
					item,
				),
			),
		}),
	);
}

export function qgw(ctx: Context): ReturnType<typeof formulas.calcule_qgw> {
	return ctx.register(NAMESPACE, RULES.qgw, () =>
		formulas.calcule_qgw({
			qgw: ctx.diagnostic.ecs.generateurs.map((item) =>
				ctx.resolve(
					constants.ecs.generateur.NAMESPACE,
					constants.ecs.generateur.RULES.qgw,
					item,
				),
			),
		}),
	);
}

export function qgen(ctx: Context): ReturnType<typeof formulas.calcule_qgen> {
	return ctx.register(NAMESPACE, RULES.qgen, () =>
		formulas.calcule_qgen({
			qgen: ctx.diagnostic.ecs.generateurs.map((item) =>
				ctx.resolve(
					constants.ecs.generateur.NAMESPACE,
					constants.ecs.generateur.RULES.qgen,
					item,
				),
			),
		}),
	);
}

export function qdw_ind_vc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_ind_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_ind_vc, () =>
		formulas.calcule_qdw_ind_vc({
			qdw_ind_vc: ctx.diagnostic.ecs.installations.map((item) =>
				ctx.resolve(
					constants.ecs.installation.NAMESPACE,
					constants.ecs.installation.RULES.qdw_ind_vc,
					item,
				),
			),
		}),
	);
}

export function qdw_col_vc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_col_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_vc, () =>
		formulas.calcule_qdw_col_vc({
			qdw_col_vc: ctx.diagnostic.ecs.installations.map((item) =>
				ctx.resolve(
					constants.ecs.installation.NAMESPACE,
					constants.ecs.installation.RULES.qdw_col_vc,
					item,
				),
			),
		}),
	);
}

export function qdw_col_hvc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_col_hvc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_hvc, () =>
		formulas.calcule_qdw_col_hvc({
			qdw_col_hvc: ctx.diagnostic.ecs.installations.map((item) =>
				ctx.resolve(
					constants.ecs.installation.NAMESPACE,
					constants.ecs.installation.RULES.qdw_col_hvc,
					item,
				),
			),
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
