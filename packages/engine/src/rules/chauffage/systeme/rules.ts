import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as common from "../../common/formulas.js";
import * as constants from "../../constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.consommations]: consommations,
		[RULES.bch]: bch,
		[RULES.cch]: cch,
		[RULES.cch1]: cch1,
		[RULES.cch2]: cch2,
		[RULES.cch_elec]: cch_elec,
		[RULES.cch_enr]: cch_enr,
		[RULES.caux_dist]: caux_dist,
		[RULES.caux_dist_enr]: caux_dist_enr,
		[RULES.rdim]: rdim,
		[RULES.role]: role,
		[RULES.pch]: pch,
		[RULES.pe]: pe,
		[RULES.t]: t,
		[RULES.dht]: dht,
		[RULES.int]: int,
		[RULES.ich]: ich,
		[RULES.rd]: rd,
		[RULES.re]: re,
		[RULES.rg]: rg,
		[RULES.rr]: rr,
		[RULES.pcircem]: pcircem,
		[RULES.temperature_distribution]: temperature_distribution,
		[RULES.isolation_reseau]: isolation_reseau,
	},
};

type Systeme = models.chauffage.systeme.Systeme;

export function consommations(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_consommations> {
	return ctx.register(NAMESPACE, RULES.consommations, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_consommations({
			cch: cch(ctx, item),
			cch_enr: cch_enr(ctx, item),
			caux_dist: caux_dist(ctx, item),
			caux_dist_enr: caux_dist_enr(ctx, item),
			energie: generateur.energie_generateur,
			reseau_id: generateur.reseau_id,
		});
	});
}

