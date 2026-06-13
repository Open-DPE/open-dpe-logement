import * as models from "@open-dpe-logement/models";
import type { Context } from "../../core/context.js";
import { calcule as calcule_batiment } from "../batiment/service.js";
import { calcule as calcule_chauffage } from "../chauffage/service.js";
import { calcule as calcule_ecs } from "../ecs/service.js";
import { calcule as calcule_enveloppe } from "../enveloppe/service.js";
import { calcule as calcule_production } from "../production/service.js";
import { calcule as calcule_refroidissement } from "../refroidissement/service.js";
import { calcule as calcule_ventilation } from "../ventilation/service.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(ctx: Context): models.diagnostic.DiagnosticWithData {
	return {
		...ctx.diagnostic,

		batiment: calcule_batiment(ctx),
		chauffage: calcule_chauffage(ctx),
		ecs: calcule_ecs(ctx),
		enveloppe: calcule_enveloppe(ctx),
		production: calcule_production(ctx),
		refroidissement: calcule_refroidissement(ctx),
		ventilation: calcule_ventilation(ctx),

		data: {
			consommations: ctx.resolve(NAMESPACE, RULES.consommations),
			cef: ctx.resolve(NAMESPACE, RULES.cef),
			cep: ctx.resolve(NAMESPACE, RULES.cep),
			eges: ctx.resolve(NAMESPACE, RULES.eges),
			etiquette_energie: ctx.resolve(NAMESPACE, RULES.etiquette_energie),
			etiquette_climat: ctx.resolve(NAMESPACE, RULES.etiquette_climat),
			confort_ete: ctx.resolve(NAMESPACE, RULES.confort_ete),
		},
	};
}
