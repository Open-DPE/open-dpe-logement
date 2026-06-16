import { type Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as installation from "./installation/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export { installation };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.caux]: caux,
		[RULES.qvarep_conv]: qvarep_conv,
		[RULES.qvasouf_conv]: qvasouf_conv,
		[RULES.smea_conv]: smea_conv,
		[RULES.hvent]: hvent,
	},

	...installation.REGISTRY,
};

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, () =>
		formulas.calcule_consommations({
			consommations: ctx.diagnostic.ventilation.installations.map((item) =>
				ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.consommations,
					item,
				),
			),
		}),
	);
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, () =>
		formulas.calcule_caux({
			caux: ctx.diagnostic.ventilation.installations.map((item) =>
				ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.caux,
					item,
				),
			),
		}),
	);
}

export function qvarep_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qvarep_conv> {
	return ctx.register(NAMESPACE, RULES.qvarep_conv, () =>
		formulas.calcule_qvarep_conv({
			installations: ctx.diagnostic.ventilation.installations.map((item) => ({
				rdim: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.rdim,
					item,
				),
				qvarep_conv: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.debits,
					item,
				).qvarep_conv,
			})),
		}),
	);
}

export function qvasouf_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qvasouf_conv> {
	return ctx.register(NAMESPACE, RULES.qvasouf_conv, () =>
		formulas.calcule_qvasouf_conv({
			installations: ctx.diagnostic.ventilation.installations.map((item) => ({
				rdim: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.rdim,
					item,
				),
				qvasouf_conv: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.debits,
					item,
				).qvasouf_conv,
			})),
		}),
	);
}

export function smea_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_smea_conv> {
	return ctx.register(NAMESPACE, RULES.smea_conv, () =>
		formulas.calcule_smea_conv({
			installations: ctx.diagnostic.ventilation.installations.map((item) => ({
				rdim: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.rdim,
					item,
				),
				smea_conv: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.debits,
					item,
				).smea_conv,
			})),
		}),
	);
}

export function hvent(ctx: Context): ReturnType<typeof formulas.calcule_hvent> {
	return ctx.register(NAMESPACE, RULES.hvent, () =>
		formulas.calcule_hvent({
			installations: ctx.diagnostic.ventilation.installations.map((item) => ({
				...item,
				rdim: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.rdim,
					item,
				),
				hvent: ctx.resolve(
					constants.ventilation.installation.NAMESPACE,
					constants.ventilation.installation.RULES.hvent,
					item,
				),
			})),
		}),
	);
}
