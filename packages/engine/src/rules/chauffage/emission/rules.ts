import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.cch]: cch,
		[RULES.cch1]: cch1,
		[RULES.cch2]: cch2,
		[RULES.ich]: ich,
		[RULES.ich1]: ich1,
		[RULES.ich2]: ich2,
		[RULES.re]: re,
		[RULES.rr]: rr,
		[RULES.int]: int,
		[RULES.i0]: i0,
		[RULES.type]: type,
	},
};

export type Emission = {
	id: string;
	systeme_id: string;
	emetteur_id: string | null;
	type_distribution: models.chauffage.systeme.TypeDistribution | null;
	presence_robinet_thermostatique: boolean | null;
};

export function cch(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_cch> {
	return ctx.register(NAMESPACE, RULES.cch, item, () => {
		return formulas.calcule_cch({
			cch1: cch1(ctx, item),
			cch2: cch2(ctx, item),
		});
	});
}

export function cch1(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_cch1> {
	return ctx.register(NAMESPACE, RULES.cch1, item, () => {
		const generateur = _generateur(ctx, item);
		const installation = _installation(ctx, item);
		const systeme = _systeme(ctx, item);

		return formulas.calcule_cch1({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			pac_hybride: models.chauffage.generateur.isPacHybride(generateur),
			bch: ctx.resolve(
				constants.chauffage.systeme.NAMESPACE,
				constants.chauffage.systeme.RULES.bch,
				systeme,
			),
			fch: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.fch,
				installation,
			),
			rdim_i: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.rdim,
				installation,
			),
			rdim: ctx.resolve(
				constants.chauffage.systeme.NAMESPACE,
				constants.chauffage.systeme.RULES.rdim,
				systeme,
			),
			int: int(ctx, item),
			ich1: ich1(ctx, item),
			n: Math.max(systeme.reseau?.emetteurs.length ?? 1, 1),
		});
	});
}

export function cch2(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_cch2> {
	return ctx.register(NAMESPACE, RULES.cch2, item, () => {
		const generateur = _generateur(ctx, item);
		const installation = _installation(ctx, item);
		const systeme = _systeme(ctx, item);

		return formulas.calcule_cch2({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			pac_hybride: models.chauffage.generateur.isPacHybride(generateur),
			bch: ctx.resolve(
				constants.chauffage.systeme.NAMESPACE,
				constants.chauffage.systeme.RULES.bch,
				systeme,
			),
			fch: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.fch,
				installation,
			),
			rdim_i: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.rdim,
				installation,
			),
			rdim: ctx.resolve(
				constants.chauffage.systeme.NAMESPACE,
				constants.chauffage.systeme.RULES.rdim,
				systeme,
			),
			int: int(ctx, item),
			ich2: ich2(ctx, item) ?? 0,
			n: Math.max(systeme.reseau?.emetteurs.length ?? 1, 1),
		});
	});
}

export function ich(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_ich> {
	return ctx.register(NAMESPACE, RULES.ich, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_ich({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			pac_hybride: models.chauffage.generateur.isPacHybride(generateur),
			ich1: ich1(ctx, item),
			ich2: ich2(ctx, item),
		});
	});
}

export function ich1(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_ich1> {
	return ctx.register(NAMESPACE, RULES.ich1, item, () => {
		const generateur = _generateur(ctx, item);
		const systeme = _systeme(ctx, item);
		return formulas.calcule_ich1({
			re: re(ctx, item),
			rr: rr(ctx, item),
			rd: ctx.resolve(
				constants.chauffage.systeme.NAMESPACE,
				constants.chauffage.systeme.RULES.rd,
				systeme,
			),
			rg: ctx.resolve(
				constants.chauffage.systeme.NAMESPACE,
				constants.chauffage.systeme.RULES.rg,
				systeme,
			),
			scop: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.scop,
				generateur,
			),
		});
	});
}

