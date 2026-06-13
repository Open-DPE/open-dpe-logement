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
			consommations: _installations(ctx).map(
				({ consommations }) => consommations,
			),
		}),
	);
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, () =>
		formulas.calcule_caux({
			caux: _installations(ctx).map(({ caux }) => caux),
		}),
	);
}

export function qvarep_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qvarep_conv> {
	return ctx.register(NAMESPACE, RULES.qvarep_conv, () =>
		formulas.calcule_qvarep_conv({
			installations: _installations(ctx).map(({ debits, rdim }) => ({
				rdim,
				qvarep_conv: debits.qvarep_conv,
			})),
		}),
	);
}

export function qvasouf_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qvasouf_conv> {
	return ctx.register(NAMESPACE, RULES.qvasouf_conv, () =>
		formulas.calcule_qvasouf_conv({
			installations: _installations(ctx).map(({ debits, rdim }) => ({
				rdim,
				qvasouf_conv: debits.qvasouf_conv,
			})),
		}),
	);
}

export function smea_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_smea_conv> {
	return ctx.register(NAMESPACE, RULES.smea_conv, () =>
		formulas.calcule_smea_conv({
			installations: _installations(ctx).map(({ debits, rdim }) => ({
				rdim,
				smea_conv: debits.smea_conv,
			})),
		}),
	);
}

export function hvent(ctx: Context): ReturnType<typeof formulas.calcule_hvent> {
	return ctx.register(NAMESPACE, RULES.hvent, () =>
		formulas.calcule_hvent({ installations: _installations(ctx) }),
	);
}

function _installations(ctx: Context) {
	return ctx.once(NAMESPACE, "installations", () =>
		ctx.diagnostic.ventilation.installations.map((item) => ({
			rdim: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.rdim,
				item,
			),
			rut: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.rut,
				item,
			),
			pvent_moy: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.pvent_moy,
				item,
			),
			consommations: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.consommations,
				item,
			),
			caux: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.caux,
				item,
			),
			caux_enr: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.caux_enr,
				item,
			),
			debits: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.debits,
				item,
			),
			hvent: ctx.resolve(
				constants.ventilation.installation.NAMESPACE,
				constants.ventilation.installation.RULES.hvent,
				item,
			),
		})),
	);
}
