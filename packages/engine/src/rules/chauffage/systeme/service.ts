import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.chauffage.systeme.Systeme,
): models.chauffage.systeme.SystemeWithData {
	return {
		...item,

		data: {
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, item),
			pch: ctx.resolve(NAMESPACE, RULES.pch, item),
			int: ctx.resolve(NAMESPACE, RULES.int, item),
			ich: ctx.resolve(NAMESPACE, RULES.ich, item),
			rd: ctx.resolve(NAMESPACE, RULES.rd, item),
			re: ctx.resolve(NAMESPACE, RULES.re, item),
			rg: ctx.resolve(NAMESPACE, RULES.rg, item),
			rr: ctx.resolve(NAMESPACE, RULES.rr, item),
			pcircem: ctx.resolve(NAMESPACE, RULES.pcircem, item),
			consommations: ctx.resolve(NAMESPACE, RULES.consommations, item),
		},
	};
}
