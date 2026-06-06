import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as production from "#rules/production/registry.js";
import * as refroidissement from "#rules/refroidissement/registry.js";
import * as installation from "#rules/refroidissement/installation/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.refroidissement.generateurs.forEach((item) => {
		ctx.register(ID, RULES.consommations, item, () => consommations(ctx, item));
		ctx.register(ID, RULES.cfr, item, () => cfr(ctx, item));
		ctx.register(ID, RULES.cfr_enr, item, () => cfr_enr(ctx));
		ctx.register(ID, RULES.cfr_elec, item, () => cfr_elec(ctx, item));
		ctx.register(ID, RULES.caux, item, () => caux(ctx));
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx));
		ctx.register(ID, RULES.eer, item, () => eer(ctx, item));
	});
}

type Generateur = models.refroidissement.generateur.Generateur;

export function consommations(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_consommations> {
	return formulas.calcule_consommations({
		cfr: ctx.resolve(ID, RULES.cfr, item),
		cfr_enr: ctx.resolve(ID, RULES.cfr_enr, item),
		caux: ctx.resolve(ID, RULES.caux, item),
		energie: item.energie,
		reseau_id: item.reseau_froid_id,
	});
}

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

export function cfr_enr(
	ctx: Context,
): ReturnType<typeof formulas.calcule_cfr_enr> {
	return formulas.calcule_cfr_enr({
		celec: ctx.resolve(production.ID, production.RULES.celec),
		celec_ac: ctx.resolve(production.ID, production.RULES.celec_ac),
		cfr_elec: ctx.resolve(refroidissement.ID, refroidissement.RULES.cfr_elec),
	});
}

export function cfr_elec(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cfr_elec> {
	return formulas.calcule_cfr_elec({
		cfr: ctx.resolve(ID, RULES.cfr, item),
		energie_generateur: item.energie,
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

export function applique(ctx: Context, item: Generateur): models.refroidissement.generateur.GenerateurWithData {
	return {
		...item,
		data: {
			rdim: ctx.resolve(ID, RULES.rdim, item),
			eer: ctx.resolve(ID, RULES.eer, item),
			consommations: ctx.resolve(ID, RULES.consommations, item),
		},
	};
}
