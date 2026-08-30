import * as models from "@open-dpe-logement/models";
import type { Context } from "../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

import * as emetteur from "./emetteur/service.js";
import * as generateur from "./generateur/service.js";
import * as installation from "./installation/service.js";
import * as systeme from "./systeme/service.js";

export { emetteur, generateur, installation, systeme };

export function calcule(ctx: Context): models.chauffage.ChauffageWithData {
	return {
		...ctx.diagnostic.chauffage,

		emetteurs: ctx.diagnostic.chauffage.emetteurs.map((item) =>
			emetteur.calcule(ctx, item),
		),

		generateurs: ctx.diagnostic.chauffage.generateurs.map((item) =>
			generateur.calcule(ctx, item),
		),

		installations: ctx.diagnostic.chauffage.installations.map((item) =>
			installation.calcule(ctx, item),
		),

		data: {
			bch: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.bch)),
			pch: ctx.resolve(NAMESPACE, RULES.pch),
			as: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.as)),
			ai: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.ai)),
			qgw_rec: models.common.reduceParMois(
				ctx.resolve(NAMESPACE, RULES.qgw_rec),
			),
			qdw_rec: models.common.reduceParMois(
				ctx.resolve(NAMESPACE, RULES.qdw_rec),
			),
			qgen_ecs_rec: models.common.reduceParMois(
				ctx.resolve(NAMESPACE, RULES.qgen_ecs_rec),
			),
			effet_joule: ctx.resolve(NAMESPACE, RULES.effet_joule),
		},
	};
}
