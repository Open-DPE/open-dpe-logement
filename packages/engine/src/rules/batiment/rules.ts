import { type Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.sh]: sh,
		[RULES.hsp]: hsp,
		[RULES.ratio_proratisation]: ratio_proratisation,
	},
};

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
