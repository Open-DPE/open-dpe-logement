import type { Context } from "../../core/context.js";
import * as constants from "../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

import * as baie from "./baie/rules.js";
import * as localNonChauffe from "./local-non-chauffe/rules.js";
import * as mur from "./mur/rules.js";
import * as niveau from "./niveau/rules.js";
import * as plancherBas from "./plancher-bas/rules.js";
import * as plancherHaut from "./plancher-haut/rules.js";
import * as porte from "./porte/rules.js";
import * as pontThermique from "./pont-thermique/rules.js";

export {
	baie,
	localNonChauffe,
	mur,
	niveau,
	plancherBas,
	plancherHaut,
	pontThermique,
	porte,
};

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.gv]: gv,
		[RULES.ubat]: ubat,
		[RULES.dp]: dp,
		[RULES.dp_murs]: dp_murs,
		[RULES.dp_planchers_bas]: dp_planchers_bas,
		[RULES.dp_planchers_hauts]: dp_planchers_hauts,
		[RULES.dp_baies]: dp_baies,
		[RULES.dp_portes]: dp_portes,
		[RULES.pt]: pt,
		[RULES.dr]: dr,
		[RULES.sdep]: sdep,
		[RULES.sdep_murs]: sdep_murs,
		[RULES.sdep_planchers_bas]: sdep_planchers_bas,
		[RULES.sdep_planchers_hauts]: sdep_planchers_hauts,
		[RULES.sdep_baies]: sdep_baies,
		[RULES.sdep_portes]: sdep_portes,
		[RULES.inertie]: inertie,
		[RULES.hperm]: hperm,
		[RULES.qvinf]: qvinf,
		[RULES.n50]: n50,
		[RULES.q4pa]: q4pa,
		[RULES.q4paenv]: q4paenv,
		[RULES.q4paconv]: q4paconv,
		[RULES.isolation_murs_plafonds]: isolation_murs_plafonds,
		[RULES.presence_joints]: presence_joints,
		[RULES.isolation_planchers_hauts]: isolation_planchers_hauts,
		[RULES.presence_protection_solaire]: presence_protection_solaire,
		[RULES.logement_traversant]: logement_traversant,
		[RULES.sse]: sse,
	},

	...baie.REGISTRY,
	...localNonChauffe.REGISTRY,
	...mur.REGISTRY,
	...niveau.REGISTRY,
	...plancherBas.REGISTRY,
	...plancherHaut.REGISTRY,
	...pontThermique.REGISTRY,
	...porte.REGISTRY,
};

export function gv(ctx: Context): ReturnType<typeof formulas.calcule_gv> {
	return ctx.register(NAMESPACE, RULES.gv, () =>
		formulas.calcule_gv({
			dp: dp(ctx),
			pt: pt(ctx),
			dr: dr(ctx),
		}),
	);
}

export function ubat(ctx: Context): ReturnType<typeof formulas.calcule_ubat> {
	return ctx.register(NAMESPACE, RULES.ubat, () =>
		formulas.calcule_ubat({
			dp: dp(ctx),
			pt: pt(ctx),
			sdep: sdep(ctx),
		}),
	);
}

export function dp(ctx: Context): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp, () =>
		formulas.calcule_dp({
			dp: [
				dp_murs(ctx),
				dp_planchers_bas(ctx),
				dp_planchers_hauts(ctx),
				dp_baies(ctx),
				dp_portes(ctx),
			],
		}),
	);
}

export function dp_murs(ctx: Context): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp_murs, () =>
		formulas.calcule_dp({
			dp: ctx.diagnostic.enveloppe.murs.map((item) =>
				ctx.resolve(
					constants.enveloppe.mur.NAMESPACE,
					constants.enveloppe.mur.RULES.dp,
					item,
				),
			),
		}),
	);
}

export function dp_planchers_bas(
	ctx: Context,
): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp_planchers_bas, () =>
		formulas.calcule_dp({
			dp: ctx.diagnostic.enveloppe.planchers_bas.map((item) =>
				ctx.resolve(
					constants.enveloppe.plancherBas.NAMESPACE,
					constants.enveloppe.plancherBas.RULES.dp,
					item,
				),
			),
		}),
	);
}

export function dp_planchers_hauts(
	ctx: Context,
): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp_planchers_hauts, () =>
		formulas.calcule_dp({
			dp: ctx.diagnostic.enveloppe.planchers_hauts.map((item) =>
				ctx.resolve(
					constants.enveloppe.plancherHaut.NAMESPACE,
					constants.enveloppe.plancherHaut.RULES.dp,
					item,
				),
			),
		}),
	);
}

export function dp_baies(ctx: Context): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp_baies, () =>
		formulas.calcule_dp({
			dp: ctx.diagnostic.enveloppe.baies.map((item) =>
				ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.dp,
					item,
				),
			),
		}),
	);
}

