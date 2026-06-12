import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Installation = models.refroidissement.installation.Installation;

export function calcule(
	ctx: Context,
	installation: Installation,
): models.refroidissement.installation.InstallationData {
	return {
		rdim: rdim(ctx, installation),
	};
}

export function rdim(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, installation, () =>
		formulas.calcule_rdim({
			surface_installation: installation.surface,
			surface_installations:
				ctx.diagnostic.refroidissement.installations.reduce(
					(s, { surface }) => s + surface,
					0,
				),
		}),
	);
}
