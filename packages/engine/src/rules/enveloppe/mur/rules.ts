import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as paroi from "../paroi/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.aiu]: aiu,
		[RULES.isolation_aiu]: isolation_aiu,
		[RULES.sdep]: sdep,
		[RULES.b]: b,
		[RULES.dp]: dp,
		[RULES.u]: u,
		[RULES.u0]: u0,
		[RULES.paroi_ancienne]: paroi_ancienne,
		[RULES.isolation]: isolation,
	},
};

type Mur = models.enveloppe.mur.Mur;

export function aiu(ctx: Context, item: Mur): ReturnType<typeof paroi.aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () => paroi.aiu(item));
}

export function isolation_aiu(
	ctx: Context,
	item: Mur,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return ctx.register(NAMESPACE, RULES.isolation_aiu, item, () =>
		formulas.calcule_isolation_aiu({
			isolation: item.isolation.etat,
			annee_construction: ctx.diagnostic.batiment.annee_construction,
		}),
	);
}

export function sdep(ctx: Context, item: Mur): ReturnType<typeof paroi.sdep> {
	return ctx.register(NAMESPACE, RULES.sdep, item, () => paroi.sdep(item));
}

export function b(ctx: Context, item: Mur): ReturnType<typeof paroi.b> {
	return ctx.register(NAMESPACE, RULES.b, item, () =>
		paroi.b(ctx, item, isolation(ctx, item)),
	);
}

export function dp(
	ctx: Context,
	item: Mur,
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
	item: Mur,
): ReturnType<typeof formulas.calcule_u0> {
	return ctx.register(NAMESPACE, RULES.u0, item, () =>
		formulas.calcule_u0({
			u0_saisi: item.u0,
			annee_construction: paroi.annee_construction(ctx, item),
			structures: item.structures,
			u0_enduit_isolant: formulas.calcule_u0_enduit_isolant({
				paroi_ancienne: ctx.resolve(NAMESPACE, RULES.paroi_ancienne, item),
				presence_enduit_isolant: item.presence_enduit_isolant,
			}),
			u0_doublage: formulas.calcule_u0_doublage({
				type_doublage: item.type_doublage,
			}),
		}),
	);
}

export function u(
	ctx: Context,
	item: Mur,
): ReturnType<typeof formulas.calcule_u> {
	return ctx.register(NAMESPACE, RULES.u, item, () =>
		formulas.calcule_u({
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
			annee_isolation: item.isolation.annee_installation,
			annee_construction: paroi.annee_construction(ctx, item),
		}),
	);
}

export function paroi_ancienne(
	ctx: Context,
	item: Mur,
): ReturnType<typeof formulas.calcule_paroi_ancienne> {
	return ctx.register(NAMESPACE, RULES.paroi_ancienne, item, () =>
		formulas.calcule_paroi_ancienne({
			structures: item.structures.map((structure) => ({
				materiau_ancien: structure.materiau_ancien,
			})),
		}),
	);
}

export function isolation(
	ctx: Context,
	item: Mur,
): ReturnType<typeof formulas.set_isolation> {
	return ctx.register(NAMESPACE, RULES.isolation, item, () =>
		formulas.set_isolation({
			isolation: item.isolation.etat,
			annee_construction: paroi.annee_construction(ctx, item),
		}),
	);
}
