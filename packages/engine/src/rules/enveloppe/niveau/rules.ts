import * as models from "@open-dpe-logement/models";
import { enveloppe } from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

type Niveau = enveloppe.niveau.Niveau;

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.niveaux.forEach((item) => {
		ctx.register(ID, RULES.inertie, item, () => inertie(item));
	});
}

export function inertie(
	item: Niveau,
): ReturnType<typeof formulas.calcule_inertie> {
	return formulas.calcule_inertie({
		inertie_paroi_verticale: formulas.set_inertie({
			inertie: item.inertie_paroi_verticale,
		}),
		inertie_plancher_haut: formulas.set_inertie({
			inertie: item.inertie_plancher_haut,
		}),
		inertie_plancher_bas: formulas.set_inertie({
			inertie: item.inertie_plancher_bas,
		}),
	});
}

export function applique(ctx: Context, item: Niveau): enveloppe.niveau.NiveauWithData {
	return {
		...item,
		data: {
			inertie: ctx.resolve(ID, RULES.inertie, item),
		},
	};
}
