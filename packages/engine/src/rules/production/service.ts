import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as panneauPhotovoltaique from "./panneau-photovoltaique/service.js";
import { NAMESPACE, RULES } from "./constants.js";

export { panneauPhotovoltaique };

export function calcule(ctx: Context): models.production.ProductionWithData {
	return {
		...ctx.diagnostic.production,

		panneaux_photovoltaiques:
			ctx.diagnostic.production.panneaux_photovoltaiques.map((item) =>
				panneauPhotovoltaique.calcule(ctx, item),
			),

		data: {
			ppv: ctx.resolve(NAMESPACE, RULES.ppv),
			celec_ac: ctx.resolve(NAMESPACE, RULES.celec_ac_total),
			tapl: ctx.resolve(NAMESPACE, RULES.tapl),
		},
	};
}
