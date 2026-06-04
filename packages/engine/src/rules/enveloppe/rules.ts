import type { Context } from "#core/context.js";
import { toNonEmptyArray } from "#utils/helpers.js";
import * as batiment from "#rules/batiment/registry.js";
import * as baie from "./baie/index.js";
import * as localNonChauffe from "./local-non-chauffe/index.js";
import * as mur from "./mur/index.js";
import * as niveau from "./niveau/index.js";
import * as plancherBas from "./plancher-bas/index.js";
import * as plancherHaut from "./plancher-haut/index.js";
import * as pontThermique from "./pont-thermique/index.js";
import * as porte from "./porte/index.js";
import * as ventilation from "#rules/ventilation/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	baie.rules.register(ctx);
	localNonChauffe.rules.register(ctx);
	mur.rules.register(ctx);
	niveau.rules.register(ctx);
	plancherBas.rules.register(ctx);
	plancherHaut.rules.register(ctx);
	pontThermique.rules.register(ctx);
	porte.rules.register(ctx);

	ctx.register(ID, RULES.gv, () => gv(ctx));
	ctx.register(ID, RULES.ubat, () => ubat(ctx));
	ctx.register(ID, RULES.dp, () => dp(ctx));
	ctx.register(ID, RULES.dr, () => dr(ctx));
	ctx.register(ID, RULES.inertie, () => inertie(ctx));
	ctx.register(ID, RULES.hperm, () => hperm(ctx));
	ctx.register(ID, RULES.qvinf, () => qvinf(ctx));
	ctx.register(ID, RULES.n50, () => n50(ctx));
	ctx.register(ID, RULES.q4pa, () => q4pa(ctx));
	ctx.register(ID, RULES.q4paenv, () => q4paenv(ctx));
	ctx.register(ID, RULES.q4paconv, () => q4paconv(ctx));
	ctx.register(ID, RULES.isolation_murs_plafonds, () =>
		isolation_murs_plafonds(ctx),
	);
	ctx.register(ID, RULES.presence_joints, () => presence_joints(ctx));
	ctx.register(ID, RULES.parois_anciennes, () => parois_anciennes(ctx));
	ctx.register(ID, RULES.sse, () => sse(ctx));
}

export function gv(ctx: Context): ReturnType<typeof formulas.calcule_gv> {
	return formulas.calcule_gv({
		dp: ctx.resolve(ID, RULES.dp),
		pt: ctx.resolve(ID, RULES.pt),
		dr: ctx.resolve(ID, RULES.dr),
	});
}

export function ubat(ctx: Context): ReturnType<typeof formulas.calcule_ubat> {
	return formulas.calcule_ubat({
		dp: ctx.resolve(ID, RULES.dp),
		pt: ctx.resolve(ID, RULES.pt),
		sdep: ctx.resolve(ID, RULES.sdep),
	});
}

export function dp(ctx: Context): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		dp: [
			ctx.resolve(ID, RULES.dp_murs),
			ctx.resolve(ID, RULES.dp_planchers_bas),
			ctx.resolve(ID, RULES.dp_planchers_hauts),
			ctx.resolve(ID, RULES.dp_baies),
			ctx.resolve(ID, RULES.dp_portes),
		],
	});
}

export function dp_murs(ctx: Context): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		dp: ctx.diagnostic.enveloppe.murs.map((item) =>
			ctx.resolve(mur.ID, mur.RULES.dp, item),
		),
	});
}

export function dp_planchers_bas(
	ctx: Context,
): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		dp: ctx.diagnostic.enveloppe.planchers_bas.map((item) =>
			ctx.resolve(plancherBas.ID, plancherBas.RULES.dp, item),
		),
	});
}

export function dp_planchers_hauts(
	ctx: Context,
): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		dp: ctx.diagnostic.enveloppe.planchers_hauts.map((item) =>
			ctx.resolve(plancherHaut.ID, plancherHaut.RULES.dp, item),
		),
	});
}

export function dp_baies(ctx: Context): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		dp: ctx.diagnostic.enveloppe.baies.map((item) =>
			ctx.resolve(baie.ID, baie.RULES.dp, item),
		),
	});
}

export function dp_portes(
	ctx: Context,
): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		dp: ctx.diagnostic.enveloppe.portes.map((item) =>
			ctx.resolve(porte.ID, porte.RULES.dp, item),
		),
	});
}

export function dr(ctx: Context): ReturnType<typeof formulas.calcule_dr> {
	return formulas.calcule_dr({
		hperm: ctx.resolve(ID, RULES.hperm),
		hvent: ctx.resolve(ventilation.ID, ventilation.RULES.hvent),
	});
}

export function pt(ctx: Context): ReturnType<typeof formulas.calcule_pt> {
	return formulas.calcule_pt({
		pt: ctx.diagnostic.enveloppe.ponts_thermiques.map((item) =>
			ctx.resolve(pontThermique.ID, pontThermique.RULES.pt, item),
		),
	});
}

export function sdep(ctx: Context): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		sdep: [
			ctx.resolve(ID, RULES.sdep_murs),
			ctx.resolve(ID, RULES.sdep_planchers_bas),
			ctx.resolve(ID, RULES.sdep_planchers_hauts),
			ctx.resolve(ID, RULES.sdep_baies),
			ctx.resolve(ID, RULES.sdep_portes),
		],
	});
}

export function sdep_murs(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		sdep: ctx.diagnostic.enveloppe.murs.map((item) =>
			ctx.resolve(mur.ID, mur.RULES.sdep, item),
		),
	});
}

