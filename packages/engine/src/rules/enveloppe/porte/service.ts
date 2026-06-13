import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.porte.Porte,
): models.enveloppe.porte.PorteWithData {
	return {
		...item,

		data: {
			sdep: ctx.resolve(NAMESPACE, RULES.sdep, item),
			b: ctx.resolve(NAMESPACE, RULES.b, item),
			u: ctx.resolve(NAMESPACE, RULES.u, item),
			dp: ctx.resolve(NAMESPACE, RULES.dp, item),
		},
	};
}
