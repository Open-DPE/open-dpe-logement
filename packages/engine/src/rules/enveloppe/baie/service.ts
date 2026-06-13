import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

type Baie = models.enveloppe.baie.Baie;

export function calcule(
	ctx: Context,
	baie: Baie,
): models.enveloppe.baie.BaieWithData {
	return {
		...baie,

		data: {
			u: ctx.resolve(NAMESPACE, RULES.u, baie),
			b: ctx.resolve(NAMESPACE, RULES.b, baie),
			sdep: ctx.resolve(NAMESPACE, RULES.sdep, baie),
			dp: ctx.resolve(NAMESPACE, RULES.dp, baie),
			deltar: ctx.resolve(NAMESPACE, RULES.deltar, baie),
			uw: ctx.resolve(NAMESPACE, RULES.uw, baie),
			ug: ctx.resolve(NAMESPACE, RULES.ug, baie),
			sw: ctx.resolve(NAMESPACE, RULES.sw, baie),
			fe: ctx.resolve(NAMESPACE, RULES.fe, baie),
			sse: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.sse, baie)),
		},
	};
}
