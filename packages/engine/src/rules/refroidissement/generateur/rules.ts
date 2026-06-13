import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cfr]: cfr,
		[RULES.cfr_enr]: cfr_enr,
		[RULES.cfr_elec]: cfr_elec,
		[RULES.caux]: caux,
		[RULES.rdim]: rdim,
		[RULES.eer]: eer,
		[RULES.annee_installation]: annee_installation,
	},
};

type Generateur = models.refroidissement.generateur.Generateur;

export function consommations(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, item, () =>
		formulas.calcule_consommations({
			cfr: cfr(ctx, item),
			cfr_enr: cfr_enr(ctx, item),
			caux: caux(ctx, item),
			energie: item.energie,
			reseau_id: item.reseau_froid_id,
		}),
	);
}

export function cfr(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cfr> {
	return ctx.register(NAMESPACE, RULES.cfr, item, () =>
		formulas.calcule_cfr({
			bfr: ctx.resolve(
				constants.refroidissement.NAMESPACE,
				constants.refroidissement.RULES.bfr,
			),
			rdim: rdim(ctx, item),
			eer: eer(ctx, item),
		}),
	);
}

export function cfr_enr(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cfr_enr> {
	return ctx.register(NAMESPACE, RULES.cfr_enr, item, () =>
		formulas.calcule_cfr_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			cfr_elec: cfr_elec(ctx, item),
		}),
	);
}

export function cfr_elec(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cfr_elec> {
	return ctx.register(NAMESPACE, RULES.cfr_elec, item, () =>
		formulas.calcule_cfr_elec({
			cfr: cfr(ctx, item),
			energie_generateur: item.energie,
		}),
	);
}

export function caux(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, item, () =>
		formulas.calcule_caux(),
	);
}

export function rdim(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, item, () =>
		formulas.calcule_rdim({
			installations: ctx.diagnostic.refroidissement.installations.map((i) => ({
				rdim: ctx.resolve(
					constants.refroidissement.installation.NAMESPACE,
					constants.refroidissement.installation.RULES.rdim,
					i,
				),
				n_generateurs: i.generateurs.length,
			})),
		}),
	);
}

export function eer(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_eer> {
	return ctx.register(NAMESPACE, RULES.eer, item, () =>
		formulas.calcule_eer({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			annee_installation: annee_installation(ctx, item),
			seer_saisi: item.seer,
		}),
	);
}

export function annee_installation(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_annee_installation> {
	return ctx.register(NAMESPACE, RULES.annee_installation, item, () =>
		formulas.set_annee_installation({
			annee_installation: item.annee_installation,
			annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
		}),
	);
}
