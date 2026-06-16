import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as paroi from "../paroi/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type PlancherBas = models.enveloppe.plancherBas.PlancherBas;

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.aiu]: aiu,
		[RULES.isolation_aiu]: isolation_aiu,
		[RULES.sdep]: sdep,
		[RULES.b]: b,
		[RULES.dp]: dp,
		[RULES.u]: u,
		[RULES.u0]: u0,
		[RULES.uint]: uint,
		[RULES.ue]: ue,
		[RULES.isolation]: isolation,
	},
};

export function aiu(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof paroi.aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () => paroi.aiu(item));
}

export function isolation_aiu(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return ctx.register(NAMESPACE, RULES.isolation_aiu, item, () =>
		formulas.calcule_isolation_aiu({
			isolation: item.isolation.etat,
			mitoyennete: item.position.mitoyennete,
			annee_construction: ctx.diagnostic.batiment.annee_construction,
		}),
	);
}

export function sdep(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof paroi.sdep> {
	return ctx.register(NAMESPACE, RULES.sdep, item, () => paroi.sdep(item));
}

export function b(ctx: Context, item: PlancherBas): ReturnType<typeof paroi.b> {
	return ctx.register(NAMESPACE, RULES.b, item, () =>
		paroi.b(ctx, item, isolation(ctx, item)),
	);
}

export function dp(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp, item, () =>
		formulas.calcule_dp({
			sdep: sdep(ctx, item),
			b: b(ctx, item),
			u: u(ctx, item),
		}),
	);
}

export function u0(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_u0> {
	return ctx.register(NAMESPACE, RULES.u0, item, () =>
		formulas.calcule_u0({
			u0_saisi: item.u0,
			type_plancher_bas: item.type,
		}),
	);
}

export function u(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_u> {
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
): ReturnType<typeof formulas.calcule_uint> {
	return ctx.register(NAMESPACE, RULES.uint, item, () =>
		formulas.calcule_uint({
			u_saisi: item.u,
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			effet_joule: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.effet_joule,
			),
			u0: u0(ctx, item),
			isolation: item.isolation.etat,
			type_isolation: item.isolation.type,
			epaisseur_isolation: item.isolation.epaisseur,
			resistance_thermique_isolation: item.isolation.resistance_thermique,
			annee_isolation: item.annee_renovation,
			annee_construction: paroi.annee_construction(ctx, item),
		}),
	);
}

export function ue(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_ue> | null {
	return ctx.register(NAMESPACE, RULES.ue, item, () =>
		models.enveloppe.plancherBas.isPositionTerrePlein(item.position)
			? formulas.calcule_ue({
					mitoyennete: item.position.mitoyennete,
					annee_construction: paroi.annee_construction(ctx, item),
					uint: uint(ctx, item),
					surface_ue: item.position.surface_ue,
					perimetre_ue: item.position.perimetre_ue,
				})
			: null,
	);
}

export function isolation(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.set_isolation> {
	return ctx.register(NAMESPACE, RULES.isolation, item, () =>
		formulas.set_isolation({
			mitoyennete: item.position.mitoyennete,
			isolation: item.isolation.etat,
			annee_construction: paroi.annee_construction(ctx, item),
		}),
	);
}
