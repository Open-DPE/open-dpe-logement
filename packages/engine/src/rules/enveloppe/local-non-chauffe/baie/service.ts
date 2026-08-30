import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.localNonChauffe.baie.Baie,
): models.enveloppe.localNonChauffe.baie.BaieWithData {
	return {
		...item,

		data: {
			aiu: ctx.resolve(NAMESPACE, RULES.aiu, item),
			aue: ctx.resolve(NAMESPACE, RULES.aue, item),
			sst: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.sst, item)),
			t: ctx.resolve(NAMESPACE, RULES.t, item),
		},
	};
}
