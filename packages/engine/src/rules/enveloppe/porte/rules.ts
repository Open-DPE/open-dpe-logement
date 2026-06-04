import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.portes.forEach((item) => {
		ctx.register(ID, RULES.aiu, item, () => aiu(item));
		ctx.register(ID, RULES.isolation_aiu, item, () => isolation_aiu());
		ctx.register(ID, RULES.sdep, item, () => sdep(item));
		ctx.register(ID, RULES.b, item, () => b(ctx, item));
		ctx.register(ID, RULES.dp, item, () => dp(ctx, item));
		ctx.register(ID, RULES.u, item, () => u(item));
	});
}

type Porte = models.enveloppe.porte.Porte;

export function aiu(item: Porte): ReturnType<typeof formulas.calcule_aiu> {
	return paroi.aiu(item);
}

export function isolation_aiu(): ReturnType<
	typeof formulas.calcule_isolation_aiu
> {
	return formulas.calcule_isolation_aiu();
}

export function sdep(item: Porte): ReturnType<typeof paroi.sdep> {
	return paroi.sdep(item);
}

export function b(ctx: Context, item: Porte): ReturnType<typeof paroi.b> {
	return paroi.b(ctx, item, isolation(item));
}

export function dp(ctx: Context, item: Porte): ReturnType<typeof paroi.dp> {
	return paroi.dp(ctx, item, ID);
}

export function u(item: Porte): ReturnType<typeof formulas.calcule_u> {
	return formulas.calcule_u({
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
	});
}

export function isolation(
	item: Porte,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({
		isolation: item.isolation,
	});
}
