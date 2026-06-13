import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.ppv]: ppv,
		[RULES.kpv]: kpv,
	},
};

type PanneauPhotovoltaique =
	models.production.panneauPhotovoltaique.PanneauPhotovoltaique;

export function ppv(
	ctx: Context,
	item: PanneauPhotovoltaique,
): ReturnType<typeof formulas.calcule_ppv> {
	return ctx.register(NAMESPACE, RULES.ppv, item, () =>
		formulas.calcule_ppv({
			spv: formulas.set_spv({
				surface: item.surface,
				modules: item.modules,
			}),
			kpv: kpv(ctx, item),
			epv: ctx.resolve(constants.climat.NAMESPACE, constants.climat.RULES.epv),
		}),
	);
}

export function kpv(
	ctx: Context,
	item: PanneauPhotovoltaique,
): ReturnType<typeof formulas.calcule_kpv> {
	return ctx.register(NAMESPACE, RULES.kpv, item, () =>
		formulas.calcule_kpv({
			orientation_pv: item.orientation,
			inclinaison_pv: item.inclinaison,
		}),
	);
}
