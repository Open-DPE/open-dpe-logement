import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as baieRule from "#rules/enveloppe/baie/registry.js";
import * as murRule from "#rules/enveloppe/mur/registry.js";
import * as plancherBasRule from "#rules/enveloppe/plancher-bas/registry.js";
import * as plancherHautRule from "#rules/enveloppe/plancher-haut/registry.js";
import * as porteRule from "#rules/enveloppe/porte/registry.js";
import * as baie from "./baie/index.js";
import * as paroi from "./paroi/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	baie.rules.register(ctx);
	paroi.rules.register(ctx);

	ctx.diagnostic.enveloppe.locaux_non_chauffes.forEach((item) => {
		ctx.register(ID, RULES.b, item, () => b(ctx, item));
		ctx.register(ID, RULES.uvue, item, () => uvue(item));
		ctx.register(ID, RULES.aiu, item, () => aiu(ctx, item));
		ctx.register(ID, RULES.aue, item, () => aue(ctx, item));
		ctx.register(ID, RULES.isolation_aiu, item, () => isolation_aiu(ctx, item));
		ctx.register(ID, RULES.isolation_aue, item, () => isolation_aue(ctx, item));
		ctx.register(ID, RULES.sse, item, () => sse(ctx, item));
		ctx.register(ID, RULES.orientations, item, () => orientations(item));
		ctx.register(ID, RULES.t, item, () => t(ctx, item));
	});
}

type LocalNonChauffe = models.enveloppe.localNonChauffe.LocalNonChauffe;

export function b(ctx: Context, item: LocalNonChauffe): formulas.B {
	if (models.enveloppe.localNonChauffe.isEspaceTamponSolarise(item)) {
		const baies = models.enveloppe.get_baies_local_non_chauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		);
		const murs = models.enveloppe.get_murs_local_non_chauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		);
		const planchers_bas = models.enveloppe.get_planchers_bas_local_non_chauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		);
		const planchers_hauts =
			models.enveloppe.get_planchers_hauts_local_non_chauffe(
				ctx.diagnostic.enveloppe,
				item.id,
			);
		const portes = models.enveloppe.get_portes_local_non_chauffe(
			ctx.diagnostic.enveloppe,
			item.id,
		);
		return formulas.calcule_bver({
			parois: [
				...baies.map((i) => ({
					surface: i.position.surface,
					b: ctx.resolve(baieRule.ID, baieRule.RULES.b, i),
				})),
				...murs.map((i) => ({
					surface: i.position.surface,
					b: ctx.resolve(murRule.ID, murRule.RULES.b, i),
				})),
				...planchers_bas.map((i) => ({
					surface: i.position.surface,
					b: ctx.resolve(plancherBasRule.ID, plancherBasRule.RULES.b, i),
				})),
				...planchers_hauts.map((i) => ({
					surface: i.position.surface,
					b: ctx.resolve(plancherHautRule.ID, plancherHautRule.RULES.b, i),
				})),
				...portes.map((i) => ({
					surface: i.position.surface,
					b: ctx.resolve(porteRule.ID, porteRule.RULES.b, i),
				})),
			],
		});
	}
	return formulas.calcule_blnc({
		uvue: ctx.resolve(ID, RULES.uvue, item),
		aue: ctx.resolve(ID, RULES.aue, item),
		aiu: ctx.resolve(ID, RULES.aiu, item),
		isolation_aue: ctx.resolve(ID, RULES.isolation_aue, item),
		isolation_aiu: ctx.resolve(ID, RULES.isolation_aiu, item),
	});
}

