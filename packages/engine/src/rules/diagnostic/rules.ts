import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/index.js";
import * as climat from "#rules/climat/index.js";
import * as chauffage from "#rules/chauffage/index.js";
import * as eclairage from "#rules/eclairage/index.js";
import * as ecs from "#rules/ecs/index.js";
import * as enveloppe from "#rules/enveloppe/index.js";
import * as production from "#rules/production/index.js";
import * as refroidissement from "#rules/refroidissement/index.js";
import * as ventilation from "#rules/ventilation/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	batiment.rules.register(ctx);
	climat.rules.register(ctx);
	chauffage.rules.register(ctx);
	eclairage.rules.register(ctx);
	ecs.rules.register(ctx);
	enveloppe.rules.register(ctx);
	production.rules.register(ctx);
	refroidissement.rules.register(ctx);
	ventilation.rules.register(ctx);

	ctx.register(ID, RULES.consommations, () => consommations(ctx));
	ctx.register(ID, RULES.cef, () => cef(ctx));
	ctx.register(ID, RULES.cep, () => cep(ctx));
	ctx.register(ID, RULES.eges, () => eges(ctx));
}

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		chauffage: ctx.resolve(chauffage.ID, chauffage.RULES.consommations),
		eclairage: ctx.resolve(eclairage.ID, eclairage.RULES.consommations),
		ecs: ctx.resolve(ecs.ID, ecs.RULES.consommations),
		refroidissement: ctx.resolve(
			refroidissement.ID,
			refroidissement.RULES.consommations,
		),
		ventilation: ctx.resolve(ventilation.ID, ventilation.RULES.consommations),
	});
}

export function cef(ctx: Context): ReturnType<typeof formulas.calcule_cef> {
	return formulas.calcule_cef({
		consommations: ctx.resolve(ID, RULES.consommations),
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
	});
}

export function cep(ctx: Context): ReturnType<typeof formulas.calcule_cep> {
	return formulas.calcule_cep({
		consommations: ctx.resolve(ID, RULES.consommations),
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
	});
}

export function eges(ctx: Context): ReturnType<typeof formulas.calcule_eges> {
	return formulas.calcule_eges({
		consommations: ctx.resolve(ID, RULES.consommations),
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
	});
}

export function applique(ctx: Context): models.diagnostic.DiagnosticWithData {
	return {
		...ctx.diagnostic,
		data: {
			consommations: ctx.resolve(ID, RULES.consommations),
			cef: ctx.resolve(ID, RULES.cef),
			cep: ctx.resolve(ID, RULES.cep),
			eges: ctx.resolve(ID, RULES.eges),
		},
	};
}
