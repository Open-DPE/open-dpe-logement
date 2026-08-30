import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { calcule as calcule_systeme } from "../systeme/service.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.ecs.installation.Installation,
): models.ecs.installation.InstallationWithData {
	return {
		...item,

		systemes: item.systemes.map((s) => calcule_systeme(ctx, s)),

		data: {
			becs: models.common.reduceParMois(
				ctx.resolve(NAMESPACE, RULES.becs, item),
			),
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, item),
			fecs: ctx.resolve(NAMESPACE, RULES.fecs, item),
			qdw: ctx.resolve(NAMESPACE, RULES.qdw, item),
			qdw_ind_vc: ctx.resolve(NAMESPACE, RULES.qdw_ind_vc, item),
			qdw_col_vc: ctx.resolve(NAMESPACE, RULES.qdw_col_vc, item),
			qdw_col_hvc: ctx.resolve(NAMESPACE, RULES.qdw_col_hvc, item),
		},
	};
}
