import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.caux_dist]: caux_dist,
		[RULES.bch]: bch,
		[RULES.rdim]: rdim,
		[RULES.pch]: pch,
		[RULES.fch]: fch,
		[RULES.effet_joule]: effet_joule,
	},
};

type Installation = models.chauffage.installation.Installation;

export function caux_dist(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, item, () =>
		formulas.calcule_caux_dist({
			caux_dist: _systemes(ctx, item).map(({ caux_dist }) => caux_dist),
		}),
	);
}

export function bch(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_bch> {
	return ctx.register(NAMESPACE, RULES.bch, item, () =>
		formulas.calcule_bch({
			bch: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.bch,
			),
			rdim: rdim(ctx, item),
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
			surface_installations: ctx.diagnostic.chauffage.installations.reduce(
				(s, { surface }) => s + surface,
				0,
			),
		}),
	);
}

export function pch(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_pch> {
	return ctx.register(NAMESPACE, RULES.pch, item, () =>
		formulas.calcule_pch({
			pch: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.pch,
			),
			rdim: rdim(ctx, item),
		}),
	);
}

export function fch(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_fch> {
	return ctx.register(NAMESPACE, RULES.fch, item, () =>
		formulas.calcule_fch({
			fch_saisi: item.solaire_thermique?.fch ?? null,
			usage: item.solaire_thermique?.usage ?? null,
			type_batiment: ctx.diagnostic.batiment.type,
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
		}),
	);
}

export function effet_joule(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_effet_joule> {
	return ctx.register(NAMESPACE, RULES.effet_joule, item, () => {
		return formulas.calcule_effet_joule({
			type_installation: item.type,
			systemes: _systemes(ctx, item),
		});
	});
}

function _systemes(ctx: Context, item: Installation) {
	return ctx.once(NAMESPACE, "systemes", item, () =>
		item.systemes.map((systeme) => {
			const generateur = models.chauffage.getGenerateur(
				ctx.diagnostic.chauffage,
				systeme.generateur_id,
			);

			return {
				...systeme,

				type_systeme: systeme.type,

				caux_dist: ctx.resolve(
					constants.chauffage.systeme.NAMESPACE,
					constants.chauffage.systeme.RULES.caux_dist,
					systeme,
				),
				energie_generateur: ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.energie_generateur,
					generateur,
				),
			};
		}),
	);
}
