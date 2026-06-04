import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.planchers_hauts.forEach((item) => {
		ctx.register(ID, RULES.aiu, item, () => aiu(item));
		ctx.register(ID, RULES.isolation_aiu, item, () => isolation_aiu(ctx, item));
		ctx.register(ID, RULES.sdep, item, () => sdep(item));
		ctx.register(ID, RULES.b, item, () => b(ctx, item));
		ctx.register(ID, RULES.dp, item, () => dp(ctx, item));
		ctx.register(ID, RULES.u0, item, () => u0(item));
		ctx.register(ID, RULES.u, item, () => u(ctx, item));
	});
}

type PlancherHaut = models.enveloppe.plancherHaut.PlancherHaut;

export function aiu(
	item: PlancherHaut,
): ReturnType<typeof formulas.calcule_aiu> {
	return paroi.aiu(item);
}

export function isolation_aiu(
	ctx: Context,
	item: PlancherHaut,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return formulas.calcule_isolation_aiu({
		isolation: item.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

export function sdep(item: PlancherHaut): ReturnType<typeof paroi.sdep> {
	return paroi.sdep(item);
}

export function b(
	ctx: Context,
	item: PlancherHaut,
): ReturnType<typeof paroi.b> {
	return paroi.b(ctx, item, isolation(ctx, item));
}

export function dp(
	ctx: Context,
	item: PlancherHaut,
): ReturnType<typeof paroi.dp> {
	return paroi.dp(ctx, item, ID);
}

export function u0(item: PlancherHaut): ReturnType<typeof formulas.calcule_u0> {
	return formulas.calcule_u0({
		u0_saisi: item.u0,
		type_plancher_haut: item.type,
	});
}

export function u(
	ctx: Context,
	item: PlancherHaut,
): ReturnType<typeof formulas.calcule_u> {
	return formulas.calcule_u({
		u_saisi: item.u,
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		effet_joule: ctx.resolve(chauffage.ID, chauffage.RULES.effet_joule),
		configuration: item.configuration,
		u0: ctx.resolve(ID, RULES.u0, item),
		isolation: item.isolation.etat,
		type_isolation: item.isolation.type,
		epaisseur_isolation: item.isolation.epaisseur,
		resistance_thermique_isolation: item.isolation.resistance_thermique,
		annee_isolation: item.isolation.annee_installation,
		annee_construction: paroi.annee_construction(ctx, item),
	});
}

export function isolation(
	ctx: Context,
	item: PlancherHaut,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({
		isolation: item.isolation.etat,
		annee_construction: paroi.annee_construction(ctx, item),
	});
}
