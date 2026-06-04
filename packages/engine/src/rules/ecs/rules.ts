import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as climat from "#rules/climat/registry.js";
import * as generateur from "./generateur/index.js";
import * as installation from "./installation/index.js";
import * as systeme from "./systeme/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	generateur.rules.register(ctx);
	installation.rules.register(ctx);
	systeme.rules.register(ctx);

	ctx.register(ID, RULES.cecs, () => cecs(ctx));
	ctx.register(ID, RULES.cecs_elec, () => cecs_elec(ctx));
	ctx.register(ID, RULES.caux, () => caux(ctx));
	ctx.register(ID, RULES.caux_gen, () => caux_gen(ctx));
	ctx.register(ID, RULES.caux_dist, () => caux_dist(ctx));
	ctx.register(ID, RULES.qgw, () => qgw(ctx));
	ctx.register(ID, RULES.qgen, () => qgen(ctx));
	ctx.register(ID, RULES.qdw_ind_vc, () => qdw_ind_vc(ctx));
	ctx.register(ID, RULES.qdw_col_vc, () => qdw_col_vc(ctx));
	ctx.register(ID, RULES.qdw_col_hvc, () => qdw_col_hvc(ctx));
	ctx.register(ID, RULES.becs, () => becs(ctx));
	ctx.register(ID, RULES.nadeq, () => nadeq(ctx));
	ctx.register(ID, RULES.nmax, () => nmax(ctx));
}

export function cecs(ctx: Context): ReturnType<typeof formulas.calcule_cecs> {
	return formulas.calcule_cecs({
		cecs: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.cecs, item),
		),
	});
}

export function cecs_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	return formulas.calcule_cecs_elec({
		generateurs: ctx.diagnostic.ecs.generateurs.map((item) => ({
			cecs: ctx.resolve(generateur.ID, generateur.RULES.cecs, item),
			energie: generateur.rules.energie_generateur(item),
		})),
	});
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return formulas.calcule_caux({
		caux_gen: ctx.resolve(ID, RULES.caux_gen),
		caux_dist: ctx.resolve(ID, RULES.caux_dist),
	});
}

export function caux_gen(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return formulas.calcule_caux_gen({
		caux: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.caux, item),
		),
	});
}

export function caux_dist(
	ctx: Context,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return formulas.calcule_caux_dist({
		caux_dist: ctx.diagnostic.ecs.installations.map((item) =>
			ctx.resolve(installation.ID, installation.RULES.caux_dist, item),
		),
	});
}

export function qgw(ctx: Context): ReturnType<typeof formulas.calcule_qgw> {
	return formulas.calcule_qgw({
		qgw: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.qgw, item),
		),
	});
}

export function qgen(ctx: Context): ReturnType<typeof formulas.calcule_qgen> {
	return formulas.calcule_qgen({
		qgen: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.qgen, item),
		),
	});
}

export function qdw_ind_vc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_ind_vc> {
	return formulas.calcule_qdw_ind_vc({
		qdw_ind_vc: ctx.diagnostic.ecs.installations.map((item) =>
			ctx.resolve(installation.ID, installation.RULES.qdw_ind_vc, item),
		),
	});
}

export function qdw_col_vc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_col_vc> {
	return formulas.calcule_qdw_col_vc({
		qdw_col_vc: ctx.diagnostic.ecs.installations.map((item) =>
			ctx.resolve(installation.ID, installation.RULES.qdw_col_vc, item),
		),
	});
}

export function qdw_col_hvc(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qdw_col_hvc> {
	return formulas.calcule_qdw_col_hvc({
		qdw_col_hvc: ctx.diagnostic.ecs.installations.map((item) =>
			ctx.resolve(installation.ID, installation.RULES.qdw_col_hvc, item),
		),
	});
}

export function becs(ctx: Context): ReturnType<typeof formulas.calcule_becs> {
	return formulas.calcule_becs({
		scenario: ctx.scenario,
		nadeq: ctx.resolve(ID, RULES.nadeq),
		nj: ctx.resolve(climat.ID, climat.RULES.nj),
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
	});
}

export function nadeq(ctx: Context): ReturnType<typeof formulas.calcule_nadeq> {
	return formulas.calcule_nadeq({
		logements: ctx.diagnostic.batiment.logements,
		nmax: ctx.resolve(ID, RULES.nmax),
	});
}

export function nmax(ctx: Context): ReturnType<typeof formulas.calcule_nmax> {
	return formulas.calcule_nmax({
		type_batiment: ctx.diagnostic.batiment.type,
		logements: ctx.diagnostic.batiment.logements,
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
	});
}
