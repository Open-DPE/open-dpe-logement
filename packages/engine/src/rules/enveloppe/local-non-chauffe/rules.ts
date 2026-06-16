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
					..._baies_lnc(ctx, item).map((paroi) => ({
						surface: paroi.position.surface,
						b: ctx.resolve(
							constants.enveloppe.baie.NAMESPACE,
							constants.enveloppe.baie.RULES.b,
							paroi,
						),
					})),
					..._murs_lnc(ctx, item).map((paroi) => ({
						surface: paroi.position.surface,
						b: ctx.resolve(
							constants.enveloppe.mur.NAMESPACE,
							constants.enveloppe.mur.RULES.b,
							paroi,
						),
					})),
					..._planchers_bas_lnc(ctx, item).map((paroi) => ({
						surface: paroi.position.surface,
						b: ctx.resolve(
							constants.enveloppe.plancherBas.NAMESPACE,
							constants.enveloppe.plancherBas.RULES.b,
							paroi,
						),
					})),
					..._planchers_hauts_lnc(ctx, item).map((paroi) => ({
						surface: paroi.position.surface,
						b: ctx.resolve(
							constants.enveloppe.plancherHaut.NAMESPACE,
							constants.enveloppe.plancherHaut.RULES.b,
							paroi,
						),
					})),
					..._portes_lnc(ctx, item).map((paroi) => ({
						surface: paroi.position.surface,
						b: ctx.resolve(
							constants.enveloppe.porte.NAMESPACE,
							constants.enveloppe.porte.RULES.b,
							paroi,
						),
					})),
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
			parois: item.parois.map((paroi) => ({
				aue: ctx.resolve(
					constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
					constants.enveloppe.localNonChauffe.paroi.RULES.aue,
					paroi,
				),
			})),
			baies: item.baies.map((baie) => ({
				aue: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.aue,
					baie,
				),
			})),
		}),
	);
}

