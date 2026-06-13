import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { calcule as calculeSysteme } from "../systeme/service.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.chauffage.installation.Installation,
): models.chauffage.installation.InstallationWithData {
	const systemes = item.systemes.map((systeme) => calculeSysteme(ctx, systeme));
	return {
		...item,

		systemes: models.common.toNonEmptyArray(systemes),

		data: {
			bch: models.common.reduceParMois(ctx.resolve(NAMESPACE, RULES.bch, item)),
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, item),
			pch: ctx.resolve(NAMESPACE, RULES.pch, item),
			fch: ctx.resolve(NAMESPACE, RULES.fch, item),
		},
	};
}