export function dp_portes(
	ctx: Context,
): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp_portes, () =>
		formulas.calcule_dp({
			dp: ctx.diagnostic.enveloppe.portes.map((item) =>
				ctx.resolve(
					constants.enveloppe.porte.NAMESPACE,
					constants.enveloppe.porte.RULES.dp,
					item,
				),
			),
		}),
	);
}

export function dr(ctx: Context): ReturnType<typeof formulas.calcule_dr> {
	return ctx.register(NAMESPACE, RULES.dr, () =>
		formulas.calcule_dr({
			hperm: hperm(ctx),
			hvent: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.hvent,
			),
		}),
	);
}

export function pt(ctx: Context): ReturnType<typeof formulas.calcule_pt> {
	return ctx.register(NAMESPACE, RULES.pt, () =>
		formulas.calcule_pt({
			pt: ctx.diagnostic.enveloppe.ponts_thermiques.map((item) =>
				ctx.resolve(
					constants.enveloppe.pontThermique.NAMESPACE,
					constants.enveloppe.pontThermique.RULES.pt,
					item,
				),
			),
		}),
	);
}

export function sdep(ctx: Context): ReturnType<typeof formulas.calcule_sdep> {
	return ctx.register(NAMESPACE, RULES.sdep, () =>
		formulas.calcule_sdep({
			sdep: [
				sdep_murs(ctx),
				sdep_planchers_bas(ctx),
				sdep_planchers_hauts(ctx),
				sdep_baies(ctx),
				sdep_portes(ctx),
			],
		}),
	);
}

export function sdep_murs(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return ctx.register(NAMESPACE, RULES.sdep_murs, () =>
		formulas.calcule_sdep({
			sdep: ctx.diagnostic.enveloppe.murs.map((item) =>
				ctx.resolve(
					constants.enveloppe.mur.NAMESPACE,
					constants.enveloppe.mur.RULES.sdep,
					item,
				),
			),
		}),
	);
}

export function sdep_planchers_bas(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return ctx.register(NAMESPACE, RULES.sdep_planchers_bas, () =>
		formulas.calcule_sdep({
			sdep: ctx.diagnostic.enveloppe.planchers_bas.map((item) =>
				ctx.resolve(
					constants.enveloppe.plancherBas.NAMESPACE,
					constants.enveloppe.plancherBas.RULES.sdep,
					item,
				),
			),
		}),
	);
}

export function sdep_planchers_hauts(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return ctx.register(NAMESPACE, RULES.sdep_planchers_hauts, () =>
		formulas.calcule_sdep({
			sdep: ctx.diagnostic.enveloppe.planchers_hauts.map((item) =>
				ctx.resolve(
					constants.enveloppe.plancherHaut.NAMESPACE,
					constants.enveloppe.plancherHaut.RULES.sdep,
					item,
				),
			),
		}),
	);
}

export function sdep_baies(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return ctx.register(NAMESPACE, RULES.sdep_baies, () =>
		formulas.calcule_sdep({
			sdep: ctx.diagnostic.enveloppe.baies.map((item) =>
				ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.sdep,
					item,
				),
			),
		}),
	);
}

export function sdep_portes(
	ctx: Context,
): ReturnType<typeof formulas.calcule_sdep> {
	return ctx.register(NAMESPACE, RULES.sdep_portes, () =>
		formulas.calcule_sdep({
			sdep: ctx.diagnostic.enveloppe.portes.map((item) =>
				ctx.resolve(
					constants.enveloppe.porte.NAMESPACE,
					constants.enveloppe.porte.RULES.sdep,
					item,
				),
			),
		}),
	);
}

export function inertie(
	ctx: Context,
): ReturnType<typeof formulas.calcule_inertie> {
	return ctx.register(NAMESPACE, RULES.inertie, () =>
		formulas.calcule_inertie({
			niveaux: ctx.diagnostic.enveloppe.niveaux.map((item) => ({
				inertie: ctx.resolve(
					constants.enveloppe.niveau.NAMESPACE,
					constants.enveloppe.niveau.RULES.inertie,
					item,
				),
				sh: item.surface,
			})),
		}),
	);
}

export function hperm(ctx: Context): ReturnType<typeof formulas.calcule_hperm> {
	return ctx.register(NAMESPACE, RULES.hperm, () =>
		formulas.calcule_hperm({ qvinf: qvinf(ctx) }),
	);
}

export function qvinf(ctx: Context): ReturnType<typeof formulas.calcule_qvinf> {
	return ctx.register(NAMESPACE, RULES.qvinf, () =>
		formulas.calcule_qvinf({
			exposition: ctx.diagnostic.enveloppe.exposition,
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			hsp: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.hsp,
			),
			qvarep_conv: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.qvarep_conv,
			),
			qvasouf_conv: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.qvasouf_conv,
			),
			n50: n50(ctx),
		}),
	);
}

