import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as paroiRules from "./paroi/rules.js";
import * as baieRules from "./baie/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export { paroiRules as paroi, baieRules as baie };

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.b]: b,
		[RULES.uvue]: uvue,
		[RULES.aiu]: aiu,
		[RULES.aue]: aue,
		[RULES.isolation_aiu]: isolation_aiu,
		[RULES.isolation_aue]: isolation_aue,
		[RULES.sse]: sse,
		[RULES.orientations]: orientations,
		[RULES.t]: t,
	},

	...baieRules.REGISTRY,
	...paroiRules.REGISTRY,
};

type LocalNonChauffe = models.enveloppe.localNonChauffe.LocalNonChauffe;

export function b(ctx: Context, item: LocalNonChauffe): formulas.b {
	return ctx.register(NAMESPACE, RULES.b, item, () => {
		if (models.enveloppe.localNonChauffe.isEspaceTamponSolarise(item)) {
			return formulas.calcule_bver({
				parois: [
					..._baies_lnc(ctx, item),
					..._murs_lnc(ctx, item),
					..._planchers_bas_lnc(ctx, item),
					..._planchers_hauts_lnc(ctx, item),
					..._portes_lnc(ctx, item),
				],
			});
		}
		return formulas.calcule_blnc({
			uvue: uvue(ctx, item) ?? 0,
			aue: aue(ctx, item),
			aiu: aiu(ctx, item),
			isolation_aue: isolation_aue(ctx, item),
			isolation_aiu: isolation_aiu(ctx, item),
		});
	});
}

export function uvue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_uvue> | null {
	return ctx.register(NAMESPACE, RULES.uvue, item, () =>
		models.enveloppe.localNonChauffe.isAutreLocalNonChauffe(item)
			? formulas.calcule_uvue({ type_local_non_chauffe: item.type })
			: null,
	);
}

export function aue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_aue> {
	return ctx.register(NAMESPACE, RULES.aue, item, () =>
		formulas.calcule_aue({
			parois: _parois(ctx, item),
			baies: _baies(ctx, item),
		}),
	);
}

export function isolation_aue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_isolation_aue> {
	return ctx.register(NAMESPACE, RULES.isolation_aue, item, () =>
		formulas.calcule_isolation_aue({
			parois: _parois(ctx, item),
			baies: _baies(ctx, item),
		}),
	);
}

export function aiu(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () =>
		formulas.calcule_aiu({
			parois_mitoyennes: [
				..._baies_lnc(ctx, item),
				..._murs_lnc(ctx, item),
				..._planchers_bas_lnc(ctx, item),
				..._planchers_hauts_lnc(ctx, item),
				..._portes_lnc(ctx, item),
			],
			parois: _parois(ctx, item),
			baies: _baies(ctx, item),
		}),
	);
}

export function isolation_aiu(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return ctx.register(NAMESPACE, RULES.isolation_aiu, item, () =>
		formulas.calcule_isolation_aiu({
			parois_mitoyennes: [
				..._baies_lnc(ctx, item),
				..._murs_lnc(ctx, item),
				..._planchers_bas_lnc(ctx, item),
				..._planchers_hauts_lnc(ctx, item),
				..._portes_lnc(ctx, item),
			],
			parois: _parois(ctx, item),
			baies: _baies(ctx, item),
		}),
	);
}

