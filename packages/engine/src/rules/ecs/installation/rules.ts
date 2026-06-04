import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as ecs from "#rules/ecs/registry.js";
import * as systeme from "#rules/ecs/systeme/registry.js";
import * as formules from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.ecs.installations.forEach((item) => {
		ctx.register(ID, RULES.becs, item, () => becs(ctx, item));
		ctx.register(ID, RULES.caux_dist, item, () => caux_dist(ctx, item));
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx, item));
		ctx.register(ID, RULES.fecs, item, () => fecs(ctx, item));
		ctx.register(ID, RULES.qdw, item, () => qdw(ctx, item));
		ctx.register(ID, RULES.qdw_ind_vc, item, () => qdw_ind_vc(ctx, item));
		ctx.register(ID, RULES.qdw_col_vc, item, () => qdw_col_vc(ctx, item));
		ctx.register(ID, RULES.qdw_col_hvc, item, () => qdw_col_hvc(ctx, item));
	});
}

type Installation = models.ecs.installation.Installation;

export function becs(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_becs> {
	return formules.calcule_becs({
		becs: ctx.resolve(ecs.ID, ecs.RULES.becs),
		rdim: ctx.resolve(ID, RULES.rdim, installation),
	});
}

export function caux_dist(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_caux_dist> {
	return formules.calcule_caux_dist({
		caux_dist: installation.systemes.map((s) =>
			ctx.resolve(systeme.ID, systeme.RULES.caux_dist, s),
		),
	});
}

export function rdim(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_rdim> {
	return formules.calcule_rdim({
		surface_installation: installation.surface,
		surface_installations: ctx.diagnostic.ecs.installations.reduce(
			(s, i) => s + i.surface,
			0,
		),
	});
}

export function fecs(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_fecs> {
	return formules.calcule_fecs({
		fecs_saisi: installation.solaire_thermique?.fecs ?? null,
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		type_batiment: ctx.diagnostic.batiment.type,
		installation_solaire: installation.solaire_thermique
			? {
					usage: installation.solaire_thermique.usage,
					anciennete: anciennete_installation_solaire(ctx, installation),
				}
			: null,
	});
}

export function qdw(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_qdw> {
	return formules.calcule_qdw({
		qdw_ind_vc: ctx.resolve(ID, RULES.qdw_ind_vc, installation),
		qdw_col_vc: ctx.resolve(ID, RULES.qdw_col_vc, installation),
		qdw_col_hvc: ctx.resolve(ID, RULES.qdw_col_hvc, installation),
	});
}

export function qdw_ind_vc(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_qdw_ind_vc> {
	return formules.calcule_qdw_ind_vc({
		becs: ctx.resolve(ID, RULES.becs, installation),
		sh: installation.surface,
		ns: installation.systemes.length,
	});
}

export function qdw_col_vc(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_qdw_col_vc> {
	return formules.calcule_qdw_col_vc({
		becs: ctx.resolve(ID, RULES.becs, installation),
		reseau_collectif: installation.installation_collective,
	});
}

export function qdw_col_hvc(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.calcule_qdw_col_hvc> {
	return formules.calcule_qdw_col_hvc({
		becs: ctx.resolve(ID, RULES.becs, installation),
		reseau_collectif: installation.installation_collective,
	});
}

export function anciennete_installation_solaire(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formules.set_anciennete_installation_solaire> {
	return formules.set_anciennete_installation_solaire({
		annee_installation:
			installation.solaire_thermique?.annee_installation ?? null,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
