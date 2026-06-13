import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.localNonChauffe.LocalNonChauffe,
): models.enveloppe.localNonChauffe.LocalNonChauffeWithData {
	return {
		...item,

		data: {
			b: ctx.resolve(NAMESPACE, RULES.b, item),
			aiu: ctx.resolve(NAMESPACE, RULES.aiu, item),
			aue: ctx.resolve(NAMESPACE, RULES.aue, item),
			isolation_aiu: ctx.resolve(NAMESPACE, RULES.isolation_aiu, item),
			isolation_aue: ctx.resolve(NAMESPACE, RULES.isolation_aue, item),
			sse: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.sse, item)),
			orientations: ctx.resolve(NAMESPACE, RULES.orientations, item),
			t: ctx.resolve(NAMESPACE, RULES.t, item),
		},
	};
}
