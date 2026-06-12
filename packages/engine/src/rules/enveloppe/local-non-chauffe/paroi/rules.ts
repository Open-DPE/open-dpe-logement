import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Paroi = models.enveloppe.localNonChauffe.Paroi;

export function aue(
	ctx: Context,
	item: Paroi,
): ReturnType<typeof formulas.calcule_aue> {
	return ctx.register(NAMESPACE, RULES.aue, item, () =>
		formulas.calcule_aue({
			mitoyennete: item.position.mitoyennete,
			surface: item.position.surface,
		}),
	);
}

export function aiu(
	ctx: Context,
	item: Paroi,
): ReturnType<typeof formulas.calcule_aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () =>
		formulas.calcule_aiu({
			mitoyennete: item.position.mitoyennete,
			surface: item.position.surface,
		}),
	);
}

export function isolation(
	item: Paroi,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({ isolation: item.isolation });
}
