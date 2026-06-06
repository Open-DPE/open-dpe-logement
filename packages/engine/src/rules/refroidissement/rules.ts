import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as climat from "#rules/climat/registry.js";
import * as ecs from "#rules/ecs/registry.js";
import * as enveloppe from "#rules/enveloppe/registry.js";
import * as generateur from "./generateur/index.js";
import * as installation from "./installation/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	generateur.rules.register(ctx);
	installation.rules.register(ctx);

	ctx.register(ID, RULES.consommations, () => consommations(ctx));
	ctx.register(ID, RULES.cfr, () => cfr(ctx));
	ctx.register(ID, RULES.cfr_elec, () => cfr_elec(ctx));
	ctx.register(ID, RULES.caux, () => caux(ctx));
	ctx.register(ID, RULES.bfr, () => bfr(ctx));
	ctx.register(ID, RULES.fut, () => fut(ctx));
	ctx.register(ID, RULES.rbth, () => rbth(ctx));
	ctx.register(ID, RULES.as, () => as(ctx));
	ctx.register(ID, RULES.ai, () => ai(ctx));
	ctx.register(ID, RULES.e, () => e(ctx));
	ctx.register(ID, RULES.textmoy, () => textmoy(ctx));
	ctx.register(ID, RULES.nref, () => nref(ctx));
	ctx.register(ID, RULES.tint, () => tint(ctx));
	ctx.register(ID, RULES.t, () => t(ctx));
	ctx.register(ID, RULES.cin, () => cin(ctx));
}

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		consommations: ctx.diagnostic.refroidissement.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.consommations, item),
		),
	});
}

export function cfr(ctx: Context): ReturnType<typeof formulas.calcule_cfr> {
	return formulas.calcule_cfr({
		cfr: ctx.diagnostic.refroidissement.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.cfr, item),
		),
	});
}

export function cfr_elec(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cfr_elec> {
	return formulas.calcule_cfr_elec({
		cfr_elec: ctx.diagnostic.refroidissement.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.cfr_elec, item),
		),
	});
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return formulas.calcule_caux({
		caux: ctx.diagnostic.refroidissement.generateurs.map((item) =>
			ctx.resolve(generateur.ID, generateur.RULES.caux, item),
		),
	});
}

export function bfr(ctx: Context): ReturnType<typeof formulas.calcule_bfr> {
	return formulas.calcule_bfr({
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		tint: ctx.resolve(ID, RULES.tint),
		as: ctx.resolve(ID, RULES.as),
		ai: ctx.resolve(ID, RULES.ai),
		fut: ctx.resolve(ID, RULES.fut),
		rbth: ctx.resolve(ID, RULES.rbth),
		textmoy: ctx.resolve(ID, RULES.textmoy),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function fut(ctx: Context): ReturnType<typeof formulas.calcule_fut> {
	return formulas.calcule_fut({
		rbth: ctx.resolve(ID, RULES.rbth),
		t: ctx.resolve(ID, RULES.t),
	});
}

export function rbth(ctx: Context): ReturnType<typeof formulas.calcule_rbth> {
	return formulas.calcule_rbth({
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		as: ctx.resolve(ID, RULES.as),
		ai: ctx.resolve(ID, RULES.ai),
		cin: ctx.resolve(ID, RULES.cin),
		tint: ctx.resolve(ID, RULES.tint),
		textmoy: ctx.resolve(ID, RULES.textmoy),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function as(ctx: Context): ReturnType<typeof formulas.calcule_as> {
	return formulas.calcule_as({
		sse: ctx.resolve(enveloppe.ID, enveloppe.RULES.sse),
		e: ctx.resolve(ID, RULES.e),
	});
}

export function ai(ctx: Context): ReturnType<typeof formulas.calcule_ai> {
	return formulas.calcule_ai({
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		nadeq: ctx.resolve(ecs.ID, ecs.RULES.nadeq),
		nref: ctx.resolve(ID, RULES.nref),
	});
}

export function e(ctx: Context): ReturnType<typeof formulas.calcule_e> {
	return formulas.calcule_e({
		scenario: ctx.scenario,
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
	});
}

export function textmoy(
	ctx: Context,
): ReturnType<typeof formulas.calcule_textmoy> {
	return formulas.calcule_textmoy({
		scenario: ctx.scenario,
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
	});
}

export function nref(ctx: Context): ReturnType<typeof formulas.calcule_nref> {
	return formulas.calcule_nref({
		scenario: ctx.scenario,
		sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
	});
}

export function tint(ctx: Context): ReturnType<typeof formulas.calcule_tint> {
	return formulas.calcule_tint({ scenario: ctx.scenario });
}

export function t(ctx: Context): ReturnType<typeof formulas.calcule_t> {
	return formulas.calcule_t({
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		cin: ctx.resolve(ID, RULES.cin),
	});
}

export function cin(ctx: Context): ReturnType<typeof formulas.calcule_cin> {
	return formulas.calcule_cin({
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		inertie: ctx.resolve(enveloppe.ID, enveloppe.RULES.inertie),
	});
}

export function applique(ctx: Context): models.refroidissement.RefroidissementWithData {
	const sumMois = (v: models.common.ParMois<number>): number =>
		Object.values(v).reduce((s: number, n: number) => s + n, 0);
	return {
		...ctx.diagnostic.refroidissement,
		data: {
			bfr: sumMois(ctx.resolve(ID, RULES.bfr)),
			as: sumMois(ctx.resolve(ID, RULES.as)),
			ai: sumMois(ctx.resolve(ID, RULES.ai)),
		},
	};
}
