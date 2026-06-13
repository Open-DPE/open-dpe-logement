import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.rdim]: rdim,
	},
};

type Installation = models.refroidissement.installation.Installation;

export function rdim(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, item, () =>
		formulas.calcule_rdim({
			surface_installation: item.surface,
			surface_installations:
				ctx.diagnostic.refroidissement.installations.reduce(
					(s, { surface }) => s + surface,
					0,
				),
		}),
	);
}
