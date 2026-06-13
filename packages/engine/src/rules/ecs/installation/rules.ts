import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.becs]: becs,
		[RULES.caux_dist]: caux_dist,
		[RULES.rdim]: rdim,
		[RULES.fecs]: fecs,
		[RULES.qdw]: qdw,
		[RULES.qdw_ind_vc]: qdw_ind_vc,
		[RULES.qdw_col_vc]: qdw_col_vc,
		[RULES.qdw_col_hvc]: qdw_col_hvc,
	},
};

type Installation = models.ecs.installation.Installation;

export function becs(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_becs> {
	return ctx.register(NAMESPACE, RULES.becs, item, () =>
		formulas.calcule_becs({
			becs: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.becs),
			rdim: rdim(ctx, item),
		}),
	);
}

export function caux_dist(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, item, () =>
		formulas.calcule_caux_dist({
			caux_dist: item.systemes.map((s) =>
				ctx.resolve(
					constants.ecs.systeme.NAMESPACE,
					constants.ecs.systeme.RULES.caux_dist,
					s,
				),
			),
		}),
	);
}

export function rdim(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, item, () =>
		formulas.calcule_rdim({
			surface_installation: item.surface,
			surface_installations: ctx.diagnostic.ecs.installations.reduce(
				(s, i) => s + i.surface,
				0,
			),
		}),
	);
}

export function fecs(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_fecs> {
	return ctx.register(NAMESPACE, RULES.fecs, item, () =>
		formulas.calcule_fecs({
			fecs_saisi: item.solaire_thermique?.fecs ?? null,
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			type_batiment: ctx.diagnostic.batiment.type,
			installation_solaire: item.solaire_thermique
				? {
						usage: item.solaire_thermique.usage,
						anciennete: anciennete_installation_solaire(ctx, item),
					}
				: null,
		}),
	);
}

export function qdw(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_qdw> {
	return ctx.register(NAMESPACE, RULES.qdw, item, () =>
		formulas.calcule_qdw({
			qdw_ind_vc: qdw_ind_vc(ctx, item),
			qdw_col_vc: qdw_col_vc(ctx, item),
			qdw_col_hvc: qdw_col_hvc(ctx, item),
		}),
	);
}

export function qdw_ind_vc(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_qdw_ind_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_ind_vc, item, () =>
		formulas.calcule_qdw_ind_vc({
			becs: becs(ctx, item),
			sh: item.surface,
			ns: item.systemes.length,
		}),
	);
}

export function qdw_col_vc(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_qdw_col_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_vc, item, () =>
		formulas.calcule_qdw_col_vc({
			becs: becs(ctx, item),
			reseau_collectif: item.installation_collective,
		}),
	);
}

export function qdw_col_hvc(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_qdw_col_hvc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_hvc, item, () =>
		formulas.calcule_qdw_col_hvc({
			becs: becs(ctx, item),
			reseau_collectif: item.installation_collective,
		}),
	);
}

function anciennete_installation_solaire(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.set_anciennete_installation_solaire> {
	return formulas.set_anciennete_installation_solaire({
		annee_reference: new Date(ctx.diagnostic.date_etablissement).getFullYear(),
		annee_installation: item.solaire_thermique?.annee_installation ?? null,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
