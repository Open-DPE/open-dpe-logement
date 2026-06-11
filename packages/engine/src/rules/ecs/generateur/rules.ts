import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Generateur = models.ecs.generateur.Generateur;

export function calcule(
	ctx: Context,
	item: Generateur,
): models.ecs.generateur.GenerateurWithData {
	return {
		...item,
		data: {
			rdim: rdim(ctx, item),
			pn: pn(ctx, item),
			pdim: pdim(ctx, item),
			pecs: pecs(ctx, item),
			paux: paux(ctx, item),
			cop: cop(ctx, item),
			rpn: combustion(ctx, item)?.rpn ?? null,
			qp0: combustion(ctx, item)?.qp0 ?? null,
			pveilleuse: combustion(ctx, item)?.pveilleuse ?? null,
			cr: cr(ctx, item),
			qgw: qgw(ctx, item),
			qgen: qgen(ctx, item),
			consommations: consommations(ctx, item),
		},
	};
}

export function consommations(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, generateur, () =>
		formulas.calcule_consommations({
			consommations: ctx.diagnostic.ecs.installations.flatMap((i) =>
				i.systemes
					.filter((s) => s.generateur_id === generateur.id)
					.map((s) =>
						ctx.resolve(
							constants.ecs.systeme.NAMESPACE,
							constants.ecs.systeme.RULES.consommations,
							s,
						),
					),
			),
			caux_gen: caux_gen(ctx, generateur),
			caux_gen_enr: caux_gen_enr(ctx, generateur),
		}),
	);
}

export function cecs(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cecs> {
	return ctx.register(NAMESPACE, RULES.cecs, generateur, () =>
		formulas.calcule_cecs({
			cecs: ctx.diagnostic.ecs.installations.flatMap((i) =>
				i.systemes
					.filter((s) => s.generateur_id === generateur.id)
					.map((s) =>
						ctx.resolve(
							constants.ecs.systeme.NAMESPACE,
							constants.ecs.systeme.RULES.cecs,
							s,
						),
					),
			),
		}),
	);
}

export function cecs_elec(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	return ctx.register(NAMESPACE, RULES.cecs_elec, generateur, () =>
		formulas.calcule_cecs_elec({
			cecs_elec: ctx.diagnostic.ecs.installations.flatMap((i) =>
				i.systemes
					.filter((s) => s.generateur_id === generateur.id)
					.map((s) =>
						ctx.resolve(
							constants.ecs.systeme.NAMESPACE,
							constants.ecs.systeme.RULES.cecs_elec,
							s,
						),
					),
			),
		}),
	);
}

export function caux_gen(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return ctx.register(NAMESPACE, RULES.caux_gen, generateur, () =>
		formulas.calcule_caux_gen({
			becs: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.becs),
			pn: pn(ctx, generateur),
			paux: paux(ctx, generateur),
			rdim: rdim(ctx, generateur),
		}),
	);
}

export function caux_gen_enr(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_caux_gen_enr> {
	return ctx.register(NAMESPACE, RULES.caux_gen_enr, generateur, () =>
		formulas.calcule_caux_gen_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			caux_gen: caux_gen(ctx, generateur),
		}),
	);
}

export function rdim(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, generateur, () =>
		formulas.calcule_rdim({
			systemes: ctx.diagnostic.ecs.installations.flatMap((i) =>
				i.systemes
					.filter((s) => s.generateur_id === generateur.id)
					.map((s) => ({
						rdim: ctx.resolve(
							constants.ecs.systeme.NAMESPACE,
							constants.ecs.systeme.RULES.rdim,
							s,
						),
						rdim_installation: ctx.resolve(
							constants.ecs.installation.NAMESPACE,
							constants.ecs.installation.RULES.rdim,
							i,
						),
					})),
			),
		}),
	);
}

