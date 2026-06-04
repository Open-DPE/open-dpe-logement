import type { Context } from "#core/context.js";
import * as enveloppe from "#rules/enveloppe/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.register(ID, RULES.zone_climatique, () => zone_climatique(ctx));
	ctx.register(ID, RULES.tbase, () => tbase(ctx));
	ctx.register(ID, RULES.sollicitations, () => sollicitations(ctx));
	ctx.register(ID, RULES.nj, () => nj());
	ctx.register(ID, RULES.epv, () => epv(ctx));
}

export function zone_climatique(
	ctx: Context,
): ReturnType<typeof formulas.calcule_zone_climatique> {
	const code_insee = ctx.diagnostic.batiment.adresse.code_insee;
	return formulas.calcule_zone_climatique({
		code_departement: code_insee.substring(0, 2),
	});
}

export function tbase(ctx: Context): ReturnType<typeof formulas.calcule_tbase> {
	return formulas.calcule_tbase({
		zone_climatique: ctx.resolve(ID, RULES.zone_climatique),
	});
}

export function sollicitations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sollicitations> {
	return formulas.calcule_sollicitations({
		zone_climatique: ctx.resolve(ID, RULES.zone_climatique),
		altitude: ctx.diagnostic.batiment.altitude,
		parois_anciennes: ctx.resolve(
			enveloppe.ID,
			enveloppe.RULES.parois_anciennes,
		),
		inertie: ctx.resolve(enveloppe.ID, enveloppe.RULES.inertie),
	});
}

export function nj(): ReturnType<typeof formulas.calcule_nj> {
	return formulas.calcule_nj();
}

export function epv(ctx: Context): ReturnType<typeof formulas.calcule_epv> {
	return formulas.calcule_epv({
		zone_climatique: ctx.resolve(ID, RULES.zone_climatique),
	});
}
