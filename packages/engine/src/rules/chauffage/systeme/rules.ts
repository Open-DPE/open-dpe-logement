import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as common from "#rules/common/formulas.js";
import {
	type_generateur,
	energie_generateur,
	mode_combustion,
	presence_regulation,
	annee_installation,
} from "../generateur/rules.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export function calcule(
	ctx: Context,
	item: Systeme,
): models.chauffage.systeme.SystemeData {
	return {
		rdim: rdim(ctx, item),
		pch: pch(ctx, item),
		int: int(ctx, item),
		ich: ich(ctx, item),
		rd: rd(ctx, item),
		re: re(ctx, item),
		rg: rg(ctx, item),
		rr: rr(ctx, item),
		pcircem: pcircem(ctx, item),
		consommations: consommations(ctx, item),
	};
}

type Installation = models.chauffage.installation.Installation;

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
	return ctx.register(NAMESPACE, "cch_elec", item, () => {
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
	return ctx.once(NAMESPACE, "cch1", item, () =>
		formulas.calcule_cch1({
			cch1: _emissions(ctx, item).map((e) => e.cch1),
		}),
	);
}

export function cch2(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_cch2> {
	return ctx.once(NAMESPACE, "cch2", item, () =>
		formulas.calcule_cch2({
			cch2: _emissions(ctx, item).map((e) => e.cch2),
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
			bch: installation.bch,
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
	return ctx.once(NAMESPACE, "role", item, () => {
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
			pch_installation: installation.pch,
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
			emetteurs: _emetteurs(ctx, item),
		}),
	);
}

export function dht(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_dht> {
	return ctx.once(NAMESPACE, "dht", item, () =>
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
	return ctx.once(NAMESPACE, "pe", item, () =>
		formulas.calcule_pe({
			pn: _generateur(ctx, item).pn,
			rd: rd(ctx, item),
			re: re(ctx, item),
			rr: rr(ctx, item),
		}),
	);
}

export function t(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_t> {
	return ctx.once(NAMESPACE, "t", item, () => {
		const installation = _installation(ctx, item);
		return formulas.calcule_t({
			bch: installation.bch,
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
			int: _emissions(ctx, item).map((e) => e.int),
		}),
	);
}

export function ich(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_ich> {
	return ctx.register(NAMESPACE, RULES.ich, item, () =>
		formulas.calcule_ich({
			ich: _emissions(ctx, item).map((e) => e.ich),
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
			temperature_distribution: temperature_distribution(item),
			presence_fluide_frigorigene:
				item.reseau?.presence_fluide_frigorigene ?? null,
			reseau_collectif: _installation(ctx, item).installation_collective,
			isolation_reseau: isolation_reseau(item),
		}),
	);
}

export function re(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_re> {
	return ctx.register(NAMESPACE, RULES.re, item, () =>
		formulas.calcule_re({
			re: _emissions(ctx, item).map((e) => e.re),
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
				const installation = _installation(ctx, item);
				const generateurs = _generateurs(ctx, installation).filter(
					(s) => s.id !== item.id,
				);
				return formulas.combustion.calcule_rg({
					...generateur,
					energie_generateur:
						generateur.bienergie ?? generateur.energie_generateur,
					scenario: ctx.scenario,
					gv: ctx.resolve(
						constants.enveloppe.NAMESPACE,
						constants.enveloppe.RULES.gv,
					),
					tbase: ctx.resolve(
						constants.climat.NAMESPACE,
						constants.climat.RULES.tbase,
					),
					pn_combustion: formulas.combustion.calcule_pn_combustion({
						generateur_collectif: generateur.generateur_collectif,
						systemes: generateurs,
					}),
					pn_cascade: formulas.combustion.calcule_pn_cascade({
						generateur_collectif: generateur.generateur_collectif,
						systemes: generateurs,
					}),
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
			rr: _emissions(ctx, item).map((e) => e.rr),
		}),
	);
}

export function _emissions(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "emissions", item, () => {
		const emetteurs = _emetteurs(ctx, item);

		const emissions =
			emetteurs.length > 0
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

		const ns = constants.chauffage.emission.NAMESPACE;
		const rules = constants.chauffage.emission.RULES;

		return emissions.map((emission) => ({
			...emission,
			cch: ctx.resolve(ns, rules.cch, emission),
			cch1: ctx.resolve(ns, rules.cch1, emission),
			cch2: ctx.resolve(ns, rules.cch2, emission),
			ich: ctx.resolve(ns, rules.ich, emission),
			ich1: ctx.resolve(ns, rules.ich1, emission),
			ich2: ctx.resolve(ns, rules.ich2, emission),
			re: ctx.resolve(ns, rules.re, emission),
			rr: ctx.resolve(ns, rules.rr, emission),
			int: ctx.resolve(ns, rules.int, emission),
			i0: ctx.resolve(ns, rules.i0, emission),
		}));
	});
}

function _installation(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, "installation", item, () => {
		const installation = models.chauffage.getInstallationBySysteme(
			ctx.diagnostic.chauffage,
			item.id,
		);
		return {
			...installation,
			bch: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.bch,
				installation,
			),
			pch: ctx.resolve(
				constants.chauffage.installation.NAMESPACE,
				constants.chauffage.installation.RULES.pch,
				installation,
			),
		};
	});
}

function _generateurs(ctx: Context, item: Installation) {
	return ctx.once(NAMESPACE, "generateurs", item, () =>
		item.systemes.map((s) => _generateur(ctx, s)),
	);
}

function _generateur(ctx: Context, item: Systeme) {
	return ctx.once(NAMESPACE, `generateur:${item.generateur_id}`, item, () => {
		const generateur = models.chauffage.getGenerateur(
			ctx.diagnostic.chauffage,
			item.generateur_id,
		);
		const combustion = ctx.resolve(
			constants.chauffage.generateur.NAMESPACE,
			constants.chauffage.generateur.RULES.combustion,
			generateur,
		);
		return {
			...generateur,
			id: item.generateur_id,
			type_generateur: type_generateur(generateur),
			energie_generateur: energie_generateur(generateur),
			bienergie_generateur: generateur.bienergie,
			generateur_multi_batiment: generateur.position.generateur_multi_batiment,
			generateur_collectif: generateur.position.generateur_collectif,
			label_generateur: generateur.signaletique.label,
			annee_installation_generateur: annee_installation(ctx, generateur),
			mode_combustion: mode_combustion(generateur),
			presence_regulation: presence_regulation(generateur),
			cascade: generateur.position.cascade,
			reseau_id: generateur.position.reseau_chaleur_id,
			pn_saisi: generateur.signaletique.pn,
			pn: ctx.resolve(
				constants.chauffage.generateur.NAMESPACE,
				constants.chauffage.generateur.RULES.pn,
				generateur,
			),
			rpn: combustion?.rpn ?? 0,
			rpint: combustion?.rpint ?? 0,
			qp0: combustion?.qp0 ?? 0,
			pveilleuse: combustion?.pveilleuse ?? 0,
			scop:
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.scop,
					generateur,
				) ?? 0,
			tfonc30:
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.tfonc30,
					generateur,
				) ?? 0,
			tfonc100:
				ctx.resolve(
					constants.chauffage.generateur.NAMESPACE,
					constants.chauffage.generateur.RULES.tfonc100,
					generateur,
				) ?? 0,
		};
	});
}

function _emetteurs(ctx: Context, item: Systeme) {
	if (null === item.reseau) return [];
	return item.reseau.emetteurs.map((id) => {
		const emetteur = models.chauffage.getEmetteur(ctx.diagnostic.chauffage, id);
		return {
			...emetteur,
			fcot: ctx.resolve(
				constants.chauffage.emetteur.NAMESPACE,
				constants.chauffage.emetteur.RULES.fcot,
				emetteur,
			),
			delta_pem: ctx.resolve(
				constants.chauffage.emetteur.NAMESPACE,
				constants.chauffage.emetteur.RULES.delta_pem,
				emetteur,
			),
			dtheta_dim: ctx.resolve(
				constants.chauffage.emetteur.NAMESPACE,
				constants.chauffage.emetteur.RULES.dtheta_dim,
				emetteur,
			),
		};
	});
}

function temperature_distribution(
	item: Systeme,
): ReturnType<typeof formulas.set_temperature_distribution> {
	return formulas.set_temperature_distribution({
		temperature_distribution: item.reseau?.temperature_distribution ?? null,
	});
}

function isolation_reseau(
	item: Systeme,
): ReturnType<typeof formulas.set_isolation_reseau> {
	return formulas.set_isolation_reseau({
		isolation_reseau: item.reseau?.isolation ?? null,
	});
}
