import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as constants from "../../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cecs]: cecs,
		[RULES.cecs_elec]: cecs_elec,
		[RULES.caux_gen]: caux_gen,
		[RULES.caux_gen_enr]: caux_gen_enr,
		[RULES.rdim]: rdim,
		[RULES.pn]: pn,
		[RULES.pdim]: pdim,
		[RULES.pecs]: pecs,
		[RULES.paux]: paux,
		[RULES.cop]: cop,
		[RULES.combustion]: combustion,
		[RULES.cr]: cr,
		[RULES.qgw]: qgw,
		[RULES.qgen]: qgen,
		[RULES.type_generateur]: type_generateur,
		[RULES.energie_generateur]: energie_generateur,
		[RULES.mode_combustion]: mode_combustion,
		[RULES.presence_ventouse]: presence_ventouse,
		[RULES.annee_installation]: annee_installation,
		[RULES.volume_stockage]: volume_stockage,
	},
};

type Generateur = models.ecs.generateur.Generateur;

export function consommations(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, item, () =>
		formulas.calcule_consommations({
			consommations: _systemes(ctx, item).map((s) =>
				ctx.resolve(
					constants.ecs.systeme.NAMESPACE,
					constants.ecs.systeme.RULES.consommations,
					s,
				),
			),
			caux_gen: caux_gen(ctx, item),
			caux_gen_enr: caux_gen_enr(ctx, item),
		}),
	);
}

export function cecs(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cecs> {
	return ctx.register(NAMESPACE, RULES.cecs, item, () =>
		formulas.calcule_cecs({
			cecs: _systemes(ctx, item).map((s) =>
				ctx.resolve(
					constants.ecs.systeme.NAMESPACE,
					constants.ecs.systeme.RULES.cecs,
					s,
				),
			),
		}),
	);
}

export function cecs_elec(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	return ctx.register(NAMESPACE, RULES.cecs_elec, item, () =>
		formulas.calcule_cecs_elec({
			cecs_elec: _systemes(ctx, item).map((s) =>
				ctx.resolve(
					constants.ecs.systeme.NAMESPACE,
					constants.ecs.systeme.RULES.cecs_elec,
					s,
				),
			),
		}),
	);
}

export function caux_gen(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return ctx.register(NAMESPACE, RULES.caux_gen, item, () =>
		formulas.calcule_caux_gen({
			becs: ctx.resolve(constants.ecs.NAMESPACE, constants.ecs.RULES.becs),
			pn: pn(ctx, item),
			paux: paux(ctx, item),
			rdim: rdim(ctx, item),
		}),
	);
}

export function caux_gen_enr(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_caux_gen_enr> {
	return ctx.register(NAMESPACE, RULES.caux_gen_enr, item, () =>
		formulas.calcule_caux_gen_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			caux_gen: caux_gen(ctx, item),
		}),
	);
}

export function rdim(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, item, () =>
		formulas.calcule_rdim({
			systemes: _systemes(ctx, item).map((s) => ({
				rdim: ctx.resolve(
					constants.ecs.systeme.NAMESPACE,
					constants.ecs.systeme.RULES.rdim,
					s,
				),
				rdim_installation: ctx.resolve(
					constants.ecs.installation.NAMESPACE,
					constants.ecs.installation.RULES.rdim,
					s.installation,
				),
			})),
		}),
	);
}

