import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as refroidissement from "#rules/refroidissement/registry.js";
import * as installation from "#rules/refroidissement/installation/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.refroidissement.generateurs.forEach((item) => {
		ctx.register(ID, RULES.cfr, item, () => cfr(ctx, item));
		ctx.register(ID, RULES.caux, item, () => caux(ctx));
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx));
		ctx.register(ID, RULES.eer, item, () => eer(ctx, item));
	});
}

type Generateur = models.refroidissement.generateur.Generateur;

export function cfr(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cfr> {
	return formulas.calcule_cfr({
		bfr: ctx.resolve(refroidissement.ID, refroidissement.RULES.bfr),
		rdim: ctx.resolve(ID, RULES.rdim, item),
		eer: ctx.resolve(ID, RULES.eer, item),
	});
}

export function caux(ctx: Context): ReturnType<typeof formulas.calcule_caux> {
	return formulas.calcule_caux();
}

export function rdim(ctx: Context): ReturnType<typeof formulas.calcule_rdim> {
	return formulas.calcule_rdim({
		installations: ctx.diagnostic.refroidissement.installations.map((i) => ({
			rdim: ctx.resolve(installation.ID, installation.RULES.rdim, i),
			n_generateurs: i.generateurs.length,
		})),
	});
}

export function eer(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_eer> {
	return formulas.calcule_eer({
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		annee_installation: annee_installation(ctx, item),
		seer_saisi: item.seer,
	});
}

export function annee_installation(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: item.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