export function uvue(
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_uvue> | null {
	return models.enveloppe.localNonChauffe.isAutreLocalNonChauffe(item)
		? formulas.calcule_uvue({ type_local_non_chauffe: item.type })
		: null;
}

export function uvue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_uvue> | null {
	return ctx.register(ID, RULES.uvue, item, () =>
		models.enveloppe.localNonChauffe.isAutreLocalNonChauffe(item)
			? formulas.calcule_uvue({ type_local_non_chauffe: item.type })
			: null,
	);
}

export function aue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_aue> {
	const parois = item.parois.map((p) => ({
		aue: ctx.resolve(paroi.ID, paroi.RULES.aue, p),
		isolation: paroi.rules.isolation(p),
	}));
	const baies = item.baies.map((b) => ({
		aue: ctx.resolve(baie.ID, baie.RULES.aue, b),
		isolation: baie.rules.isolation(b),
	}));
	return formulas.calcule_aue({
		parois,
		baies,
	});
}

export function isolation_aue(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_isolation_aue> {
	const parois = item.parois.map((p) => ({
		aue: ctx.resolve(paroi.ID, paroi.RULES.aue, p),
		isolation: paroi.rules.isolation(p),
	}));
	const baies = item.baies.map((b) => ({
		aue: ctx.resolve(baie.ID, baie.RULES.aue, b),
		isolation: baie.rules.isolation(b),
	}));
	return formulas.calcule_isolation_aue({
		parois,
		baies,
	});
}

export function aiu(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_aiu> {
	const parois_mitoyennes = [
		..._baies(ctx, item),
		..._murs(ctx, item),
		..._planchers_bas(ctx, item),
		..._planchers_hauts(ctx, item),
		..._portes(ctx, item),
	];
	const parois = item.parois.map((p) => ({
		aiu: ctx.resolve(paroi.ID, paroi.RULES.aiu, p),
		isolation: paroi.rules.isolation(p),
	}));
	const baies = item.baies.map((b) => ({
		aiu: ctx.resolve(baie.ID, baie.RULES.aiu, b),
		isolation: baie.rules.isolation(b),
	}));
	return formulas.calcule_aiu({
		parois_mitoyennes,
		parois,
		baies,
	});
}

export function isolation_aiu(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	const parois_mitoyennes = [
		..._baies(ctx, item),
		..._murs(ctx, item),
		..._planchers_bas(ctx, item),
		..._planchers_hauts(ctx, item),
		..._portes(ctx, item),
	];
	const parois = item.parois.map((p) => ({
		aiu: ctx.resolve(paroi.ID, paroi.RULES.aiu, p),
		isolation: paroi.rules.isolation(p),
	}));
	const baies = item.baies.map((b) => ({
		aiu: ctx.resolve(baie.ID, baie.RULES.aiu, b),
		isolation: baie.rules.isolation(b),
	}));
	return formulas.calcule_isolation_aiu({
		parois_mitoyennes,
		parois,
		baies,
	});
}

export function orientations(
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_orientations> {
	return formulas.calcule_orientations({
		baies: item.baies.map((b) => ({
			mitoyennete: b.position.mitoyennete,
			orientation: b.position.orientation,
			surface: b.position.surface,
		})),
	});
}

export function sse(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_sse> {
	return formulas.calcule_sse({
		baies: item.baies.map((b) => ({
			sst: ctx.resolve(baie.ID, baie.RULES.sst, b),
		})),
		sse: models.enveloppe
			.get_baies_local_non_chauffe(ctx.diagnostic.enveloppe, item.id)
			.map((b) => ctx.resolve(baieRule.ID, baieRule.RULES.sse, b)),
		b: ctx.resolve(ID, RULES.b, item),
	});
}

export function t(
	ctx: Context,
	item: LocalNonChauffe,
): ReturnType<typeof formulas.calcule_t> {
	return formulas.calcule_t({
		type_local_non_chauffe: item.type,
		baies: item.baies.map((i) => ({
			mitoyennete: i.position.mitoyennete,
			surface: i.position.surface,
			t: ctx.resolve(baie.ID, baie.RULES.t, i),
		})),
	});
}

function _baies(ctx: Context, item: LocalNonChauffe) {
	return models.enveloppe
		.get_baies_local_non_chauffe(ctx.diagnostic.enveloppe, item.id)
		.map((i) => ({
			surface: i.position.surface,
			aiu: ctx.resolve(baieRule.ID, baieRule.RULES.aiu, i),
			isolation: ctx.resolve(baieRule.ID, baieRule.RULES.isolation_aiu, i),
		}));
}

function _murs(ctx: Context, item: LocalNonChauffe) {
	return models.enveloppe
		.get_murs_local_non_chauffe(ctx.diagnostic.enveloppe, item.id)
		.map((i) => ({
			surface: i.position.surface,
			aiu: ctx.resolve(murRule.ID, murRule.RULES.aiu, i),
			isolation: ctx.resolve(murRule.ID, murRule.RULES.isolation_aiu, i),
		}));
}

function _planchers_bas(ctx: Context, item: LocalNonChauffe) {
	return models.enveloppe
		.get_planchers_bas_local_non_chauffe(ctx.diagnostic.enveloppe, item.id)
		.map((i) => ({
			surface: i.position.surface,
			aiu: ctx.resolve(plancherBasRule.ID, plancherBasRule.RULES.aiu, i),
			isolation: ctx.resolve(
				plancherBasRule.ID,
				plancherBasRule.RULES.isolation_aiu,
				i,
			),
		}));
}

function _planchers_hauts(ctx: Context, item: LocalNonChauffe) {
	return models.enveloppe
		.get_planchers_hauts_local_non_chauffe(ctx.diagnostic.enveloppe, item.id)
		.map((i) => ({
			surface: i.position.surface,
			aiu: ctx.resolve(plancherHautRule.ID, plancherHautRule.RULES.aiu, i),
			isolation: ctx.resolve(
				plancherHautRule.ID,
				plancherHautRule.RULES.isolation_aiu,
				i,
			),
		}));
}

function _portes(ctx: Context, item: LocalNonChauffe) {
	return models.enveloppe
		.get_portes_local_non_chauffe(ctx.diagnostic.enveloppe, item.id)
		.map((i) => ({
			surface: i.position.surface,
			aiu: ctx.resolve(porteRule.ID, porteRule.RULES.aiu, i),
			isolation: ctx.resolve(porteRule.ID, porteRule.RULES.isolation_aiu, i),
		}));
}

export function applique(
	ctx: Context,
	item: LocalNonChauffe,
): models.enveloppe.localNonChauffe.LocalNonChauffeWithData {
	return {
		...item,
		data: {
			b: ctx.resolve(ID, RULES.b, item),
			aiu: ctx.resolve(ID, RULES.aiu, item),
			aue: ctx.resolve(ID, RULES.aue, item),
			isolation_aiu: ctx.resolve(ID, RULES.isolation_aiu, item),
			isolation_aue: ctx.resolve(ID, RULES.isolation_aue, item),
			sse: Object.values(ctx.resolve(ID, RULES.sse, item)).reduce(
				(s: number, n: number) => s + n,
				0,
			),
			orientations: ctx.resolve(ID, RULES.orientations, item),
			t: ctx.resolve(ID, RULES.t, item),
		},
	};
}