export function n50(ctx: Context): ReturnType<typeof formulas.calcule_n50> {
	return ctx.register(NAMESPACE, RULES.n50, () =>
		formulas.calcule_n50({
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			hsp: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.hsp,
			),
			q4pa: q4pa(ctx),
		}),
	);
}

export function q4pa(ctx: Context): ReturnType<typeof formulas.calcule_q4pa> {
	return ctx.register(NAMESPACE, RULES.q4pa, () =>
		formulas.calcule_q4pa({
			sh: ctx.resolve(
				constants.batiment.NAMESPACE,
				constants.batiment.RULES.sh,
			),
			smea_conv: ctx.resolve(
				constants.ventilation.NAMESPACE,
				constants.ventilation.RULES.smea_conv,
			),
			q4paenv: q4paenv(ctx),
		}),
	);
}

export function q4paenv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_q4paenv> {
	return ctx.register(NAMESPACE, RULES.q4paenv, () =>
		formulas.calcule_q4paenv({
			sdep: sdep(ctx),
			sdep_planchers_bas: sdep_planchers_bas(ctx),
			q4paconv: q4paconv(ctx),
		}),
	);
}

export function q4paconv(
	ctx: Context,
): ReturnType<typeof formulas.calcule_q4paconv> {
	return ctx.register(NAMESPACE, RULES.q4paconv, () =>
		formulas.calcule_q4paconv({
			type_batiment: ctx.diagnostic.batiment.type,
			annee_construction: ctx.diagnostic.batiment.annee_construction,
			isolation_murs_plafonds: isolation_murs_plafonds(ctx),
			presence_joints_menuiserie: presence_joints(ctx),
		}),
	);
}

export function isolation_murs_plafonds(
	ctx: Context,
): ReturnType<typeof formulas.calcule_isolation_murs_plafonds> {
	return ctx.register(NAMESPACE, RULES.isolation_murs_plafonds, () =>
		formulas.calcule_isolation_murs_plafonds({
			murs: ctx.diagnostic.enveloppe.murs.map((item) => ({
				surface: item.position.surface,
				isolation: item.isolation.etat,
			})),
			planchers_hauts: ctx.diagnostic.enveloppe.planchers_hauts.map((item) => ({
				surface: item.position.surface,
				isolation: item.isolation.etat,
			})),
		}),
	);
}

export function presence_joints(
	ctx: Context,
): ReturnType<typeof formulas.calcule_presence_joints> {
	return ctx.register(NAMESPACE, RULES.presence_joints, () => {
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
	});
}

export function isolation_planchers_hauts(
	ctx: Context,
): ReturnType<typeof formulas.calcule_isolation_planchers_hauts> {
	return formulas.calcule_isolation_planchers_hauts({
		planchers_hauts: ctx.diagnostic.enveloppe.planchers_hauts.map((item) => ({
			surface: item.position.surface,
			mitoyennete: item.position.mitoyennete,
			isolation: item.isolation.etat,
		})),
	});
}

export function presence_protection_solaire(
	ctx: Context,
): ReturnType<typeof formulas.calcule_presence_protection_solaire> {
	return ctx.register(NAMESPACE, RULES.presence_protection_solaire, () =>
		formulas.calcule_presence_protection_solaire({
			baies: ctx.diagnostic.enveloppe.baies.map((item) => ({
				surface: item.position.surface,
				orientation: item.position.orientation,
				mitoyennete: item.position.mitoyennete,
				type_fermeture: item.type_fermeture,
			})),
		}),
	);
}

export function logement_traversant(
	ctx: Context,
): ReturnType<typeof formulas.calcule_logement_traversant> {
	return ctx.register(NAMESPACE, RULES.logement_traversant, () =>
		formulas.calcule_logement_traversant({
			baies: ctx.diagnostic.enveloppe.baies.map((item) => ({
				surface: item.position.surface,
				orientation: item.position.orientation,
				mitoyennete: item.position.mitoyennete,
			})),
		}),
	);
}

export function sse(ctx: Context): ReturnType<typeof formulas.calcule_sse> {
	return ctx.register(NAMESPACE, RULES.sse, () =>
		formulas.calcule_sse({
			sse: ctx.diagnostic.enveloppe.baies.map((item) =>
				ctx.resolve(
					constants.enveloppe.baie.NAMESPACE,
					constants.enveloppe.baie.RULES.sse,
					item,
				),
			),
			sse_ets: ctx.diagnostic.enveloppe.locaux_non_chauffes.map((item) =>
				ctx.resolve(
					constants.enveloppe.localNonChauffe.NAMESPACE,
					constants.enveloppe.localNonChauffe.RULES.sse,
					item,
				),
			),
		}),
	);
}