export function sdep_planchers_bas(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		sdep: ctx.diagnostic.enveloppe.planchers_bas.map((item) =>
			ctx.resolve(plancherBas.ID, plancherBas.RULES.sdep, item),
		),
	});
}

export function sdep_planchers_hauts(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		sdep: ctx.diagnostic.enveloppe.planchers_hauts.map((item) =>
			ctx.resolve(plancherHaut.ID, plancherHaut.RULES.sdep, item),
		),
	});
}

export function sdep_baies(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		sdep: ctx.diagnostic.enveloppe.baies.map((item) =>
			ctx.resolve(baie.ID, baie.RULES.sdep, item),
		),
	});
}

export function sdep_portes(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		sdep: ctx.diagnostic.enveloppe.portes.map((item) =>
			ctx.resolve(porte.ID, porte.RULES.sdep, item),
		),
	});
}

export function inertie(
	ctx: Context,
): ReturnType<typeof formulas.calcule_inertie> {
	const niveaux = ctx.diagnostic.enveloppe.niveaux.map((item) => ({
		inertie: ctx.resolve(niveau.ID, niveau.RULES.inertie, item),
		sh: item.surface,
	}));
	return formulas.calcule_inertie({ niveaux: toNonEmptyArray(niveaux) });
}

export function hperm(ctx: Context): ReturnType<typeof formulas.calcule_hperm> {
	return formulas.calcule_hperm({
		qvinf: ctx.resolve(ID, RULES.qvinf),
	});
}

export function qvinf(ctx: Context): ReturnType<typeof formulas.calcule_qvinf> {
	return formulas.calcule_qvinf({
		exposition: ctx.diagnostic.enveloppe.exposition,
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		hsp: ctx.resolve(batiment.ID, batiment.RULES.hsp),
		qvarep_conv: ctx.resolve(ventilation.ID, ventilation.RULES.qvarep_conv),
		qvasouf_conv: ctx.resolve(ventilation.ID, ventilation.RULES.qvasouf_conv),
		n50: ctx.resolve(ID, RULES.n50),
	});
}

export function n50(ctx: Context): ReturnType<typeof formulas.calcule_n50> {
	return formulas.calcule_n50({
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		hsp: ctx.resolve(batiment.ID, batiment.RULES.hsp),
		q4pa: ctx.resolve(ID, RULES.q4pa),
	});
}

export function q4pa(ctx: Context): ReturnType<typeof formulas.calcule_q4pa> {
	return formulas.calcule_q4pa({
		sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
		q4paenv: ctx.resolve(ID, RULES.q4paenv),
		smea_conv: ctx.resolve(ventilation.ID, ventilation.RULES.smea_conv),
	});
}

export function q4paenv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_q4paenv> {
	return formulas.calcule_q4paenv({
		sdep: ctx.resolve(ID, RULES.sdep),
		sdep_planchers_bas: ctx.resolve(ID, RULES.sdep_planchers_bas),
		q4paconv: ctx.resolve(ID, RULES.q4paconv),
	});
}

export function q4paconv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_q4paconv> {
	return formulas.calcule_q4paconv({
		type_batiment: ctx.diagnostic.batiment.type,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
		isolation_murs_plafonds: ctx.resolve(ID, RULES.isolation_murs_plafonds),
		presence_joints: ctx.resolve(ID, RULES.presence_joints),
	});
}

export function isolation_murs_plafonds(
	ctx: Context,
): ReturnType<typeof formulas.calcule_isolation_murs_plafonds> {
	return formulas.calcule_isolation_murs_plafonds({
		murs: ctx.diagnostic.enveloppe.murs.map((item) => ({
			surface: item.position.surface,
			isolation: mur.rules.isolation(ctx, item),
		})),
		planchers_hauts: ctx.diagnostic.enveloppe.planchers_hauts.map((item) => ({
			surface: item.position.surface,
			isolation: plancherHaut.rules.isolation(ctx, item),
		})),
	});
}

export function presence_joints(
	ctx: Context,
): ReturnType<typeof formulas.calcule_presence_joints> {
	const baies = ctx.diagnostic.enveloppe.baies.map((item) => ({
		surface: item.position.surface,
		presence_joint: item.menuiserie?.presence_joint ?? null,
	}));
	const portes = ctx.diagnostic.enveloppe.portes.map((item) => ({
		surface: item.position.surface,
		presence_joint: item.menuiserie?.presence_joint ?? null,
	}));
	return formulas.calcule_presence_joints({
		ouvertures: [...baies, ...portes],
	});
}

export function sse(ctx: Context): ReturnType<typeof formulas.calcule_sse> {
	return formulas.calcule_sse({
		sse: ctx.diagnostic.enveloppe.baies.map((item) =>
			ctx.resolve(baie.ID, baie.RULES.sse, item),
		),
		sse_ets: ctx.diagnostic.enveloppe.locaux_non_chauffes.map((item) =>
			ctx.resolve(localNonChauffe.ID, localNonChauffe.RULES.sse, item),
		),
	});
}

export function parois_anciennes(
	ctx: Context,
): ReturnType<typeof formulas.calcule_parois_anciennes> {
	return formulas.calcule_parois_anciennes({
		murs: ctx.diagnostic.enveloppe.murs.map((item) => ({
			surface: item.position.surface,
			materiaux_anciens: item.structures.some((s) => s.materiau_ancien),
		})),
	});
}
