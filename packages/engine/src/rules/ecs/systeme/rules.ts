import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cecs]: cecs,
		[RULES.cecs_enr]: cecs_enr,
		[RULES.cecs_elec]: cecs_elec,
		[RULES.caux_dist]: caux_dist,
		[RULES.caux_dist_enr]: caux_dist_enr,
		[RULES.qcirb]: qcirb,
		[RULES.qtrac]: qtrac,
		[RULES.rdim]: rdim,
		[RULES.iecs]: iecs,
		[RULES.rendements]: rendements,
	},
};

type Systeme = models.ecs.systeme.Systeme;

export function consommations(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_consommations({
			cecs: cecs(ctx, item),
			cecs_enr: cecs_enr(ctx, item),
			caux_dist: caux_dist(ctx, item),
			caux_dist_enr: caux_dist_enr(ctx, item),
			energie: generateur.energie_generateur,
			reseau_id: generateur.position.reseau_chaleur_id,
		});
	});
}

export function cecs(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cecs> {
	return ctx.register(NAMESPACE, RULES.cecs, item, () => {
		const installation = _installation(ctx, item);
		return formulas.calcule_cecs({
			becs: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.becs,
				installation,
			),
			fecs: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.fecs,
				installation,
			),
			rdim: rdim(ctx, item),
			iecs: iecs(ctx, item),
		});
	});
}

export function cecs_enr(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cecs_enr> {
	return ctx.register(NAMESPACE, RULES.cecs_enr, item, () =>
		formulas.calcule_cecs_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			cecs_elec: cecs_elec(ctx, item),
		}),
	);
}

export function cecs_elec(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	return ctx.register(NAMESPACE, RULES.cecs_elec, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_cecs_elec({
			cecs: cecs(ctx, item),
			energie_generateur: generateur.energie_generateur,
		});
	});
}

export function caux_dist(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, item, () =>
		formulas.calcule_caux_dist({
			qtrac: qtrac(ctx, item),
			qcirb: qcirb(ctx, item),
		}),
	);
}

export function caux_dist_enr(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist_enr> {
	return ctx.register(NAMESPACE, RULES.caux_dist_enr, item, () =>
		formulas.calcule_caux_dist_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			caux_dist: caux_dist(ctx, item),
		}),
	);
}

export function qcirb(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_qcirb> {
	return ctx.register(NAMESPACE, RULES.qcirb, item, () => {
		const installation = _installation(ctx, item);
		return formulas.calcule_qcirb({
			nj: ctx.resolve(constants.climat.NAMESPACE, constants.climat.RULES.nj),
			sh: installation.surface,
			installation_collective: installation.installation_collective,
			bouclage: bouclage_reseau(item),
			niveaux_desservis: item.reseau.niveaux_desservis,
			qdw: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.qdw,
				installation,
			),
		});
	});
}

export function qtrac(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_qtrac> {
	return ctx.register(NAMESPACE, RULES.qtrac, item, () => {
		const installation = _installation(ctx, item);
		return formulas.calcule_qtrac({
			becs: ctx.resolve(
				constants.ecs.installation.NAMESPACE,
				constants.ecs.installation.RULES.becs,
				installation,
			),
			installation_collective: installation.installation_collective,
			bouclage: bouclage_reseau(item),
		});
	});
}

export function rdim(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, item, () =>
		formulas.calcule_rdim({
			n_systemes: _installation(ctx, item).systemes.length,
		}),
	);
}

