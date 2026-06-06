import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as installation from "./installation/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	installation.rules.register(ctx);
	ctx.register(ID, RULES.consommations, () => consommations(ctx));
	ctx.register(ID, RULES.caux, () => caux(ctx));
	ctx.register(ID, RULES.qvarep_conv, () => qvarep_conv(ctx));
	ctx.register(ID, RULES.qvasouf_conv, () => qvasouf_conv(ctx));
	ctx.register(ID, RULES.smea_conv, () => smea_conv(ctx));
	ctx.register(ID, RULES.hvent, () => hvent(ctx));
}

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		consommations: ctx.diagnostic.ventilation.installations.map((item) =>
			ctx.resolve(installation.ID, installation.RULES.consommations, item),
		),
	});
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return formulas.calcule_caux({
		caux: ctx.diagnostic.ventilation.installations.map((item) =>
			ctx.resolve(installation.ID, installation.RULES.caux, item),
		),
	});
}

export function qvarep_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qvarep_conv> {
	return formulas.calcule_qvarep_conv({
		installations: ctx.diagnostic.ventilation.installations.map((item) => ({
			qvarep_conv: ctx.resolve(
				installation.ID,
				installation.RULES.qvarep_conv,
				item,
			),
			rdim: ctx.resolve(installation.ID, installation.RULES.rdim, item),
		})),
	});
}

export function qvasouf_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_qvasouf_conv> {
	return formulas.calcule_qvasouf_conv({
		installations: ctx.diagnostic.ventilation.installations.map((item) => ({
			qvasouf_conv: ctx.resolve(
				installation.ID,
				installation.RULES.qvasouf_conv,
				item,
			),
			rdim: ctx.resolve(installation.ID, installation.RULES.rdim, item),
		})),
	});
}

export function smea_conv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_smea_conv> {
	return formulas.calcule_smea_conv({
		installations: ctx.diagnostic.ventilation.installations.map((item) => ({
			smea_conv: ctx.resolve(
				installation.ID,
				installation.RULES.smea_conv,
				item,
			),
			rdim: ctx.resolve(installation.ID, installation.RULES.rdim, item),
		})),
	});
}

export function hvent(ctx: Context): ReturnType<typeof formulas.calcule_hvent> {
	return formulas.calcule_hvent({
		installations: ctx.diagnostic.ventilation.installations.map((item) => ({
			hvent: ctx.resolve(installation.ID, installation.RULES.hvent, item),
			rdim: ctx.resolve(installation.ID, installation.RULES.rdim, item),
		})),
	});
}

export function applique(ctx: Context): models.ventilation.VentilationWithData {
	return {
		...ctx.diagnostic.ventilation,
		data: {
			qvarep_conv: ctx.resolve(ID, RULES.qvarep_conv),
			qvasouf_conv: ctx.resolve(ID, RULES.qvasouf_conv),
			smea_conv: ctx.resolve(ID, RULES.smea_conv),
		},
	};
}
