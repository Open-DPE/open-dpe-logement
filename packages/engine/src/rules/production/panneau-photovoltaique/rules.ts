import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context) {
	ctx.diagnostic.production.panneaux_photovoltaiques.forEach((item) => {
		ctx.register(ID, RULES.ppv, item, () => ppv(ctx, item));
		ctx.register(ID, RULES.kpv, item, () => kpv(item));
	});
}

type PanneauPhotovoltaique =
	models.production.panneauPhotovoltaique.PanneauPhotovoltaique;

export function ppv(
	ctx: Context,
	item: PanneauPhotovoltaique,
): ReturnType<typeof formulas.calcule_ppv> {
	return formulas.calcule_ppv({
		spv: formulas.set_spv({ surface: item.surface, modules: item.modules }),
		kpv: ctx.resolve(ID, RULES.kpv, item),
		epv: ctx.resolve(climat.ID, climat.RULES.epv),
	});
}

export function kpv(
	item: PanneauPhotovoltaique,
): ReturnType<typeof formulas.calcule_kpv> {
	return formulas.calcule_kpv({
		orientation: item.orientation,
		inclinaison: item.inclinaison,
	});
}
