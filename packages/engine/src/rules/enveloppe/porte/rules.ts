import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
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
		[RULES.isolation]: isolation,
	},
};

type Porte = models.enveloppe.porte.Porte;

export function aiu(ctx: Context, item: Porte): ReturnType<typeof paroi.aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () => paroi.aiu(item));
}

export function isolation_aiu(
	ctx: Context,
	item: Porte,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return ctx.register(NAMESPACE, RULES.isolation_aiu, item, () =>
		formulas.calcule_isolation_aiu(),
	);
}

export function sdep(ctx: Context, item: Porte): ReturnType<typeof paroi.sdep> {
	return ctx.register(NAMESPACE, RULES.sdep, item, () => paroi.sdep(item));
}

export function b(ctx: Context, item: Porte): ReturnType<typeof paroi.b> {
	return ctx.register(NAMESPACE, RULES.b, item, () =>
		paroi.b(ctx, item, isolation(ctx, item)),
	);
}

export function dp(
	ctx: Context,
	item: Porte,
): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp, item, () =>
		formulas.calcule_dp({
			sdep: sdep(ctx, item),
			b: b(ctx, item),
			u: u(ctx, item),
		}),
	);
}

export function u(
	ctx: Context,
	item: Porte,
): ReturnType<typeof formulas.calcule_u> {
	return ctx.register(NAMESPACE, RULES.u, item, () =>
		formulas.calcule_u({
			u_saisi: item.u,
			presence_sas: item.position.presence_sas,
			isolation: formulas.set_isolation({ isolation: item.isolation }),
			taux_vitrage: formulas.set_taux_vitrage({
				surface: item.position.surface,
				surface_vitrage: item.vitrage?.surface ?? 0,
			}),
			materiau: formulas.set_materiau({ materiau: item.materiau }),
			type_vitrage: formulas.set_type_vitrage({
				type_vitrage: item.vitrage?.type ?? null,
			}),
		}),
	);
}

export function isolation(
	ctx: Context,
	item: Porte,
): ReturnType<typeof formulas.set_isolation> {
	return ctx.register(NAMESPACE, RULES.isolation, item, () =>
		formulas.set_isolation({
			isolation: item.isolation,
		}),
	);
}
