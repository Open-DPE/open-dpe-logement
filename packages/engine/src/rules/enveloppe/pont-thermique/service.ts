import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.pontThermique.PontThermique,
): models.enveloppe.pontThermique.PontThermiqueWithData {
	return {
		...item,

		data: {
			kpt: ctx.resolve(NAMESPACE, RULES.kpt, item),
			pt: ctx.resolve(NAMESPACE, RULES.pt, item),
		},
	};
}
