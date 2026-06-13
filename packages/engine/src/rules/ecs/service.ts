import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

import * as generateur from "./generateur/service.js";
import * as installation from "./installation/service.js";
import * as systeme from "./systeme/service.js";

export { generateur, installation, systeme };

export function calcule(ctx: Context): models.ecs.EcsWithData {
	const generateurs = ctx.diagnostic.ecs.generateurs.map((item) =>
		generateur.calcule(ctx, item),
	);
	const installations = ctx.diagnostic.ecs.installations.map((item) =>
		installation.calcule(ctx, item),
	);
	return {
		...ctx.diagnostic.ecs,

		generateurs: models.common.toNonEmptyArray(generateurs),
		installations: models.common.toNonEmptyArray(installations),

		data: {
			becs: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.becs)),
			nadeq: ctx.resolve(NAMESPACE, RULES.nadeq),
			nmax: ctx.resolve(NAMESPACE, RULES.nmax),
			qgw: ctx.resolve(NAMESPACE, RULES.qgw),
			qgen: ctx.resolve(NAMESPACE, RULES.qgen),
			qdw_ind_vc: ctx.resolve(NAMESPACE, RULES.qdw_ind_vc),
			qdw_col_vc: ctx.resolve(NAMESPACE, RULES.qdw_col_vc),
			qdw_col_hvc: ctx.resolve(NAMESPACE, RULES.qdw_col_hvc),
		},
	};
}
