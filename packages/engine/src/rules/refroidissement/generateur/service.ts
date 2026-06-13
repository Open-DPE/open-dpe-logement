import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	generateur: models.refroidissement.generateur.Generateur,
): models.refroidissement.generateur.GenerateurWithData {
	return {
		...generateur,

		data: {
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, generateur),
			eer: ctx.resolve(NAMESPACE, RULES.eer, generateur),
			consommations: ctx.resolve(NAMESPACE, RULES.consommations, generateur),
		},
	};
}
