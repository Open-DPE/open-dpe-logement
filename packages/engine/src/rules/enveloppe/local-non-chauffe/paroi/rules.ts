import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

type Paroi = models.enveloppe.localNonChauffe.Paroi;

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.locaux_non_chauffes.forEach((lnc) => {
		lnc.parois.forEach((item) => {
			ctx.register(ID, RULES.aue, item, () => aue(item));
			ctx.register(ID, RULES.aiu, item, () => aiu(item));
		});
	});
}

export function aue(item: Paroi): ReturnType<typeof formulas.calcule_aue> {
	return formulas.calcule_aue({
		mitoyennete: item.position.mitoyennete,
		surface: item.position.surface,
	});
}

export function aiu(item: Paroi): ReturnType<typeof formulas.calcule_aiu> {
	return formulas.calcule_aiu({
		mitoyennete: item.position.mitoyennete,
		surface: item.position.surface,
	});
}

export function isolation(
	item: Paroi,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({ isolation: item.isolation });
}
