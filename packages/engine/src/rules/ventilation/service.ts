import * as models from "@open-dpe-logement/models";
import { type Context } from "#core/context.js";
import * as installation from "./installation/service.js";
import { NAMESPACE, RULES } from "./constants.js";

export { installation };

export function calcule(ctx: Context): models.ventilation.VentilationWithData {
	const installations = ctx.diagnostic.ventilation.installations.map((item) =>
		installation.calcule(ctx, item),
	);

	return {
		...ctx.diagnostic.ventilation,

		installations: models.common.toNonEmptyArray(installations),

		data: {
			qvarep_conv: ctx.resolve(NAMESPACE, RULES.qvarep_conv),
			qvasouf_conv: ctx.resolve(NAMESPACE, RULES.qvasouf_conv),
			smea_conv: ctx.resolve(NAMESPACE, RULES.smea_conv),
		},
	};
}
