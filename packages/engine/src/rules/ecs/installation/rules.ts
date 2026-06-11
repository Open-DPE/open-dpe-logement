import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as systeme from "../systeme/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Installation = models.ecs.installation.Installation;

export function calcule(
	ctx: Context,
	installation: Installation,
): models.ecs.installation.InstallationWithData {
	const systemes = installation.systemes.map((item) =>
		systeme.calcule(ctx, installation, item),
	);

	return {
		...installation,
		systemes: models.common.toNonEmptyArray(systemes),
		data: {
			becs: models.common.reduceParMois(becs(ctx, installation)),
			rdim: rdim(ctx, installation),
			fecs: fecs(ctx, installation),
			qdw: qdw(ctx, installation),
			qdw_ind_vc: qdw_ind_vc(ctx, installation),
			qdw_col_vc: qdw_col_vc(ctx, installation),
			qdw_col_hvc: qdw_col_hvc(ctx, installation),
		},
	};
}

export function becs(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_becs> {
	return ctx.register(NAMESPACE, RULES.becs, installation, () =>
		formulas.calcule_becs({
			becs: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.becs),
			rdim: rdim(ctx, installation),
		}),
	);
}

export function caux_dist(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, installation, () =>
		formulas.calcule_caux_dist({
			caux_dist: installation.systemes.map((s) =>
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
	installation: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, installation, () =>
		formulas.calcule_rdim({
			surface_installation: installation.surface,
			surface_installations: ctx.diagnostic.ecs.installations.reduce(
				(s, i) => s + i.surface,
				0,
			),
		}),
	);
}

export function fecs(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_fecs> {
	return ctx.register(NAMESPACE, RULES.fecs, installation, () =>
		formulas.calcule_fecs({
			fecs_saisi: installation.solaire_thermique?.fecs ?? null,
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			type_batiment: ctx.diagnostic.batiment.type,
			installation_solaire: installation.solaire_thermique
				? {
						usage: installation.solaire_thermique.usage,
						anciennete: anciennete_installation_solaire(ctx, installation),
					}
				: null,
		}),
	);
}

export function qdw(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_qdw> {
	return ctx.register(NAMESPACE, RULES.qdw, installation, () =>
		formulas.calcule_qdw({
			qdw_ind_vc: qdw_ind_vc(ctx, installation),
			qdw_col_vc: qdw_col_vc(ctx, installation),
			qdw_col_hvc: qdw_col_hvc(ctx, installation),
		}),
	);
}

export function qdw_ind_vc(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_qdw_ind_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_ind_vc, installation, () =>
		formulas.calcule_qdw_ind_vc({
			becs: becs(ctx, installation),
			sh: installation.surface,
			ns: installation.systemes.length,
		}),
	);
}

export function qdw_col_vc(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_qdw_col_vc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_vc, installation, () =>
		formulas.calcule_qdw_col_vc({
			becs: becs(ctx, installation),
			reseau_collectif: installation.installation_collective,
		}),
	);
}

export function qdw_col_hvc(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_qdw_col_hvc> {
	return ctx.register(NAMESPACE, RULES.qdw_col_hvc, installation, () =>
		formulas.calcule_qdw_col_hvc({
			becs: becs(ctx, installation),
			reseau_collectif: installation.installation_collective,
		}),
	);
}

export function anciennete_installation_solaire(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.set_anciennete_installation_solaire> {
	return formulas.set_anciennete_installation_solaire({
		annee_reference: new Date(ctx.diagnostic.date_etablissement).getFullYear(),
		annee_installation:
			installation.solaire_thermique?.annee_installation ?? null,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
