import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.ecs.generateur.Generateur,
): models.ecs.generateur.GenerateurWithData {
	const combustion = ctx.resolve(NAMESPACE, RULES.combustion, item);
	return {
		...item,

		data: {
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, item),
			pn: ctx.resolve(NAMESPACE, RULES.pn, item),
			pdim: ctx.resolve(NAMESPACE, RULES.pdim, item),
			pecs: ctx.resolve(NAMESPACE, RULES.pecs, item),
			paux: ctx.resolve(NAMESPACE, RULES.paux, item),
			cop: ctx.resolve(NAMESPACE, RULES.cop, item),
			rpn: combustion?.rpn ?? null,
			qp0: combustion?.qp0 ?? null,
			pveilleuse: combustion?.pveilleuse ?? null,
			cr: ctx.resolve(NAMESPACE, RULES.cr, item),
			qgw: ctx.resolve(NAMESPACE, RULES.qgw, item),
			qgen: ctx.resolve(NAMESPACE, RULES.qgen, item),
			consommations: ctx.resolve(NAMESPACE, RULES.consommations, item),
		},
	};
}