export function pn(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_pn> {
	return ctx.register(NAMESPACE, RULES.pn, item, () =>
		formulas.calcule_pn({
			pn_saisi: item.signaletique.pn,
			pdim: pdim(ctx, item),
		}),
	);
}

export function pdim(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_pdim> {
	return ctx.register(NAMESPACE, RULES.pdim, item, () =>
		formulas.calcule_pdim({
			pecs: pecs(ctx, item),
			pch: item.position.generateur_mixte_id
				? ctx.resolve(
						constants.chauffage.generateur.NAMESPACE,
						constants.chauffage.generateur.RULES.pch,
						models.chauffage.getGenerateur(
							ctx.diagnostic.chauffage,
							item.position.generateur_mixte_id,
						),
					)
				: null,
		}),
	);
}

export function pecs(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_pecs> {
	return ctx.register(NAMESPACE, RULES.pecs, item, () =>
		formulas.calcule_pecs({
			pn_saisi: item.signaletique.pn,
			volume_stockage: volume_stockage(ctx, item),
		}),
	);
}

export function paux(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_paux> {
	return ctx.register(NAMESPACE, RULES.paux, item, () =>
		formulas.calcule_paux({
			type_generateur: type_generateur(ctx, item),
			energie_generateur: energie_generateur(ctx, item),
			generateur_multi_batiment: item.position.generateur_multi_batiment,
			presence_ventouse: presence_ventouse(ctx, item),
			pn: pn(ctx, item),
		}),
	);
}

export function cop(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cop> | null {
	return ctx.register(NAMESPACE, RULES.cop, item, () => {
		switch (true) {
			case models.ecs.generateur.isChauffeEauThermodynamique(item):
			case models.ecs.generateur.isPacDoubleService(item):
			case models.ecs.generateur.isPacDoubleServiceHybride(item):
				return formulas.calcule_cop({
					type_generateur: type_generateur(ctx, item),
					cop_saisi: item.signaletique.cop,
					annee_installation: annee_installation(ctx, item),
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
	item: Generateur,
): ReturnType<typeof formulas.calcule_combustion> | null {
	return ctx.register(NAMESPACE, RULES.combustion, item, () => {
		switch (true) {
			case models.ecs.generateur.isChaudiereCombustion(item):
			case models.ecs.generateur.isPoeleBoisBouilleur(item):
			case models.ecs.generateur.isChauffeEauGaz(item):
			case models.ecs.generateur.isPacDoubleServiceHybride(item):
			case models.ecs.generateur.isGenerateurCollectifInconnu(item): {
				return formulas.calcule_combustion({
					type_generateur: type_generateur(ctx, item),
					energie_generateur: energie_generateur(ctx, item),
					bienergie_generateur: item.bienergie,
					rpn_saisi: item.signaletique.rpn,
					qp0_saisi: item.signaletique.qp0,
					pveilleuse_saisi: item.signaletique.pveilleuse,
					mode_combustion: mode_combustion(ctx, item),
					volume_stockage: volume_stockage(ctx, item),
					annee_installation: annee_installation(ctx, item),
					presence_ventouse: presence_ventouse(ctx, item),
					pn: pn(ctx, item),
				});
			}

			default:
				return null;
		}
	});
}

export function cr(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cr> {
	return ctx.register(NAMESPACE, RULES.cr, item, () =>
		formulas.calcule_cr({
			type_generateur: type_generateur(ctx, item),
			energie_generateur: energie_generateur(ctx, item),
			position_chauffe_eau: item.position.position_chauffe_eau,
			label_generateur: item.signaletique.label,
			volume_stockage: volume_stockage(ctx, item),
		}),
	);
}

export function qgw(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_qgw> {
	return ctx.register(NAMESPACE, RULES.qgw, item, () =>
		formulas.calcule_qgw({
			energie_generateur: energie_generateur(ctx, item),
			volume_stockage: volume_stockage(ctx, item),
			cr: cr(ctx, item),
		}),
	);
}

export function qgen(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_qgen> {
	return ctx.register(NAMESPACE, RULES.qgen, item, () =>
		formulas.calcule_qgen({
			generateur_mixte: item.position.generateur_mixte_id !== null,
			presence_ventouse: presence_ventouse(ctx, item),
			qp0: combustion(ctx, item)?.qp0 ?? 0,
		}),
	);
}

export function type_generateur(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_type_generateur> {
	return ctx.register(NAMESPACE, RULES.type_generateur, item, () =>
		formulas.set_type_generateur({ type_generateur: item.type }),
	);
}

export function energie_generateur(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_energie_generateur> {
	return ctx.register(NAMESPACE, RULES.energie_generateur, item, () =>
		formulas.set_energie_generateur({
			energie_generateur: item.energie,
		}),
	);
}

export function mode_combustion(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_mode_combustion> {
	return ctx.register(NAMESPACE, RULES.mode_combustion, item, () =>
		formulas.set_mode_combustion({
			mode_combustion: item.signaletique.mode_combustion,
		}),
	);
}

export function presence_ventouse(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_presence_ventouse> {
	return ctx.register(NAMESPACE, RULES.presence_ventouse, item, () =>
		formulas.set_presence_ventouse({
			presence_ventouse: item.signaletique.presence_ventouse,
		}),
	);
}

export function annee_installation(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_annee_installation> {
	return ctx.register(NAMESPACE, RULES.annee_installation, item, () =>
		formulas.set_annee_installation({
			annee_installation: item.annee_installation,
			annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
		}),
	);
}

export function volume_stockage(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_volume_stockage> {
	return ctx.register(NAMESPACE, RULES.volume_stockage, item, () =>
		formulas.set_volume_stockage({
			volume_stockage: item.stockage.volume,
		}),
	);
}

function _systemes(ctx: Context, item: Generateur) {
	return ctx.once(NAMESPACE, "systemes", item, () =>
		ctx.diagnostic.ecs.installations.flatMap((i) =>
			i.systemes
				.filter((s) => s.generateur_id === item.id)
				.map((s) => ({
					...s,
					installation: i,
				})),
		),
	);
}
