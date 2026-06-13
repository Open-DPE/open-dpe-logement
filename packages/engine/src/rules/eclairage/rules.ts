import type { Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cecl]: cecl,
		[RULES.nhecl]: nhecl,
	},
};

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, () =>
		formulas.calcule_consommations({
			cecl: cecl(ctx),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
		}),
	);
}

export function cecl(ctx: Context): ReturnType<typeof formulas.calcule_cecl> {
	return ctx.register(NAMESPACE, RULES.cecl, () =>
		formulas.calcule_cecl({
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			nhecl: nhecl(ctx),
		}),
	);
}

export function nhecl(ctx: Context): ReturnType<typeof formulas.calcule_nhecl> {
	return ctx.register(NAMESPACE, RULES.nhecl, () =>
		formulas.calcule_nhecl({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
		}),
	);
}