export function orientations(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_orientations> {
	return ctx.register(NAMESPACE, RULES.orientations, item, () =>
		formulas.calcule_orientations({
			baies: item.baies.map((b) => ({
				mitoyennete: b.position.mitoyennete,
				orientation: b.position.orientation,
				surface: b.position.surface,
			})),
		}),
	);
}

export function sse(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_sse> {
	return ctx.register(NAMESPACE, RULES.sse, item, () =>
		formulas.calcule_sse({
			baies: _baies(ctx, item),
			sse: _baies_lnc(ctx, item).map((i) => i.sse),
			b: b(ctx, item),
		}),
	);
}

export function t(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_t> {
	return ctx.register(NAMESPACE, RULES.t, item, () =>
		formulas.calcule_t({
			type_local_non_chauffe: item.type,
			baies: _baies(ctx, item),
		}),
	);
}

function _baies(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "baies", item, () =>
		item.baies.map((i) => ({
			surface: i.position.surface,
			mitoyennete: i.position.mitoyennete,
			aue: ctx.resolve(
				constants.enveloppe.localNonChauffe.baie.NAMESPACE,
				constants.enveloppe.localNonChauffe.baie.RULES.aue,
				i,
			),
			aiu: ctx.resolve(
				constants.enveloppe.localNonChauffe.baie.NAMESPACE,
				constants.enveloppe.localNonChauffe.baie.RULES.aiu,
				i,
			),
			sst: ctx.resolve(
				constants.enveloppe.localNonChauffe.baie.NAMESPACE,
				constants.enveloppe.localNonChauffe.baie.RULES.sst,
				i,
			),
			t: ctx.resolve(
				constants.enveloppe.localNonChauffe.baie.NAMESPACE,
				constants.enveloppe.localNonChauffe.baie.RULES.t,
				i,
			),
			isolation: ctx.resolve(
				constants.enveloppe.localNonChauffe.baie.NAMESPACE,
				constants.enveloppe.localNonChauffe.baie.RULES.isolation,
				i,
			),
		})),
	);
}

function _parois(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "parois", item, () =>
		item.parois.map((i) => ({
			surface: i.position.surface,
			mitoyennete: i.position.mitoyennete,
			aue: ctx.resolve(
				constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
				constants.enveloppe.localNonChauffe.paroi.RULES.aue,
				i,
			),
			aiu: ctx.resolve(
				constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
				constants.enveloppe.localNonChauffe.paroi.RULES.aiu,
				i,
			),
			isolation: ctx.resolve(
				constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
				constants.enveloppe.localNonChauffe.paroi.RULES.isolation,
				i,
			),
		})),
	);
}

function _baies_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "baies_lnc", item, () =>
		models.enveloppe
			.getBaiesLocalNonChauffe(ctx.diagnostic.enveloppe, item.id)
			.map((i) => ({
				surface: i.position.surface,
				b: ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.b,
					i,
				),
				aiu: ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.aiu,
					i,
				),
				isolation: ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.isolation_aiu,
					i,
				),
				sse: ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.sse,
					i,
				),
			})),
	);
}

function _murs_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "murs_lnc", item, () =>
		models.enveloppe
			.getMursLocalNonChauffe(ctx.diagnostic.enveloppe, item.id)
			.map((i) => ({
				surface: i.position.surface,
				b: ctx.resolve(
					constants.enveloppe.mur.NAMESPACE,
					constants.enveloppe.mur.RULES.b,
					i,
				),
				aiu: ctx.resolve(
					constants.enveloppe.mur.NAMESPACE,
					constants.enveloppe.mur.RULES.aiu,
					i,
				),
				isolation: ctx.resolve(
					constants.enveloppe.mur.NAMESPACE,
					constants.enveloppe.mur.RULES.isolation_aiu,
					i,
				),
			})),
	);
}

function _planchers_bas_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "planchers_bas_lnc", item, () =>
		models.enveloppe
			.getPlanchersBasLocalNonChauffe(ctx.diagnostic.enveloppe, item.id)
			.map((i) => ({
				surface: i.position.surface,
				b: ctx.resolve(
					constants.enveloppe.plancherBas.NAMESPACE,
					constants.enveloppe.plancherBas.RULES.b,
					i,
				),
				aiu: ctx.resolve(
					constants.enveloppe.plancherBas.NAMESPACE,
					constants.enveloppe.plancherBas.RULES.aiu,
					i,
				),
				isolation: ctx.resolve(
					constants.enveloppe.plancherBas.NAMESPACE,
					constants.enveloppe.plancherBas.RULES.isolation_aiu,
					i,
				),
			})),
	);
}

function _planchers_hauts_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "planchers_hauts_lnc", item, () =>
		models.enveloppe
			.getPlanchersHautsLocalNonChauffe(ctx.diagnostic.enveloppe, item.id)
			.map((i) => ({
				surface: i.position.surface,
				b: ctx.resolve(
					constants.enveloppe.plancherHaut.NAMESPACE,
					constants.enveloppe.plancherHaut.RULES.b,
					i,
				),
				aiu: ctx.resolve(
					constants.enveloppe.plancherHaut.NAMESPACE,
					constants.enveloppe.plancherHaut.RULES.aiu,
					i,
				),
				isolation: ctx.resolve(
					constants.enveloppe.plancherHaut.NAMESPACE,
					constants.enveloppe.plancherHaut.RULES.isolation_aiu,
					i,
				),
			})),
	);
}

function _portes_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "portes_lnc", item, () =>
		models.enveloppe
			.getPortesLocalNonChauffe(ctx.diagnostic.enveloppe, item.id)
			.map((i) => ({
				surface: i.position.surface,
				b: ctx.resolve(
					constants.enveloppe.porte.NAMESPACE,
					constants.enveloppe.porte.RULES.b,
					i,
				),
				aiu: ctx.resolve(
					constants.enveloppe.porte.NAMESPACE,
					constants.enveloppe.porte.RULES.aiu,
					i,
				),
				isolation: ctx.resolve(
					constants.enveloppe.porte.NAMESPACE,
					constants.enveloppe.porte.RULES.isolation_aiu,
					i,
				),
			})),
	);
}
