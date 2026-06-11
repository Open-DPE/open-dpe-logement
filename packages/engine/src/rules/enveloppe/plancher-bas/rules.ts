import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES, type Results } from "./registry.js";

type PlancherBas = models.enveloppe.plancherBas.PlancherBas;

export function aiu(
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_aiu> {
	return paroi.aiu(item);
}

export function isolation_aiu(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return formulas.calcule_isolation_aiu({
		isolation: item.isolation.etat,
		mitoyennete: item.position.mitoyennete,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

export function sdep(
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_sdep> {
	return paroi.sdep(item);
}

export function b(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_b> {
	return paroi.b(ctx, item, isolation(ctx, item));
}

export function dp(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_dp> {
	return paroi.dp(ctx, item, ID);
}

export function u0(item: PlancherBas): ReturnType<typeof formulas.calcule_u0> {
	return formulas.calcule_u0({
		u0_saisi: item.u0,
		type_plancher_bas: item.type,
	});
}

export function u(ctx: Context, item: PlancherBas): Results[typeof RULES.u] {
	return ctx.register(NAMESPACE, RULES.u, item, () =>
		formulas.calcule_u({
			uint: ctx.resolve(NAMESPACE, RULES.uint, item),
			ue: ctx.resolve(NAMESPACE, RULES.ue, item),
		}),
	);
}

export function uint(
	ctx: Context,
	item: PlancherBas,
): Results[typeof RULES.uint] {
	return ctx.register(NAMESPACE, RULES.uint, item, () =>
		formulas.calcule_uint({
			u_saisi: item.u,
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
			effet_joule: ctx.resolve(chauffage.ID, chauffage.RULES.effet_joule),
			u0: ctx.resolve(NAMESPACE, RULES.u0, item),
			isolation: item.isolation.etat,
			type_isolation: item.isolation.type,
			epaisseur_isolation: item.isolation.epaisseur,
			resistance_thermique_isolation: item.isolation.resistance_thermique,
			annee_isolation: item.annee_renovation,
			annee_construction: paroi.annee_construction(ctx, item),
		}),
	);
}

export function ue(ctx: Context, item: PlancherBas): Results[typeof RULES.ue] {
	return ctx.register(NAMESPACE, RULES.ue, item, () => {
		return models.enveloppe.plancherBas.isPositionTerrePlein(item.position)
			? formulas.calcule_ue({
					mitoyennete: item.position.mitoyennete,
					annee_construction: paroi.annee_construction(ctx, item),
					u: ctx.resolve(NAMESPACE, RULES.u, item),
					surface_ue: item.position.surface_ue,
					perimetre_ue: item.position.perimetre_ue,
				})
			: null;
	});
}

export function isolation(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({
		mitoyennete: item.position.mitoyennete,
		isolation: item.isolation.etat,
		annee_construction: paroi.annee_construction(ctx, item),
	});
}

export function applique(
	ctx: Context,
	item: PlancherBas,
): models.enveloppe.plancherBas.PlancherBasWithData {
	return {
		...item,
		data: {
			u0: ctx.resolve(ID, RULES.u0, item),
			u: ctx.resolve(ID, RULES.u, item),
			b: ctx.resolve(ID, RULES.b, item),
			sdep: ctx.resolve(ID, RULES.sdep, item),
			dp: ctx.resolve(ID, RULES.dp, item),
		},
	};
}