export function isolation_aue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_isolation_aue> {
	return ctx.register(NAMESPACE, RULES.isolation_aue, item, () =>
		formulas.calcule_isolation_aue({
			parois: item.parois.map((paroi) => ({
				aue: ctx.resolve(
					constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
					constants.enveloppe.localNonChauffe.paroi.RULES.aue,
					paroi,
				),
				isolation: ctx.resolve(
					constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
					constants.enveloppe.localNonChauffe.paroi.RULES.isolation,
					paroi,
				),
			})),
			baies: item.baies.map((baie) => ({
				aue: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.aue,
					baie,
				),
				isolation: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.isolation,
					baie,
				),
			})),
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
				..._baies_lnc(ctx, item).map((paroi) => ({
					aiu: ctx.resolve(
						constants.enveloppe.baie.NAMESPACE,
						constants.enveloppe.baie.RULES.aiu,
						paroi,
					),
				})),
				..._murs_lnc(ctx, item).map((paroi) => ({
					aiu: ctx.resolve(
						constants.enveloppe.mur.NAMESPACE,
						constants.enveloppe.mur.RULES.aiu,
						paroi,
					),
				})),
				..._planchers_bas_lnc(ctx, item).map((paroi) => ({
					aiu: ctx.resolve(
						constants.enveloppe.plancherBas.NAMESPACE,
						constants.enveloppe.plancherBas.RULES.aiu,
						paroi,
					),
				})),
				..._planchers_hauts_lnc(ctx, item).map((paroi) => ({
					aiu: ctx.resolve(
						constants.enveloppe.plancherHaut.NAMESPACE,
						constants.enveloppe.plancherHaut.RULES.aiu,
						paroi,
					),
				})),
				..._portes_lnc(ctx, item).map((paroi) => ({
					aiu: ctx.resolve(
						constants.enveloppe.porte.NAMESPACE,
						constants.enveloppe.porte.RULES.aiu,
						paroi,
					),
				})),
			],
			parois: item.parois.map((paroi) => ({
				aiu: ctx.resolve(
					constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
					constants.enveloppe.localNonChauffe.paroi.RULES.aiu,
					paroi,
				),
			})),
			baies: item.baies.map((baie) => ({
				aiu: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.aiu,
					baie,
				),
			})),
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
				..._baies_lnc(ctx, item).map((paroi) => ({
					isolation: ctx.resolve(
						constants.enveloppe.baie.NAMESPACE,
						constants.enveloppe.baie.RULES.isolation_aiu,
						paroi,
					),
					aiu: ctx.resolve(
						constants.enveloppe.baie.NAMESPACE,
						constants.enveloppe.baie.RULES.aiu,
						paroi,
					),
				})),
				..._murs_lnc(ctx, item).map((paroi) => ({
					isolation: ctx.resolve(
						constants.enveloppe.mur.NAMESPACE,
						constants.enveloppe.mur.RULES.isolation_aiu,
						paroi,
					),
					aiu: ctx.resolve(
						constants.enveloppe.mur.NAMESPACE,
						constants.enveloppe.mur.RULES.aiu,
						paroi,
					),
				})),
				..._planchers_bas_lnc(ctx, item).map((paroi) => ({
					isolation: ctx.resolve(
						constants.enveloppe.plancherBas.NAMESPACE,
						constants.enveloppe.plancherBas.RULES.isolation_aiu,
						paroi,
					),
					aiu: ctx.resolve(
						constants.enveloppe.plancherBas.NAMESPACE,
						constants.enveloppe.plancherBas.RULES.aiu,
						paroi,
					),
				})),
				..._planchers_hauts_lnc(ctx, item).map((paroi) => ({
					isolation: ctx.resolve(
						constants.enveloppe.plancherHaut.NAMESPACE,
						constants.enveloppe.plancherHaut.RULES.isolation_aiu,
						paroi,
					),
					aiu: ctx.resolve(
						constants.enveloppe.plancherHaut.NAMESPACE,
						constants.enveloppe.plancherHaut.RULES.aiu,
						paroi,
					),
				})),
				..._portes_lnc(ctx, item).map((paroi) => ({
					isolation: ctx.resolve(
						constants.enveloppe.porte.NAMESPACE,
						constants.enveloppe.porte.RULES.isolation_aiu,
						paroi,
					),
					aiu: ctx.resolve(
						constants.enveloppe.porte.NAMESPACE,
						constants.enveloppe.porte.RULES.aiu,
						paroi,
					),
				})),
			],
			parois: item.parois.map((paroi) => ({
				isolation: ctx.resolve(
					constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
					constants.enveloppe.localNonChauffe.paroi.RULES.isolation,
					paroi,
				),
				aiu: ctx.resolve(
					constants.enveloppe.localNonChauffe.paroi.NAMESPACE,
					constants.enveloppe.localNonChauffe.paroi.RULES.aiu,
					paroi,
				),
			})),
			baies: item.baies.map((baie) => ({
				isolation: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.isolation,
					baie,
				),
				aiu: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.aiu,
					baie,
				),
			})),
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
			baies: item.baies.map((baie) => ({
				sst: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.sst,
					baie,
				),
			})),
			sse: _baies_lnc(ctx, item).map((i) =>
				ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.sse,
					i,
				),
			),
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
			baies: item.baies.map((b) => ({
				mitoyennete: b.position.mitoyennete,
				surface: b.position.surface,
				t: ctx.resolve(
					constants.enveloppe.localNonChauffe.baie.NAMESPACE,
					constants.enveloppe.localNonChauffe.baie.RULES.t,
					b,
				),
			})),
		}),
	);
}

function _baies_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "baies_lnc", item, () =>
		models.enveloppe.getBaiesLocalNonChauffe(ctx.diagnostic.enveloppe, item.id),
	);
}

function _murs_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "murs_lnc", item, () =>
		models.enveloppe.getMursLocalNonChauffe(ctx.diagnostic.enveloppe, item.id),
	);
}

function _planchers_bas_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "planchers_bas_lnc", item, () =>
		models.enveloppe.getPlanchersBasLocalNonChauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		),
	);
}

function _planchers_hauts_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "planchers_hauts_lnc", item, () =>
		models.enveloppe.getPlanchersHautsLocalNonChauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		),
	);
}

function _portes_lnc(ctx: Context, item: LocalNonChauffe) {
	return ctx.once(NAMESPACE, "portes_lnc", item, () =>
		models.enveloppe.getPortesLocalNonChauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		),
	);
}
