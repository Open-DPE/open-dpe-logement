import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as climat from "#rules/climat/registry.js";
import * as production from "#rules/production/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.register(ID, RULES.consommations, () => consommations(ctx));
	ctx.register(ID, RULES.cecl, () => cecl(ctx));
	ctx.register(ID, RULES.nhecl, () => nhecl(ctx));
}

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		cecl: ctx.resolve(ID, RULES.cecl),
		celec_ac: ctx.resolve(production.ID, production.RULES.celec_ac),
	});
}

export function cecl(ctx: Context): ReturnType<typeof formulas.calcule_cecl> {
	return formulas.calcule_cecl({
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		nhecl: ctx.resolve(ID, RULES.nhecl),
	});
}

export function nhecl(ctx: Context): ReturnType<typeof formulas.calcule_nhecl> {
	return formulas.calcule_nhecl({
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
	});
}
