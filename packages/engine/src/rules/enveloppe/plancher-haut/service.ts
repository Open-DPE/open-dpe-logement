import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.plancherHaut.PlancherHaut,
): models.enveloppe.plancherHaut.PlancherHautWithData {
	return {
		...item,

		data: {
			sdep: ctx.resolve(NAMESPACE, RULES.sdep, item),
			b: ctx.resolve(NAMESPACE, RULES.b, item),
			u: ctx.resolve(NAMESPACE, RULES.u, item),
			u0: ctx.resolve(NAMESPACE, RULES.u0, item),
			dp: ctx.resolve(NAMESPACE, RULES.dp, item),
		},
	};
}