export function cch(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cch> {
	return ctx.register(NAMESPACE, RULES.cch, item, () =>
		formulas.calcule_cch({
			cch1: cch1(ctx, item),
			cch2: cch2(ctx, item),
		}),
	);
}

export function cch_enr(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cch_enr> {
	return ctx.register(NAMESPACE, RULES.cch_enr, item, () =>
		formulas.calcule_cch_enr({
			celec: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec,
			),
			celec_ac: ctx.resolve(
				constants.production.NAMESPACE,
				constants.production.RULES.celec_ac,
			),
			cch_elec: cch_elec(ctx, item),
		}),
	);
}

export function cch_elec(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cch_elec> {
	return ctx.register(NAMESPACE, RULES.cch_elec, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_cch_elec({
			cch1: cch1(ctx, item),
			energie_generateur: generateur.energie_generateur,
		});
	});
}

export function cch1(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cch1> {
	return ctx.register(NAMESPACE, RULES.cch1, item, () =>
		formulas.calcule_cch1({
			cch1: _emissions(ctx, item).map((e) =>
				ctx.resolve(
					constants.chauffage.emission.NAMESPACE,
					constants.chauffage.emission.RULES.cch1,
					e,
				),
			),
		}),
	);
}

export function cch2(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cch2> {
	return ctx.register(NAMESPACE, RULES.cch2, item, () =>
		formulas.calcule_cch2({
			cch2: _emissions(ctx, item).map((e) =>
				ctx.resolve(
					constants.chauffage.emission.NAMESPACE,
					constants.chauffage.emission.RULES.cch2,
					e,
				),
			),
		}),
	);
}

export function caux_dist(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return ctx.register(NAMESPACE, RULES.caux_dist, item, () =>
		formulas.calcule_caux_dist({
			pcircem: pcircem(ctx, item),
			nref: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.nref,
			),
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

export function bch(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_bch> {
	return ctx.register(NAMESPACE, RULES.bch, item, () => {
		const generateur = _generateur(ctx, item);
		const installation = _installation(ctx, item);
		return formulas.calcule_bch({
			bch: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.bch,
				installation,
			),
			dht: dht(ctx, item),
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
			installation_collective: installation.installation_collective,
			generateur_individuel: !generateur.generateur_collectif,
			systemes: installation.systemes
				.filter((s) => s.id !== item.id)
				.map((s) => {
					return {
						generateur_individuel: !_generateur(ctx, s).generateur_collectif,
					};
				}),
		});
	});
}

export function rdim(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.dimensionnement.calcule_rdim> {
	return ctx.register(NAMESPACE, RULES.rdim, item, () => {
		const map = (systeme: Systeme) => {
			const generateur = _generateur(ctx, systeme);
			return {
				...generateur,
				type_systeme: systeme.type,
				role: role(ctx, systeme),
			};
		};
		const installation = _installation(ctx, item);
		return formulas.dimensionnement.calcule_rdim({
			systemes: installation.systemes.filter((s) => s.id !== item.id).map(map),
			systeme: map(item),
		});
	});
}

export function role(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.dimensionnement.calcule_role> {
	return ctx.register(NAMESPACE, RULES.role, item, () => {
		const map = (systeme: Systeme) => {
			const generateur = _generateur(ctx, systeme);
			return { ...generateur, type_systeme: systeme.type };
		};
		const installation = _installation(ctx, item);
		return formulas.dimensionnement.calcule_role({
			systemes: installation.systemes.filter((s) => s.id !== item.id).map(map),
			systeme: map(item),
		});
	});
}

export function pch(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_pch> {
	return ctx.register(NAMESPACE, RULES.pch, item, () => {
		const installation = _installation(ctx, item);
		const generateur = _generateur(ctx, item);
		return formulas.calcule_pch({
			pch_installation: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.pch,
				installation,
			),
			installation_collective: installation.installation_collective,
			generateur_individuel: !generateur.generateur_collectif,
			systemes: installation.systemes
				.filter((s) => s.id !== item.id)
				.map((s) => {
					const generateur = _generateur(ctx, s);
					return {
						generateur_individuel: !generateur.generateur_collectif,
					};
				}),
		});
	});
}

export function pcircem(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_pcircem> {
	return ctx.register(NAMESPACE, RULES.pcircem, item, () =>
		formulas.calcule_pcircem({
			gv: ctx.resolve(
				constants.enveloppe.NAMESPACE,
				constants.enveloppe.RULES.gv,
			),
			tbase: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.tbase,
			),
			sh: _installation(ctx, item).surface,
			niveaux_desservis: item.reseau?.niveaux_desservis ?? 0,
			presence_circulateur_externe: formulas.set_presence_circulateur_externe({
				presence_circulateur_externe:
					item.reseau?.presence_circulateur_externe ?? null,
			}),
			rdim: rdim(ctx, item),
			emetteurs: _emetteurs(ctx, item).map((e) => ({
				delta_pem: ctx.resolve(
					constants.chauffage.emetteur.NAMESPACE,
					constants.chauffage.emetteur.RULES.delta_pem,
					e,
				),
				fcot: ctx.resolve(
					constants.chauffage.emetteur.NAMESPACE,
					constants.chauffage.emetteur.RULES.fcot,
					e,
				),
				dtheta_dim: ctx.resolve(
					constants.chauffage.emetteur.NAMESPACE,
					constants.chauffage.emetteur.RULES.dtheta_dim,
					e,
				),
			})),
		}),
	);
}

export function dht(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_dht> {
	return ctx.register(NAMESPACE, RULES.dht, item, () =>
		formulas.calcule_dht({
			t: t(ctx, item),
			tbase: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.tbase,
			),
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
			nref: ctx.resolve(
				constants.chauffage.NAMESPACE,
				constants.chauffage.RULES.nref,
			),
		}),
	);
}

export function pe(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_pe> {
	return ctx.register(NAMESPACE, RULES.pe, item, () => {
		const generateur = _generateur(ctx, item);
		return formulas.calcule_pe({
			pn: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.pn,
				generateur,
			),
			rd: rd(ctx, item),
			re: re(ctx, item),
			rr: rr(ctx, item),
		});
	});
}

export function t(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_t> {
	return ctx.register(NAMESPACE, RULES.t, item, () => {
		const installation = _installation(ctx, item);
		return formulas.calcule_t({
			bch: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.bch,
				installation,
			),
			pe: pe(ctx, item),
			sollicitations: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.sollicitations,
			),
		});
	});
}

export function int(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_int> {
	return ctx.register(NAMESPACE, RULES.int, item, () =>
		formulas.calcule_int({
			int: _emissions(ctx, item).map((e) =>
				ctx.resolve(
					constants.chauffage.emission.NAMESPACE,
					constants.chauffage.emission.RULES.int,
					e,
				),
			),
		}),
	);
}

export function ich(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_ich> {
	return ctx.register(NAMESPACE, RULES.ich, item, () =>
		formulas.calcule_ich({
			ich: _emissions(ctx, item).map((e) =>
				ctx.resolve(
					constants.chauffage.emission.NAMESPACE,
					constants.chauffage.emission.RULES.ich,
					e,
				),
			),
		}),
	);
}

export function rd(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_rd> {
	return ctx.register(NAMESPACE, RULES.rd, item, () =>
		formulas.calcule_rd({
			type_distribution: item.reseau?.type_distribution ?? null,
			temperature_distribution: temperature_distribution(ctx, item),
			presence_fluide_frigorigene:
				item.reseau?.presence_fluide_frigorigene ?? null,
			reseau_collectif: _installation(ctx, item).installation_collective,
			isolation_reseau: isolation_reseau(ctx, item),
		}),
	);
}

export function re(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_re> {
	return ctx.register(NAMESPACE, RULES.re, item, () =>
		formulas.calcule_re({
			re: _emissions(ctx, item).map((e) =>
				ctx.resolve(
					constants.chauffage.emission.NAMESPACE,
					constants.chauffage.emission.RULES.re,
					e,
				),
			),
		}),
	);
}

export function rg(ctx: Context, item: Systeme): formulas.Rg {
	return ctx.register(NAMESPACE, RULES.rg, item, () => {
		const generateur = _generateur(ctx, item);

		switch (true) {
			case models.chauffage.generateur.isReseauChaleur(generateur):
			case models.chauffage.generateur.isGenerateurMultiBatiment(generateur):
				return formulas.calcule_rg_reseau_chaleur();

			case models.chauffage.generateur.isPAC(generateur):
				return formulas.calcule_rg_pac();

			case models.chauffage.generateur.isChaudiereCombustion(generateur):
			case models.chauffage.generateur.isPoeleBouilleur(generateur):
			case models.chauffage.generateur.isGenerateurAirChaudCombustion(
				generateur,
			):
			case models.chauffage.generateur.isRadiateurGaz(generateur):
			case models.chauffage.generateur.isPACHybride(generateur):
			case models.chauffage.generateur.isGenerateurCollectifInconnu(
				generateur,
			): {
				const generateurs = _generateurs(ctx, item).map((g) => ({
					...g,
					pn: ctx.resolve(
						constants.chauffage.generateur.NAMESPACE,
						constants.chauffage.generateur.RULES.pn,
						g,
					),
				}));
				const combustion = ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.combustion,
					generateur,
				);
				return formulas.combustion.calcule_rg({
					...generateur,
					energie_generateur: generateur.energie_generateur,
					bienergie_generateur: generateur.bienergie,
					scenario: ctx.scenario,
					gv: ctx.resolve(
						constants.enveloppe.NAMESPACE,
						constants.enveloppe.RULES.gv,
					),
					tbase: ctx.resolve(
						constants.climat.NAMESPACE,
						constants.climat.RULES.tbase,
					),
					pn: ctx.resolve(
						constants.chauffage.generateur.NAMESPACE,
						constants.chauffage.generateur.RULES.pn,
						generateur,
					),
					pn_combustion: formulas.combustion.calcule_pn_combustion({
						generateur_collectif: generateur.generateur_collectif,
						systemes: generateurs,
					}),
					pn_cascade: formulas.combustion.calcule_pn_cascade({
						generateur_collectif: generateur.generateur_collectif,
						systemes: generateurs,
					}),
					qp0: combustion?.qp0 ?? 0,
					rpn: combustion?.rpn ?? 0,
					rpint: combustion?.rpint ?? 0,
					pveilleuse: combustion?.pveilleuse ?? 0,
					tfonc30: ctx.resolve(
						constants.chauffage.generateur.NAMESPACE,
						constants.chauffage.generateur.RULES.tfonc30,
						generateur,
					),
					tfonc100: ctx.resolve(
						constants.chauffage.generateur.NAMESPACE,
						constants.chauffage.generateur.RULES.tfonc100,
						generateur,
					),
					kpcs: common.calcule_kpcs({ energie: generateur.energie_generateur }),
				});
			}

			default:
				return formulas.calcule_rg_autres(generateur);
		}
	});
}

export function rr(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_rr> {
	return ctx.register(NAMESPACE, RULES.rr, item, () =>
		formulas.calcule_rr({
			rr: _emissions(ctx, item).map((e) =>
				ctx.resolve(
					constants.chauffage.emission.NAMESPACE,
					constants.chauffage.emission.RULES.rr,
					e,
				),
			),
		}),
	);
}

export function temperature_distribution(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.set_temperature_distribution> {
	return ctx.register(NAMESPACE, RULES.temperature_distribution, item, () =>
		formulas.set_temperature_distribution({
			temperature_distribution: item.reseau?.temperature_distribution ?? null,
		}),
	);
}

export function isolation_reseau(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.set_isolation_reseau> {
	return ctx.register(NAMESPACE, RULES.isolation_reseau, item, () =>
		formulas.set_isolation_reseau({
			isolation_reseau: item.reseau?.isolation ?? null,
		}),
	);
}

function _emissions(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "emissions", item, () => {
		const emetteurs = _emetteurs(ctx, item);
		return emetteurs.length > 0
			? emetteurs.map((e) => ({
					id: `${item.id}:${e.id}`,
					emetteur_id: e.id,
					systeme_id: item.id,
					type_distribution: item.reseau?.type_distribution ?? null,
					presence_robinet_thermostatique: e.presence_robinet_thermostatique,
				}))
			: [
					{
						id: item.id,
						emetteur_id: null,
						systeme_id: item.id,
						type_distribution: item.reseau?.type_distribution ?? null,
						presence_robinet_thermostatique: null,
					},
				];
	});
}

function _installation(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "installation", item, () =>
		models.chauffage.getInstallationBySysteme(
			ctx.diagnostic.chauffage,
			item.id,
		),
	);
}

function _generateurs(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "generateurs", item, () =>
		_installation(ctx, item).systemes.map((s) => _generateur(ctx, s)),
	);
}

function _generateur(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, `generateur:${item.generateur_id}`, item, () => {
		const generateur = models.chauffage.getGenerateur(
			ctx.diagnostic.chauffage,
			item.generateur_id,
		);
		return {
			...generateur,
			id: item.generateur_id,
			bienergie_generateur: generateur.bienergie,
			generateur_multi_batiment: generateur.position.generateur_multi_batiment,
			generateur_collectif: generateur.position.generateur_collectif,
			label_generateur: generateur.signaletique.label,
			cascade: generateur.position.cascade,
			reseau_id: generateur.position.reseau_chaleur_id,
			pn_saisi: generateur.signaletique.pn,
			type_generateur: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.type_generateur,
				generateur,
			),
			energie_generateur: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.energie_generateur,
				generateur,
			),
			mode_combustion: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.mode_combustion,
				generateur,
			),
			annee_installation_generateur: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.annee_installation,
				generateur,
			),
			presence_ventouse: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.presence_ventouse,
				generateur,
			),
			presence_regulation: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.presence_regulation,
				generateur,
			),
		};
	});
}

function _emetteurs(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "emetteurs", item, () => {
		if (null === item.reseau) return [];
		return item.reseau.emetteurs.map((id) =>
			models.chauffage.getEmetteur(ctx.diagnostic.chauffage, id),
		);
	});
}
