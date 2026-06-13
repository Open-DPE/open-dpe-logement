import * as models from "@open-dpe-logement/models";
import type { Context } from "../../core/context.js";
import * as generateur from "./generateur/service.js";
import * as installation from "./installation/service.js";
import { NAMESPACE, RULES } from "./constants.js";

export { generateur, installation };

export function calcule(
	ctx: Context,
): models.refroidissement.RefroidissementWithData {
	return {
		...ctx.diagnostic.refroidissement,

		installations: ctx.diagnostic.refroidissement.installations.map((item) =>
			installation.calcule(ctx, item),
		),

		generateurs: ctx.diagnostic.refroidissement.generateurs.map((item) =>
			generateur.calcule(ctx, item),
		),

		data: {
			bfr: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.bfr)),
			as: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.as)),
			ai: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.ai)),
		},
	};
}
