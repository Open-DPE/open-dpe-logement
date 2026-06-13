import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	panneau: models.production.panneauPhotovoltaique.PanneauPhotovoltaique,
): models.production.panneauPhotovoltaique.PanneauPhotovoltaiqueWithData {
	return {
		...panneau,

		data: {
			ppv: models.common.reduceParMois(
				ctx.resolve(NAMESPACE, RULES.ppv, panneau),
			),
			kpv: ctx.resolve(NAMESPACE, RULES.kpv, panneau),
		},
	};
}
