import * as models from "@open-dpe-logement/models";
import { type Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.caux]: caux,
		[RULES.caux_enr]: caux_enr,
		[RULES.pvent_moy]: pvent_moy,
		[RULES.rut]: rut,
		[RULES.rdim]: rdim,
		[RULES.debits]: debits,
		[RULES.hvent]: hvent,
		[RULES.annee_installation]: annee_installation,
		[RULES.presence_echangeur_thermique]: presence_echangeur_thermique,
	},
};

type Installation = models.ventilation.installation.Installation;

export function consommations(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, item, () =>
		formulas.calcule_consommations({
			caux: caux(ctx, item),
			caux_enr: caux_enr(ctx, item),
		}),
	);
}

export function caux(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_caux> {
	return ctx.register(NAMESPACE, RULES.caux, item, () =>
		formulas.calcule_caux({
			rdim: rdim(ctx, item),
			pvent_moy: pvent_moy(ctx, item),
			rut: rut(ctx, item),
		}),
	);
}

export function caux_enr(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_caux_enr> {
	return ctx.register(NAMESPACE, RULES.caux_enr, item, () =>
		formulas.calcule_caux_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			caux: caux(ctx, item),
		}),
	);
}

export function pvent_moy(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_pvent_moy> {
	return ctx.register(NAMESPACE, RULES.pvent_moy, item, () =>
		formulas.calcule_pvent_moy({
			type_batiment: ctx.diagnostic.batiment.type,
			type_ventilation: item.type,
			annee_installation: annee_installation(ctx, item),
			surface_installation: item.surface,
			qvarep_conv: debits(ctx, item).qvarep_conv,
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
			surface_installations: ctx.diagnostic.ventilation.installations.reduce(
				(s, i) => s + i.surface,
				0,
			),
		}),
	);
}

export function rut(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_rut> {
	return ctx.register(NAMESPACE, RULES.rut, item, () =>
		formulas.calcule_rut({
			type_ventilation: item.type,
			installation_collective: item.installation_collective,
		}),
	);
}

export function debits(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_debits> {
	return ctx.register(NAMESPACE, RULES.debits, item, () =>
		formulas.calcule_debits({
			type_ventilation: item.type,
			installation_collective: item.installation_collective,
			annee_installation: annee_installation(ctx, item),
			presence_echangeur_thermique: presence_echangeur_thermique(ctx, item),
		}),
	);
}

export function hvent(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_hvent> {
	return ctx.register(NAMESPACE, RULES.hvent, item, () =>
		formulas.calcule_hvent({
			sh: item.surface,
			rdim: rdim(ctx, item),
			qvarep_conv: debits(ctx, item).qvarep_conv,
		}),
	);
}

export function annee_installation(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.set_annee_installation> {
	return ctx.register(NAMESPACE, RULES.annee_installation, item, () =>
		formulas.set_annee_installation({
			annee_installation: item.annee_installation,
			annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
		}),
	);
}

export function presence_echangeur_thermique(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.set_presence_echangeur_thermique> {
	return ctx.register(NAMESPACE, RULES.presence_echangeur_thermique, item, () =>
		formulas.set_presence_echangeur_thermique({
			presence_echangeur_thermique: item.presence_echangeur_thermique,
		}),
	);
}
