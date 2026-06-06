import * as models from "@open-dpe-logement/models";
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

	ctx.register(ID, RULES.consommations, () => consommations(ctx));
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

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		consommations: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.consommations, item),
		),
	});
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
		cecs_elec: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.cecs_elec, item),
		),
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
		caux_gen: ctx.diagnostic.ecs.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.caux_gen, item),
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

export function applique(ctx: Context): models.ecs.EcsWithData {
	const sumMois = (v: models.common.ParMois<number>): number =>
		Object.values(v).reduce((s: number, n: number) => s + n, 0);
	return {
		...ctx.diagnostic.ecs,
		data: {
			qgw: ctx.resolve(ID, RULES.qgw),
			qgen: ctx.resolve(ID, RULES.qgen),
			qdw_ind_vc: ctx.resolve(ID, RULES.qdw_ind_vc),
			qdw_col_vc: ctx.resolve(ID, RULES.qdw_col_vc),
			qdw_col_hvc: ctx.resolve(ID, RULES.qdw_col_hvc),
			becs: sumMois(ctx.resolve(ID, RULES.becs)),
			nadeq: ctx.resolve(ID, RULES.nadeq),
			nmax: ctx.resolve(ID, RULES.nmax),
		},
	};
}
