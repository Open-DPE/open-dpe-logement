import { ventilation } from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import { ID, RULES } from "./registry.js";
import * as formulas from "./formulas.js";

export function register(ctx: Context): void {
	ctx.diagnostic.ventilation.installations.forEach((item) => {
		ctx.register(ID, RULES.caux, item, () => caux(ctx, item));
		ctx.register(ID, RULES.pvent_moy, item, () => pvent_moy(ctx, item));
		ctx.register(ID, RULES.rdim, item, () => rdim(ctx, item));
		ctx.register(ID, RULES.rut, item, () => rut(item));
		ctx.register(ID, RULES.hvent, item, () => hvent(ctx, item));
		ctx.register(ID, RULES.qvarep_conv, item, () => qvarep_conv(ctx, item));
		ctx.register(ID, RULES.qvasouf_conv, item, () => qvasouf_conv(ctx, item));
		ctx.register(ID, RULES.smea_conv, item, () => smea_conv(ctx, item));
	});
}

type Installation = ventilation.installation.Installation;

export function caux(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_caux> {
	return formulas.calcule_caux({
		rdim: ctx.resolve(ID, RULES.rdim, item),
		pvent_moy: ctx.resolve(ID, RULES.pvent_moy, item),
		rut: ctx.resolve(ID, RULES.rut, item),
	});
}

export function pvent_moy(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_pvent_moy> {
	return formulas.calcule_pvent_moy({
		type_batiment: ctx.diagnostic.batiment.type,
		type_ventilation: item.type,
		annee_installation: annee_installation(ctx, item),
		surface_installation: item.surface,
		qvarep_conv: ctx.resolve(ID, RULES.qvarep_conv, item),
	});
}

export function rdim(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	const surface_installation = item.surface;
	const surface_installations = ctx.diagnostic.ventilation.installations.reduce(
		(s, i) => s + i.surface,
		0,
	);
	return formulas.calcule_rdim({
		surface_installation,
		surface_installations,
	});
}

export function rut(
	item: Installation,
): ReturnType<typeof formulas.calcule_rut> {
	return formulas.calcule_rut({
		type_ventilation: item.type,
		installation_collective: item.installation_collective,
	});
}

export function debits(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_debits> {
	return formulas.calcule_debits({
		type_ventilation: item.type,
		installation_collective: item.installation_collective,
		annee_installation: annee_installation(ctx, item),
		presence_echangeur_thermique: presence_echangeur_thermique(item),
	});
}

export function qvarep_conv(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_debits>["qvarep_conv"] {
	return ctx.once(ID, "debits", item, () => debits(ctx, item)["qvarep_conv"]);
}

export function qvasouf_conv(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_debits>["qvasouf_conv"] {
	return ctx.once(ID, "debits", item, () => debits(ctx, item)["qvasouf_conv"]);
}

export function smea_conv(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_debits>["smea_conv"] {
	return ctx.once(ID, "debits", item, () => debits(ctx, item)["smea_conv"]);
}

export function hvent(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.calcule_hvent> {
	return formulas.calcule_hvent({
		sh: item.surface,
		rdim: ctx.resolve(ID, RULES.rdim, item),
		qvarep_conv: ctx.resolve(ID, RULES.qvarep_conv, item),
	});
}

export function annee_installation(
	ctx: Context,
	item: Installation,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: item.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}

export function presence_echangeur_thermique(
	item: Installation,
): ReturnType<typeof formulas.set_presence_echangeur_thermique> {
	return formulas.set_presence_echangeur_thermique({
		presence_echangeur_thermique: item.presence_echangeur_thermique,
	});
}