export function pn(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_pn> {
	return ctx.register(NAMESPACE, RULES.pn, generateur, () =>
		formulas.calcule_pn({
			pn_saisi: generateur.signaletique.pn,
			pdim: pdim(ctx, generateur),
		}),
	);
}

export function pdim(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_pdim> {
	return ctx.register(NAMESPACE, RULES.pdim, generateur, () =>
		formulas.calcule_pdim({
			pecs: ctx.resolve(NAMESPACE, RULES.pecs, generateur),
			pch: generateur.position.generateur_mixte_id
				? ctx.resolve(
						constants.chauffage.generateur.NAMESPACE,
						constants.chauffage.generateur.RULES.pch,
						{
							id: generateur.position.generateur_mixte_id,
						},
					)
				: null,
		}),
	);
}

export function pecs(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_pecs> {
	return ctx.register(NAMESPACE, RULES.pecs, generateur, () =>
		formulas.calcule_pecs({
			pn_saisi: generateur.signaletique.pn,
			volume_stockage: volume_stockage(generateur),
		}),
	);
}

export function paux(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_paux> {
	return ctx.register(NAMESPACE, RULES.paux, generateur, () =>
		formulas.calcule_paux({
			type_generateur: type_generateur(generateur),
			energie_generateur: energie_generateur(generateur),
			generateur_multi_batiment: generateur.position.generateur_multi_batiment,
			presence_ventouse: presence_ventouse(generateur),
			pn: pn(ctx, generateur),
		}),
	);
}

export function cop(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cop> | null {
	return ctx.register(NAMESPACE, RULES.cop, generateur, () => {
		switch (true) {
			case models.ecs.generateur.isChauffeEauThermodynamique(generateur):
			case models.ecs.generateur.isPacDoubleService(generateur):
			case models.ecs.generateur.isPacHybride(generateur):
				return formulas.calcule_cop({
					type_generateur: type_generateur(generateur),
					cop_saisi: generateur.signaletique.cop,
					annee_installation: annee_installation(ctx, generateur),
					zone_climatique: ctx.resolve(
						constants.climat.NAMESPACE,
						constants.climat.RULES.zone_climatique,
					),
				});

			default:
				return null;
		}
	});
}

export function combustion(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_combustion> | null {
	return ctx.register(NAMESPACE, RULES.combustion, generateur, () => {
		switch (true) {
			case models.ecs.generateur.isChaudiereCombustion(generateur):
			case models.ecs.generateur.isPoeleBoisBouilleur(generateur):
			case models.ecs.generateur.isChauffeEauGaz(generateur):
			case models.ecs.generateur.isPacHybride(generateur):
			case models.ecs.generateur.isGenerateurCollectifInconnu(generateur): {
				return formulas.calcule_combustion({
					type_generateur: type_generateur(generateur),
					energie_generateur: energie_generateur(generateur),
					bienergie_generateur: generateur.bienergie,
					rpn_saisi: generateur.signaletique.rpn,
					qp0_saisi: generateur.signaletique.qp0,
					pveilleuse_saisi: generateur.signaletique.pveilleuse,
					mode_combustion: mode_combustion(generateur),
					volume_stockage: volume_stockage(generateur),
					annee_installation: annee_installation(ctx, generateur),
					presence_ventouse: presence_ventouse(generateur),
					pn: ctx.resolve(NAMESPACE, RULES.pn, generateur),
				});
			}

			default:
				return null;
		}
	});
}

export function cr(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_cr> {
	return ctx.register(NAMESPACE, RULES.cr, generateur, () =>
		formulas.calcule_cr({
			type_generateur: type_generateur(generateur),
			energie_generateur: energie_generateur(generateur),
			position_chauffe_eau: generateur.position.position_chauffe_eau,
			label_generateur: generateur.signaletique.label,
			volume_stockage: volume_stockage(generateur),
		}),
	);
}

export function qgw(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_qgw> {
	return ctx.register(NAMESPACE, RULES.qgw, generateur, () =>
		formulas.calcule_qgw({
			energie_generateur: energie_generateur(generateur),
			volume_stockage: volume_stockage(generateur),
			cr: cr(ctx, generateur),
		}),
	);
}

export function qgen(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.calcule_qgen> {
	return ctx.register(NAMESPACE, RULES.qgen, generateur, () =>
		formulas.calcule_qgen({
			generateur_mixte: generateur.position.generateur_mixte_id !== null,
			presence_ventouse: presence_ventouse(generateur),
			qp0: combustion(ctx, generateur)?.qp0 ?? 0,
		}),
	);
}

export function type_generateur(
	generateur: Generateur,
): ReturnType<typeof formulas.set_type_generateur> {
	return formulas.set_type_generateur({ type_generateur: generateur.type });
}

export function energie_generateur(
	generateur: Generateur,
): ReturnType<typeof formulas.set_energie_generateur> {
	return formulas.set_energie_generateur({
		energie_generateur: generateur.energie,
	});
}

export function mode_combustion(
	generateur: Generateur,
): ReturnType<typeof formulas.set_mode_combustion> {
	return formulas.set_mode_combustion({
		mode_combustion: generateur.signaletique.mode_combustion,
	});
}

export function presence_ventouse(
	generateur: Generateur,
): ReturnType<typeof formulas.set_presence_ventouse> {
	return formulas.set_presence_ventouse({
		presence_ventouse: generateur.signaletique.presence_ventouse,
	});
}

export function annee_installation(
	ctx: Context,
	generateur: Generateur,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: generateur.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}

export function volume_stockage(
	generateur: Generateur,
): ReturnType<typeof formulas.set_volume_stockage> {
	return formulas.set_volume_stockage({
		volume_stockage: generateur.stockage?.volume ?? null,
	});
}
