import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	installation: models.refroidissement.installation.Installation,
): models.refroidissement.installation.InstallationWithData {
	return {
		...installation,
		data: {
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, installation),
		},
	};
}
