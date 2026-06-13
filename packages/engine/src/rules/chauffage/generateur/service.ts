import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: models.chauffage.generateur.Generateur,
): models.chauffage.generateur.GenerateurWithData {
	const combustion = ctx.resolve(NAMESPACE, RULES.combustion, item);

	return {
		...item,

		data: {
			rdim: ctx.resolve(NAMESPACE, RULES.rdim, item),
			pn: ctx.resolve(NAMESPACE, RULES.pn, item),
			pdim: ctx.resolve(NAMESPACE, RULES.pdim, item),
			pch: ctx.resolve(NAMESPACE, RULES.pch, item),
			paux: ctx.resolve(NAMESPACE, RULES.paux, item),
			scop: ctx.resolve(NAMESPACE, RULES.scop, item),
			rpn: combustion?.rpn ?? null,
			rpint: combustion?.rpint ?? null,
			qp0: combustion?.qp0 ?? null,
			pveilleuse: combustion?.pveilleuse ?? null,
			tfonc30: ctx.resolve(NAMESPACE, RULES.tfonc30, item),
			tfonc100: ctx.resolve(NAMESPACE, RULES.tfonc100, item),
			qgen_rec: models.common.reduceParMois(
				ctx.resolve(NAMESPACE, RULES.qgen_rec, item),
			),
			qgen: ctx.resolve(NAMESPACE, RULES.qgen, item),
			consommations: ctx.resolve(NAMESPACE, RULES.consommations, item),
		},
	};
}
