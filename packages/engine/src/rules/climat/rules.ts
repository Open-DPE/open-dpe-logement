import type { Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.zone_climatique]: zone_climatique,
		[RULES.tbase]: tbase,
		[RULES.sollicitations]: sollicitations,
		[RULES.nj]: nj,
		[RULES.epv]: epv,
	},
};

export function zone_climatique(
	ctx: Context,
): ReturnType<typeof formulas.calcule_zone_climatique> {
	return ctx.register(NAMESPACE, RULES.zone_climatique, () => {
		const code_insee = ctx.diagnostic.batiment.adresse.code_insee;
		return formulas.calcule_zone_climatique({
			code_departement: code_insee.substring(0, 2),
		});
	});
}

export function tbase(ctx: Context): ReturnType<typeof formulas.calcule_tbase> {
	return ctx.register(NAMESPACE, RULES.tbase, () => {
		return formulas.calcule_tbase({
			zone_climatique: zone_climatique(ctx),
			altitude: ctx.diagnostic.batiment.altitude,
		});
	});
}

export function sollicitations(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sollicitations> {
	return ctx.register(NAMESPACE, RULES.sollicitations, () =>
		formulas.calcule_sollicitations({
			zone_climatique: zone_climatique(ctx),
			altitude: ctx.diagnostic.batiment.altitude,
			parois_anciennes: ctx.diagnostic.batiment.materiaux_anciens,
			inertie: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.inertie,
			),
		}),
	);
}

export function nj(ctx: Context): ReturnType<typeof formulas.calcule_nj> {
	return ctx.register(NAMESPACE, RULES.nj, () => {
		return formulas.calcule_nj();
	});
}

export function epv(ctx: Context): ReturnType<typeof formulas.calcule_epv> {
	return ctx.register(NAMESPACE, RULES.epv, () =>
		formulas.calcule_epv({
			zone_climatique: zone_climatique(ctx),
		}),
	);
}