export function iecs(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_iecs> {
	return ctx.register(NAMESPACE, RULES.iecs, item, () => {
		const v = rendements(ctx, item);
		return formulas.calcule_iecs({
			rd: v.rd,
			rs: v.rs,
			rg: v.rg,
			rgs: v.rgs,
		});
	});
}

export function rendements(ctx: Context, item: Systeme): formulas.Rendements {
	return ctx.register(NAMESPACE, RULES.rendements, item, () => {
		const installation = _installation(ctx, item);
		const generateur = _generateur(ctx, item);
		const conbustion = ctx.resolve(
			constants.ecs.generateur.NAMESPACE,
			constants.ecs.generateur.RULES.combustion,
			generateur,
		);

		const rd = formulas.calcule_rd({
			installation_collective: installation.installation_collective,
			bouclage_reseau: bouclage_reseau(item),
			alimentation_contigue: item.reseau.alimentation_contigue,
			production_volume_habitable: generateur.position.position_volume_chauffe,
		});

		switch (true) {
			case models.ecs.generateur.isReseauChaleur(generateur):
			case models.ecs.generateur.isGenerateurMultiBatiment(generateur):
				return formulas.calcule_rendements_reseau_chaleur({
					rd,
					isolation_reseau: isolation_reseau(item),
				});

			case models.ecs.generateur.isChaudiereCombustion(generateur):
			case models.ecs.generateur.isPoeleBoisBouilleur(generateur):
			case models.ecs.generateur.isPacHybride(generateur):
			case models.ecs.generateur.isGenerateurCollectifInconnu(generateur):
				return formulas.calcule_rendements_chaudiere_mixte({
					rd,
					becs: ctx.resolve(
						constants.ecs.installation.NAMESPACE,
						constants.ecs.installation.RULES.becs,
						installation,
					),
					qgw: ctx.resolve(
						constants.ecs.generateur.NAMESPACE,
						constants.ecs.generateur.RULES.qgw,
						generateur,
					),
					rpn: conbustion?.rpn ?? 0,
					qp0: conbustion?.qp0 ?? 0,
					pveilleuse: conbustion?.pveilleuse ?? 0,
				});

			case models.ecs.generateur.isChauffeEauGaz(generateur):
				return formulas.calcule_rendements_chaudiere_mixte({
					rd,
					qgw: ctx.resolve(
						constants.ecs.generateur.NAMESPACE,
						constants.ecs.generateur.RULES.qgw,
						generateur,
					),
					rpn: conbustion?.rpn ?? 0,
					qp0: conbustion?.qp0 ?? 0,
					pveilleuse: conbustion?.pveilleuse ?? 0,
					becs: ctx.resolve(
						constants.ecs.installation.NAMESPACE,
						constants.ecs.installation.RULES.becs,
						installation,
					),
				});

			case models.ecs.generateur.isChauffeEauThermodynamique(generateur):
			case models.ecs.generateur.isPacDoubleService(generateur):
				return formulas.calcule_rendements_systeme_thermodynamique({
					rd,
					cop:
						ctx.resolve(
							constants.ecs.generateur.NAMESPACE,
							constants.ecs.generateur.RULES.cop,
							generateur,
						) ?? 0,
				});

			default:
				return formulas.calcule_rendements_systeme_electrique({
					rd,
					type_generateur: generateur.type_generateur,
					qgw: ctx.resolve(
						constants.ecs.generateur.NAMESPACE,
						constants.ecs.generateur.RULES.qgw,
						generateur,
					),
					position_chauffe_eau: generateur.position.position_chauffe_eau,
					label_generateur: generateur.signaletique.label,
					becs: ctx.resolve(
						constants.ecs.installation.NAMESPACE,
						constants.ecs.installation.RULES.becs,
						installation,
					),
				});
		}
	});
}

export function bouclage_reseau(
	item: Systeme,
): ReturnType<typeof formulas.set_bouclage_reseau> {
	return formulas.set_bouclage_reseau({
		bouclage_reseau: item.reseau.bouclage ?? null,
	});
}

export function isolation_reseau(
	item: Systeme,
): ReturnType<typeof formulas.set_isolation_reseau> {
	return formulas.set_isolation_reseau({
		isolation_reseau: item.reseau.isolation ?? null,
	});
}

function _installation(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "installation", item, () =>
		models.ecs.getInstallationBySysteme(ctx.diagnostic.ecs, item.id),
	);
}

function _generateur(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "generateur", item, () => {
		const generateur = models.ecs.getGenerateur(
			ctx.diagnostic.ecs,
			item.generateur_id,
		);
		return {
			...generateur,
			type_generateur: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.type_generateur,
				generateur,
			),
			energie_generateur: ctx.resolve(
				constants.ecs.generateur.NAMESPACE,
				constants.ecs.generateur.RULES.energie_generateur,
				generateur,
			),
		};
	});
}
