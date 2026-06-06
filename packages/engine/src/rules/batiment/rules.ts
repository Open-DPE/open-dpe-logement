import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.register(ID, RULES.sh, () => sh(ctx));
	ctx.register(ID, RULES.hsp, () => hsp(ctx));
	ctx.register(ID, RULES.ratio_proratisation, () => ratio_proratisation(ctx));
}

export function applique(ctx: Context): models.batiment.BatimentWithData {
	return {
		...ctx.diagnostic.batiment,
		data: {
			sh: ctx.resolve(ID, RULES.sh),
			hsp: ctx.resolve(ID, RULES.hsp),
			ratio_proratisation: ctx.resolve(ID, RULES.ratio_proratisation),
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		},
	};
}

export function sh(ctx: Context): ReturnType<typeof formulas.calcule_sh> {
	return formulas.calcule_sh({
		sh_batiment: ctx.diagnostic.batiment.surface_habitable,
		sh_logement: ctx.diagnostic.batiment.logement?.surface_habitable ?? null,
	});
}

export function hsp(ctx: Context): ReturnType<typeof formulas.calcule_hsp> {
	return formulas.calcule_hsp({
		hsp_batiment: ctx.diagnostic.batiment.hauteur_sous_plafond,
		hsp_logement:
			ctx.diagnostic.batiment.logement?.hauteur_sous_plafond ?? null,
	});
}

export function ratio_proratisation(
	ctx: Context,
): ReturnType<typeof formulas.calcule_ratio_proratisation> {
	return formulas.calcule_ratio_proratisation({
		sh_batiment: ctx.diagnostic.batiment.surface_habitable,
		sh_logement: ctx.diagnostic.batiment.logement?.surface_habitable ?? null,
	});
}