export function ich2(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_ich2> | null {
	return ctx.register(NAMESPACE, RULES.ich2, item, () => {
		const generateur = _generateur(ctx, item);
		const systeme = _systeme(ctx, item);
		return models.chauffage.generateur.isPacHybride(generateur)
			? formulas.calcule_ich2({
					rd: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.rd,
						systeme,
					),
					rg: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.rg,
						systeme,
					),
					re: re(ctx, item),
					rr: rr(ctx, item),
				})
			: null;
	});
}

export function re(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_re> {
	return ctx.register(NAMESPACE, RULES.re, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_re({
			type_emission: type(ctx, item),
			type_generateur: generateur.type_generateur,
			label_generateur: generateur.label_generateur,
		});
	});
}

export function rr(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_rr> {
	return ctx.register(NAMESPACE, RULES.rr, item, () => {
		const generateur = _generateur(ctx, item);
		const installation = _installation(ctx, item);
		return formulas.calcule_rr({
			type_emission: type(ctx, item),
			type_generateur: generateur.type_generateur,
			label_generateur: generateur.label_generateur,
			reseau_collectif: installation.installation_collective,
			presence_robinet_thermostatique: item.presence_robinet_thermostatique,
			presence_regulation_terminale: installation.regulation_terminale,
		});
	});
}

export function int(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_int> {
	return ctx.register(NAMESPACE, RULES.int, item, () => {
		return formulas.calcule_int({
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			hsp: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.hsp,
			),
			i0: i0(ctx, item),
		});
	});
}

export function i0(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_i0> {
	return ctx.register(NAMESPACE, RULES.i0, item, () => {
		const installation = _installation(ctx, item);
		const generateur = _generateur(ctx, item);
		return formulas.calcule_i0({
			type_batiment: ctx.diagnostic.batiment.type,
			type_chauffage: installation.type,
			type_emission: type(ctx, item),
			inertie: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.inertie,
			),
			installation_collective: installation.installation_collective,
			comptage_individuel: installation.comptage_individuel,
			regulation_terminale: installation.regulation_terminale,
			type_programmation: installation.programmation,
			type_generateur: generateur.type_generateur,
		});
	});
}

export function type(
	ctx: Context,
	item: Emission,
): ReturnType<typeof formulas.calcule_type_emission> {
	return ctx.register(NAMESPACE, RULES.type, item, () => {
		const generateur = _generateur(ctx, item);
		const emetteur = _emetteur(ctx, item);
		return formulas.calcule_type_emission({
			type_generateur: generateur.type_generateur,
			type_distribution: item.type_distribution,
			type_emetteur: emetteur?.type ?? null,
		});
	});
}

function _emetteur(ctx: Context, item: Emission) {
	return ctx.once(NAMESPACE, "emetteur", item, () => {
		if (!item.emetteur_id) return null;
		return models.chauffage.findEmetteur(
			item.emetteur_id,
			ctx.diagnostic.chauffage,
		);
	});
}

function _systeme(ctx: Context, item: Emission) {
	return ctx.once(NAMESPACE, "systeme", item, () =>
		models.chauffage.findSysteme(item.systeme_id, ctx.diagnostic.chauffage),
	);
}

function _installation(ctx: Context, item: Emission) {
	return ctx.once(NAMESPACE, "installation", item, () =>
		models.chauffage.findInstallationBySysteme(
			item.systeme_id,
			ctx.diagnostic.chauffage,
		),
	);
}

function _generateur(ctx: Context, item: Emission) {
	return ctx.once(NAMESPACE, "generateur", item, () => {
		const systeme = _systeme(ctx, item);
		const generateur = models.chauffage.findGenerateur(
			systeme.generateur_id,
			ctx.diagnostic.chauffage,
		);
		return {
			...generateur,
			label_generateur: generateur.signaletique.label,
			type_generateur: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.type_generateur,
				generateur,
			),
		};
	});
}
