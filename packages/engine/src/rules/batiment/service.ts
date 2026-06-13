import * as models from "@open-dpe-logement/models";
import { type Context } from "../../core/context.js";
import * as constants from "../constants.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(ctx: Context): models.batiment.BatimentWithData {
	return {
		...ctx.diagnostic.batiment,

		data: {
			sh: ctx.resolve(NAMESPACE, RULES.sh),
			hsp: ctx.resolve(NAMESPACE, RULES.hsp),
			ratio_proratisation: ctx.resolve(NAMESPACE, RULES.ratio_proratisation),
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
		},
	};
}
