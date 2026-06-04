import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.refroidissement.installations.forEach((item) => {
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx, item));
	});
}

type Installation = models.refroidissement.installation.Installation;

export function rdim(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return formulas.calcule_rdim({
		surface_installation: item.surface,
		surface_installations: ctx.diagnostic.refroidissement.installations.reduce(
			(s, { surface }) => s + surface,
			0,
		),
	});
}
