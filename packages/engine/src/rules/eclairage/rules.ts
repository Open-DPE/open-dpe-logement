import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as climat from "#rules/climat/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.register(ID, RULES.cecl, () => cecl(ctx));
	ctx.register(ID, RULES.nhecl, () => nhecl(ctx));
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
