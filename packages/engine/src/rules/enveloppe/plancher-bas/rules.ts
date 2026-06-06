import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.planchers_bas.forEach((item) => {
		ctx.register(ID, RULES.aiu, item, () => aiu(item));
		ctx.register(ID, RULES.isolation_aiu, item, () => isolation_aiu(ctx, item));
		ctx.register(ID, RULES.sdep, item, () => sdep(item));
		ctx.register(ID, RULES.b, item, () => b(ctx, item));
		ctx.register(ID, RULES.dp, item, () => dp(ctx, item));
		ctx.register(ID, RULES.u0, item, () => u0(item));
		ctx.register(ID, RULES.u, item, () => u(ctx, item));
	});
}

type PlancherBas = models.enveloppe.plancherBas.PlancherBas;

export function aiu(
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_aiu> {
	return paroi.aiu(item);
}

export function isolation_aiu(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return formulas.calcule_isolation_aiu({
		isolation: item.isolation.etat,
		mitoyennete: item.position.mitoyennete,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

export function sdep(
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_sdep> {
	return paroi.sdep(item);
}

export function b(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_b> {
	return paroi.b(ctx, item, isolation(ctx, item));
}

export function dp(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.calcule_dp> {
	return paroi.dp(ctx, item, ID);
}

export function u0(item: PlancherBas): ReturnType<typeof formulas.calcule_u0> {
	return formulas.calcule_u0({
		u0_saisi: item.u0,
		type_plancher_bas: item.type,
	});
}

export function u(ctx: Context, item: PlancherBas): number {
	const uint = formulas.calcule_uint({
		u_saisi: item.u,
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		effet_joule: ctx.resolve(chauffage.ID, chauffage.RULES.effet_joule),
		u0: ctx.resolve(ID, RULES.u0, item),
		isolation: item.isolation.etat,
		type_isolation: item.isolation.type,
		epaisseur_isolation: item.isolation.epaisseur,
		resistance_thermique_isolation: item.isolation.resistance_thermique,
		annee_isolation: item.annee_renovation,
		annee_construction: paroi.annee_construction(ctx, item),
	});

	switch (item.position.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.terre_plein:
		case models.enveloppe.common.MitoyenneteEnum.vide_sanitaire:
		case models.enveloppe.common.MitoyenneteEnum.sous_sol_non_chauffe: {
			const ue = formulas.calcule_ue({
				mitoyennete: item.position.mitoyennete,
				annee_construction: paroi.annee_construction(ctx, item),
				u: uint,
				surface_ue: item.position.surface_ue,
				perimetre_ue: item.position.perimetre_ue,
			});
			return formulas.calcule_u({ uint, ue });
		}
		default: {
			return formulas.calcule_u({ uint, ue: null });
		}
	}
}

export function isolation(
	ctx: Context,
	item: PlancherBas,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({
		mitoyennete: item.position.mitoyennete,
		isolation: item.isolation.etat,
		annee_construction: paroi.annee_construction(ctx, item),
	});
}

export function applique(ctx: Context, item: PlancherBas): models.enveloppe.plancherBas.PlancherBasWithData {
	return {
		...item,
		data: {
			u0: ctx.resolve(ID, RULES.u0, item),
			u: ctx.resolve(ID, RULES.u, item),
			b: ctx.resolve(ID, RULES.b, item),
			sdep: ctx.resolve(ID, RULES.sdep, item),
			dp: ctx.resolve(ID, RULES.dp, item),
		},
	};
}
