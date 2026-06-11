import * as models from "@open-dpe-logement/models";
import { type Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(ctx: Context): models.batiment.BatimentWithData {
	return {
		...ctx.diagnostic.batiment,
		data: {
			sh: sh(ctx),
			hsp: hsp(ctx),
			ratio_proratisation: ratio_proratisation(ctx),
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
		},
	};
}

export function sh(ctx: Context): ReturnType<typeof formulas.calcule_sh> {
	return ctx.register(NAMESPACE, RULES.sh, () =>
		formulas.calcule_sh({
			sh_batiment: ctx.diagnostic.batiment.surface_habitable,
			sh_logement: ctx.diagnostic.batiment.logement?.surface_habitable ?? null,
		}),
	);
}

export function hsp(ctx: Context): ReturnType<typeof formulas.calcule_hsp> {
	return ctx.register(NAMESPACE, RULES.hsp, () =>
		formulas.calcule_hsp({
			hsp_batiment: ctx.diagnostic.batiment.hauteur_sous_plafond,
			hsp_logement:
				ctx.diagnostic.batiment.logement?.hauteur_sous_plafond ?? null,
		}),
	);
}

export function ratio_proratisation(
	ctx: Context,
): ReturnType<typeof formulas.calcule_ratio_proratisation> {
	return ctx.register(NAMESPACE, RULES.ratio_proratisation, () =>
		formulas.calcule_ratio_proratisation({
			sh_batiment: ctx.diagnostic.batiment.surface_habitable,
			sh_logement: ctx.diagnostic.batiment.logement?.surface_habitable ?? null,
		}),
	);
}
