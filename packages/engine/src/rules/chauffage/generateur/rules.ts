import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.cch]: cch,
		[RULES.cch_elec]: cch_elec,
		[RULES.caux_gen]: caux_gen,
		[RULES.caux_gen_enr]: caux_gen_enr,
		[RULES.rdim]: rdim,
		[RULES.pn]: pn,
		[RULES.pdim]: pdim,
		[RULES.pch]: pch,
		[RULES.paux]: paux,
		[RULES.combustion]: combustion,
		[RULES.scop]: scop,
		[RULES.tfonc30]: tfonc30,
		[RULES.tfonc100]: tfonc100,
		[RULES.qgen_rec]: qgen_rec,
		[RULES.qgen]: qgen,
		[RULES.type_generateur]: type_generateur,
		[RULES.energie_generateur]: energie_generateur,
		[RULES.mode_combustion]: mode_combustion,
		[RULES.presence_ventouse]: presence_ventouse,
		[RULES.presence_regulation]: presence_regulation,
		[RULES.annee_installation]: annee_installation,
	},
};

type Generateur = models.chauffage.generateur.Generateur;

export function consommations(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, item, () =>
		formulas.calcule_consommations({
			consommations: _systemes(ctx, item).map((s) => s.consommations),
			caux_gen: caux_gen(ctx, item),
			caux_gen_enr: caux_gen_enr(ctx, item),
		}),
	);
}

