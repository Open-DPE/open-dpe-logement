import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Niveau = models.enveloppe.niveau.Niveau;

export function calcule(
	ctx: Context,
	item: Niveau,
): models.enveloppe.niveau.NiveauData {
	return {
		inertie: inertie(ctx, item),
	};
}

export function inertie(
	ctx: Context,
	item: Niveau,
): ReturnType<typeof formulas.calcule_inertie> {
	return ctx.register(NAMESPACE, RULES.inertie, item, () =>
		formulas.calcule_inertie({
			inertie_paroi_verticale: formulas.set_inertie({
				inertie: item.inertie_paroi_verticale,
			}),
			inertie_plancher_haut: formulas.set_inertie({
				inertie: item.inertie_plancher_haut,
			}),
			inertie_plancher_bas: formulas.set_inertie({
				inertie: item.inertie_plancher_bas,
			}),
		}),
	);
}
