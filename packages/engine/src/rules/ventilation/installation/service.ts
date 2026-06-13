import * as models from "@open-dpe-logement/models";
import { type Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	installation: models.ventilation.installation.Installation,
): models.ventilation.installation.InstallationWithData {
	const debits = ctx.resolve(NAMESPACE, RULES.debits, installation);

	return {
		...installation,

		data: {
			consommations: ctx.resolve(NAMESPACE, RULES.consommations, installation),
			pvent_moy: ctx.resolve(NAMESPACE, RULES.pvent_moy, installation),
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, installation),
			qvarep_conv: debits.qvarep_conv,
			qvasouf_conv: debits.qvasouf_conv,
			smea_conv: debits.smea_conv,
			hvent: ctx.resolve(NAMESPACE, RULES.hvent, installation),
		},
	};
}
