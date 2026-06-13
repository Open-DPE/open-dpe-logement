import type { Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cef]: cef,
		[RULES.cep]: cep,
		[RULES.eges]: eges,
		[RULES.etiquette_energie]: etiquette_energie,
		[RULES.etiquette_climat]: etiquette_climat,
		[RULES.confort_ete]: confort_ete,
	},
};

export function consommations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, () =>
		formulas.calcule_consommations({
			chauffage: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.consommations,
			),
			eclairage: ctx.resolve(
				constants.eclairage.NAMESPACE,
				constants.eclairage.RULES.consommations,
			),
			ecs: ctx.resolve(
				constants.ecs.NAMESPACE,
				constants.ecs.RULES.consommations,
			),
			refroidissement: ctx.resolve(
				constants.refroidissement.NAMESPACE,
				constants.refroidissement.RULES.consommations,
			),
			ventilation: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.consommations,
			),
		}),
	);
}

export function cef(ctx: Context): ReturnType<typeof formulas.calcule_cef> {
	return ctx.register(NAMESPACE, RULES.cef, () =>
		formulas.calcule_cef({
			consommations: ctx.resolve(NAMESPACE, RULES.consommations),
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
		}),
	);
}

export function cep(ctx: Context): ReturnType<typeof formulas.calcule_cep> {
	return ctx.register(NAMESPACE, RULES.cep, () =>
		formulas.calcule_cep({
			consommations: ctx.resolve(NAMESPACE, RULES.consommations),
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
		}),
	);
}

export function eges(ctx: Context): ReturnType<typeof formulas.calcule_eges> {
	return ctx.register(NAMESPACE, RULES.eges, () =>
		formulas.calcule_eges({
			consommations: ctx.resolve(NAMESPACE, RULES.consommations),
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
		}),
	);
}

export function etiquette_energie(
	ctx: Context,
): ReturnType<typeof formulas.calcule_etiquette_energie> {
	return ctx.register(NAMESPACE, RULES.etiquette_energie, () =>
		formulas.calcule_etiquette_energie({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			altitude: ctx.diagnostic.batiment.altitude,
			cep: ctx.resolve(NAMESPACE, RULES.cep),
			eges: ctx.resolve(NAMESPACE, RULES.eges),
		}),
	);
}

export function etiquette_climat(
	ctx: Context,
): ReturnType<typeof formulas.calcule_etiquette_climat> {
	return ctx.register(NAMESPACE, RULES.etiquette_climat, () =>
		formulas.calcule_etiquette_climat({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			altitude: ctx.diagnostic.batiment.altitude,
			eges: ctx.resolve(NAMESPACE, RULES.eges),
		}),
	);
}

export function confort_ete(
	ctx: Context,
): ReturnType<typeof formulas.calcule_confort_ete> {
	return ctx.register(NAMESPACE, RULES.confort_ete, () =>
		formulas.calcule_confort_ete({
			type_diagnostic: ctx.diagnostic.type,
			presence_protection_solaire: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.presence_protection_solaire,
			),
			isolation_planchers_hauts: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.isolation_planchers_hauts,
			),
			inertie: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.inertie,
			),
			logement_traversant: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.logement_traversant,
			),
			presence_brasseur_air: ctx.diagnostic.enveloppe.presence_brasseurs_air,
		}),
	);
}
