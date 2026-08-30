import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.ecs.systeme.Systeme,
): models.ecs.systeme.SystemeWithData {
	const { rd, rs, rg, rgs } = ctx.resolve(NAMESPACE, RULES.rendements, item);

	return {
		...item,
		data: {
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, item),
			iecs: ctx.resolve(NAMESPACE, RULES.iecs, item),
			rd,
			rs,
			rg,
			rgs,
			qcirb: ctx.resolve(NAMESPACE, RULES.qcirb, item),
			qtrac: ctx.resolve(NAMESPACE, RULES.qtrac, item),
			consommations: ctx.resolve(NAMESPACE, RULES.consommations, item),
		},
	};
}
