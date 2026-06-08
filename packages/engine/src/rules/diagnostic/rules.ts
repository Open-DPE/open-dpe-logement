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
	ctx.register(ID, RULES.etiquette_energie, () => etiquette_energie(ctx));
	ctx.register(ID, RULES.etiquette_climat, () => etiquette_climat(ctx));
	ctx.register(ID, RULES.confort_ete, () => confort_ete(ctx));
}

export function applique(ctx: Context): models.diagnostic.DiagnosticWithData {
	return {
		...ctx.diagnostic,
		data: {
			consommations: ctx.resolve(ID, RULES.consommations),
			cef: ctx.resolve(ID, RULES.cef),
			cep: ctx.resolve(ID, RULES.cep),
			eges: ctx.resolve(ID, RULES.eges),
			etiquette_energie: ctx.resolve(ID, RULES.etiquette_energie),
			etiquette_climat: ctx.resolve(ID, RULES.etiquette_climat),
			confort_ete: ctx.resolve(ID, RULES.confort_ete),
		},
	};
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

export function etiquette_energie(
	ctx: Context,
): ReturnType<typeof formulas.calcule_etiquette_energie> {
	return formulas.calcule_etiquette_energie({
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		altitude: ctx.diagnostic.batiment.altitude,
		cep: ctx.resolve(ID, RULES.cep),
		eges: ctx.resolve(ID, RULES.eges),
	});
}

export function etiquette_climat(
	ctx: Context,
): ReturnType<typeof formulas.calcule_etiquette_climat> {
	return formulas.calcule_etiquette_climat({
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		altitude: ctx.diagnostic.batiment.altitude,
		eges: ctx.resolve(ID, RULES.eges),
	});
}

export function confort_ete(
	ctx: Context,
): ReturnType<typeof formulas.calcule_confort_ete> {
	return formulas.calcule_confort_ete({
		type_diagnostic: ctx.diagnostic.type,
		presence_protection_solaire: ctx.resolve(
			enveloppe.ID,
			enveloppe.RULES.presence_protection_solaire,
		),
		isolation_planchers_hauts: ctx.resolve(
			enveloppe.ID,
			enveloppe.RULES.isolation_planchers_hauts,
		),
		inertie: ctx.resolve(enveloppe.ID, enveloppe.RULES.inertie),
		logement_traversant: ctx.resolve(
			enveloppe.ID,
			enveloppe.RULES.logement_traversant,
		),
		presence_brasseur_air: ctx.diagnostic.enveloppe.presence_brasseurs_air,
	});
}
