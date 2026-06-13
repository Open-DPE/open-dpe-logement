import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.chauffage.emetteur.Emetteur,
): models.chauffage.emetteur.EmetteurWithData {
	return {
		...item,

		data: {
			delta_pem: ctx.resolve(NAMESPACE, RULES.delta_pem, item),
			fcot: ctx.resolve(NAMESPACE, RULES.fcot, item),
			dtheta_dim: ctx.resolve(NAMESPACE, RULES.dtheta_dim, item),
		},
	};
}