export function cch(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cch> {
	return ctx.register(NAMESPACE, RULES.cch, item, () =>
		formulas.calcule_cch({
			cch: _systemes(ctx, item).map((s) => s.cch),
		}),
	);
}

export function cch_elec(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_cch_elec> {
	return ctx.register(NAMESPACE, RULES.cch_elec, item, () =>
		formulas.calcule_cch_elec({
			cch_elec: _systemes(ctx, item).map((s) => s.cch_elec),
		}),
	);
}

export function caux_gen(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_caux_gen> {
	return ctx.register(NAMESPACE, RULES.caux_gen, item, () =>
		formulas.calcule_caux_gen({
			bch: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.bch,
			),
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
		formulas.calcule_rdim({ systemes: _systemes(ctx, item) }),
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
	return ctx.register(NAMESPACE, RULES.pdim, item, () => {
		const generateur_mixte_id = item.position.generateur_mixte_id;
		return formulas.calcule_pdim({
			pch: pch(ctx, item),
			pecs: generateur_mixte_id
				? ctx.resolve(
						constants.ecs.generateur.NAMESPACE,
						constants.ecs.generateur.RULES.pdim,
						models.ecs.getGenerateur(ctx.diagnostic.ecs, generateur_mixte_id),
					)
				: null,
		});
	});
}

export function pch(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_pch> {
	return ctx.register(NAMESPACE, RULES.pch, item, () =>
		formulas.calcule_pch({
			pn_saisi: item.signaletique.pn,
			pch_systemes: _systemes(ctx, item).map((s) => s.pch),
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

export function combustion(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_combustion> | null {
	return ctx.register(NAMESPACE, RULES.combustion, item, () => {
		switch (true) {
			case models.chauffage.generateur.isChaudiereCombustion(item):
			case models.chauffage.generateur.isPoeleBouilleur(item):
			case models.chauffage.generateur.isGenerateurAirChaudCombustion(item):
			case models.chauffage.generateur.isRadiateurGaz(item):
			case models.chauffage.generateur.isPACHybride(item):
			case models.chauffage.generateur.isGenerateurCollectifInconnu(item):
				return formulas.calcule_combustion({
					type_generateur: type_generateur(ctx, item),
					energie_generateur: energie_generateur(ctx, item),
					bienergie_generateur: item.bienergie,
					rpn_saisi: item.signaletique.rpn,
					rpint_saisi: item.signaletique.rpint,
					qp0_saisi: item.signaletique.qp0,
					pveilleuse_saisi: item.signaletique.pveilleuse,
					mode_combustion: mode_combustion(ctx, item),
					annee_installation: annee_installation(ctx, item),
					presence_ventouse: presence_ventouse(ctx, item),
					pn: pn(ctx, item),
				});
			default:
				return null;
		}
	});
}

export function scop(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_scop> | null {
	return ctx.register(NAMESPACE, RULES.scop, item, () => {
		switch (true) {
			case models.chauffage.generateur.isPAC(item):
			case models.chauffage.generateur.isPACHybride(item):
				return formulas.calcule_scop({
					type_generateur: type_generateur(ctx, item),
					scop_saisi: item.signaletique.scop,
					zone_climatique: ctx.resolve(
						constants.climat.NAMESPACE,
						constants.climat.RULES.zone_climatique,
					),
					annee_installation: annee_installation(ctx, item),
					types_emetteur: _emetteurs(ctx, item).map(({ type }) => type),
				});

			default:
				return null;
		}
	});
}

export function tfonc30(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_tfonc30> | null {
	return ctx.register(NAMESPACE, RULES.tfonc30, item, () => {
		switch (true) {
			case models.chauffage.generateur.isChaudiereCombustion(item):
			case models.chauffage.generateur.isPoeleBouilleur(item):
			case models.chauffage.generateur.isPACHybride(item):
			case models.chauffage.generateur.isGenerateurCollectifInconnu(item):
				return formulas.calcule_tfonc30({
					tfonc30_saisi: item.signaletique.tfonc30,
					mode_combustion: mode_combustion(ctx, item),
					annee_installation_generateur: annee_installation(ctx, item),
					emetteurs: _emetteurs(ctx, item),
				});
			default:
				return null;
		}
	});
}

export function tfonc100(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_tfonc100> | null {
	return ctx.register(NAMESPACE, RULES.tfonc100, item, () => {
		switch (true) {
			case models.chauffage.generateur.isChaudiereCombustion(item):
			case models.chauffage.generateur.isPoeleBouilleur(item):
			case models.chauffage.generateur.isPACHybride(item):
			case models.chauffage.generateur.isGenerateurCollectifInconnu(item):
				return formulas.calcule_tfonc100({
					tfonc100_saisi: item.signaletique.tfonc100,
					annee_installation_generateur: annee_installation(ctx, item),
					emetteurs: _emetteurs(ctx, item),
				});
			default:
				return null;
		}
	});
}

export function qgen_rec(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_qgen_rec> {
	return ctx.register(NAMESPACE, RULES.qgen_rec, item, () =>
		formulas.calcule_qgen_rec({
			generateur_mixte: item.position.generateur_mixte_id !== null,
			qgen: qgen(ctx, item),
			pn: pn(ctx, item),
			bch_hp: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.bch_hp,
			),
			nref: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.nref,
			),
		}),
	);
}

export function qgen(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.calcule_qgen> {
	return ctx.register(NAMESPACE, RULES.qgen, item, () =>
		formulas.calcule_qgen({
			presence_ventouse: presence_ventouse(ctx, item),
			qp0: combustion(ctx, item)?.qp0 ?? null,
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

export function presence_regulation(
	ctx: Context,
	item: Generateur,
): ReturnType<typeof formulas.set_presence_regulation> {
	return ctx.register(NAMESPACE, RULES.presence_regulation, item, () =>
		formulas.set_presence_regulation({
			presence_regulation: item.signaletique.presence_regulation,
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

function _emetteurs(ctx: Context, item: Generateur) {
	return ctx.once(NAMESPACE, "emetteurs", item, () => {
		const systemes = _systemes(ctx, item);
		return ctx.diagnostic.chauffage.emetteurs
			.filter((e) => systemes.some((s) => s.reseau?.emetteurs.includes(e.id)))
			.map((e) => ({
				...e,
				temperature_distribution: ctx.resolve(
					constants.chauffage.emetteur.NAMESPACE,
					constants.chauffage.emetteur.RULES.temperature_distribution,
					e,
				),
				annee_installation: ctx.resolve(
					constants.chauffage.emetteur.NAMESPACE,
					constants.chauffage.emetteur.RULES.annee_installation,
					e,
				),
			}));
	});
}

function _systemes(ctx: Context, item: Generateur) {
	return ctx.once(NAMESPACE, "systemes", item, () =>
		ctx.diagnostic.chauffage.installations.flatMap((i) =>
			i.systemes
				.filter((s) => s.generateur_id === item.id)
				.map((s) => ({
					...s,
					consommations: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.consommations,
						s,
					),
					cch: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.cch,
						s,
					),
					cch_elec: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.cch_elec,
						s,
					),
					pch: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.pch,
						s,
					),
					rdim: ctx.resolve(
						constants.chauffage.systeme.NAMESPACE,
						constants.chauffage.systeme.RULES.rdim,
						s,
					),
					rdim_installation: ctx.resolve(
						constants.chauffage.installation.NAMESPACE,
						constants.chauffage.installation.RULES.rdim,
						i,
					),
				})),
		),
	);
}
