import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.enveloppe.niveau.Niveau,
): models.enveloppe.niveau.NiveauWithData {
	return {
		...item,

		data: {
			inertie: ctx.resolve(NAMESPACE, RULES.inertie, item),
		},
	};
}
