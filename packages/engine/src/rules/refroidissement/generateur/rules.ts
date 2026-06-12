import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Generateur = models.refroidissement.generateur.Generateur;

export function calcule(
	ctx: Context,
	generateur: Generateur,
): models.refroidissement.generateur.GenerateurData {
	return {
		rdim: rdim(ctx),
		eer: eer(ctx, generateur),
		consommations: consommations(ctx, generateur),
	};
}

export function consommations(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, () =>
		formulas.calcule_consommations({
			cfr: cfr(ctx, generateur),
			cfr_enr: cfr_enr(ctx),
			caux: caux(ctx),
			energie: generateur.energie,
			reseau_id: generateur.reseau_froid_id,
		}),
	);
}

export function cfr(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cfr> {
	return ctx.register(NAMESPACE, RULES.cfr, () =>
		formulas.calcule_cfr({
			bfr: ctx.resolve(
				constants.refroidissement.NAMESPACE,
				constants.refroidissement.RULES.bfr,
			),
			rdim: rdim(ctx),
			eer: eer(ctx, generateur),
		}),
	);
}

export function cfr_enr(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cfr_enr> {
	return ctx.register(NAMESPACE, RULES.cfr_enr, () =>
		formulas.calcule_cfr_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			cfr_elec: ctx.resolve(
				constants.refroidissement.NAMESPACE,
				constants.refroidissement.RULES.cfr_elec,
			),
		}),
	);
}

export function cfr_elec(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cfr_elec> {
	return ctx.register(NAMESPACE, RULES.cfr_elec, () =>
		formulas.calcule_cfr_elec({
			cfr: cfr(ctx, generateur),
			energie_generateur: generateur.energie,
		}),
	);
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, () => formulas.calcule_caux());
}

export function rdim(ctx: Context): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, () =>
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
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_eer> {
	return ctx.register(NAMESPACE, RULES.eer, () =>
		formulas.calcule_eer({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			annee_installation: annee_installation(ctx, generateur),
			seer_saisi: generateur.seer,
		}),
	);
}

export function annee_installation(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: generateur.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
