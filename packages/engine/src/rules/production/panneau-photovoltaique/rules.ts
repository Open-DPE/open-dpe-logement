import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type PanneauPhotovoltaique =
	models.production.panneauPhotovoltaique.PanneauPhotovoltaique;

export function calcule(
	ctx: Context,
	panneau: PanneauPhotovoltaique,
): models.production.panneauPhotovoltaique.PanneauPhotovoltaiqueData {
	return {
		ppv: models.common.reduceParMois(ppv(ctx, panneau)),
		kpv: kpv(ctx, panneau),
	};
}

export function ppv(
	ctx: Context,
	panneau: PanneauPhotovoltaique,
): ReturnType<typeof formulas.calcule_ppv> {
	return ctx.register(NAMESPACE, RULES.ppv, () =>
		formulas.calcule_ppv({
			spv: formulas.set_spv({
				surface: panneau.surface,
				modules: panneau.modules,
			}),
			kpv: kpv(ctx, panneau),
			epv: ctx.resolve(constants.climat.NAMESPACE, constants.climat.RULES.epv),
		}),
	);
}

export function kpv(
	ctx: Context,
	panneau: PanneauPhotovoltaique,
): ReturnType<typeof formulas.calcule_kpv> {
	return ctx.register(NAMESPACE, RULES.kpv, () =>
		formulas.calcule_kpv({
			orientation_pv: panneau.orientation,
			inclinaison_pv: panneau.inclinaison,
		}),
	);
}
