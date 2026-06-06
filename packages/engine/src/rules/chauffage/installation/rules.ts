import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as generateurRules from "#rules/chauffage/generateur/index.js";
import * as systemeRules from "#rules/chauffage/systeme/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context) {
	ctx.diagnostic.chauffage.installations.forEach((item) => {
		ctx.register(ID, RULES.caux_dist, item, () => caux_dist(ctx, item));
		ctx.register(ID, RULES.bch, item, () => bch(ctx, item));
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx, item));
		ctx.register(ID, RULES.pch, item, () => pch(ctx, item));
		ctx.register(ID, RULES.fch, item, () => fch(ctx, item));
	});
}

type Installation = models.chauffage.installation.Installation;

export function caux_dist(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return formulas.calcule_caux_dist({
		caux_dist: installation.systemes.map((s) =>
			ctx.resolve(systemeRules.ID, systemeRules.RULES.caux_dist, s),
		),
	});
}

export function bch(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_bch> {
	return formulas.calcule_bch({
		bch: ctx.resolve(chauffage.ID, chauffage.RULES.bch),
		rdim: ctx.resolve(ID, RULES.rdim, installation),
	});
}

export function rdim(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return formulas.calcule_rdim({
		surface_installation: installation.surface,
		surface_installations: ctx.diagnostic.chauffage.installations.reduce(
			(s, { surface }) => s + surface,
			0,
		),
	});
}

export function pch(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_pch> {
	return formulas.calcule_pch({
		pch: ctx.resolve(chauffage.ID, chauffage.RULES.pch),
		rdim: ctx.resolve(ID, RULES.rdim, installation),
	});
}

export function fch(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_fch> {
	return formulas.calcule_fch({
		fch_saisi: installation.solaire_thermique?.fch ?? null,
		usage: installation.solaire_thermique?.usage ?? null,
		type_batiment: ctx.diagnostic.batiment.type,
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
	});
}

export function effet_joule(
	ctx: Context,
	installation: Installation,
): ReturnType<typeof formulas.calcule_effet_joule> {
	return ctx.once(ID, "effet_joule", installation, () => {
		return formulas.calcule_effet_joule({
			type_installation: installation.type,
			systemes: installation.systemes.map((s) => {
				const generateur = models.chauffage.get_generateur(
					ctx.diagnostic.chauffage,
					s.generateur_id,
				);
				return {
					type_systeme: s.type,
					energie_generateur:
						generateurRules.rules.energie_generateur(generateur),
				};
			}),
		});
	});
}

export function applique(ctx: Context, item: Installation): models.chauffage.installation.InstallationWithData {
	const sumMois = (v: models.common.ParMois<number>): number =>
		Object.values(v).reduce((s: number, n: number) => s + n, 0);
	return {
		...item,
		data: {
			bch: sumMois(ctx.resolve(ID, RULES.bch, item)),
			rdim: ctx.resolve(ID, RULES.rdim, item),
			pch: ctx.resolve(ID, RULES.pch, item),
			fch: ctx.resolve(ID, RULES.fch, item),
		},
	};
}
