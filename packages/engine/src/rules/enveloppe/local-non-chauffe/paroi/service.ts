import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.localNonChauffe.paroi.Paroi,
): models.enveloppe.localNonChauffe.paroi.ParoiWithData {
	return {
		...item,

		data: {
			aiu: ctx.resolve(NAMESPACE, RULES.aiu, item),
			aue: ctx.resolve(NAMESPACE, RULES.aue, item),
		},
	};
}
