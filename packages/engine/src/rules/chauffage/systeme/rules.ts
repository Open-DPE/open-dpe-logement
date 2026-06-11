import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as batiment from "#rules/batiment/registry.js";
import * as common from "#rules/common/formulas.js";
import * as climat from "#rules/climat/registry.js";
import * as enveloppe from "#rules/enveloppe/registry.js";
import * as production from "#rules/production/registry.js";
import * as chauffage from "#rules/chauffage/registry.js";
import * as emetteurRules from "#rules/chauffage/emetteur/index.js";
import * as generateurRules from "#rules/chauffage/generateur/index.js";
import * as installationRules from "#rules/chauffage/installation/index.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.chauffage.installations.forEach((i) => {
		i.systemes.forEach((s) => {
			ctx.register(ID, RULES.consommations, s, () => consommations(ctx, s));
			ctx.register(ID, RULES.cch, s, () => cch(ctx, i, s));
			ctx.register(ID, RULES.cch_elec, s, () => cch_elec(ctx, i, s));
			ctx.register(ID, RULES.cch_enr, s, () => cch_enr(ctx, s));
			ctx.register(ID, RULES.caux_dist, s, () => caux_dist(ctx, s));
			ctx.register(ID, RULES.caux_dist_enr, s, () => caux_dist_enr(ctx, s));
			ctx.register(ID, RULES.rdim, s, () => rdim(ctx, i, s));
			ctx.register(ID, RULES.pch, s, () => pch(ctx, i, s));
			ctx.register(ID, RULES.pcircem, s, () => pcircem(ctx, i, s));
			ctx.register(ID, RULES.int, s, () => int(ctx, i, s));
			ctx.register(ID, RULES.ich, s, () => ich(ctx, i, s));
			ctx.register(ID, RULES.rd, s, () => rd(i, s));
			ctx.register(ID, RULES.re, s, () => re(ctx, s));
			ctx.register(ID, RULES.rg, s, () => rg(ctx, i, s));
			ctx.register(ID, RULES.rr, s, () => rr(ctx, i, s));
		});
	});
}

type Installation = models.chauffage.installation.Installation;
type Systeme = models.chauffage.systeme.Systeme;
type Emission = {
	id: string;
	type_emission: ReturnType<typeof formulas.emission.calcule_type_emission>;
	presence_robinet_thermostatique: boolean | null;
};

export function consommations(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_consommations> {
	const generateur = prepare_generateur(ctx, systeme);
	return formulas.calcule_consommations({
		cch: ctx.resolve(ID, RULES.cch, systeme),
		cch_enr: ctx.resolve(ID, RULES.cch_enr, systeme),
		caux_dist: ctx.resolve(ID, RULES.caux_dist, systeme),
		caux_dist_enr: ctx.resolve(ID, RULES.caux_dist_enr, systeme),
		energie: generateur.energie_generateur,
		reseau_id: generateur.reseau_id,
	});
}

export function cch(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cch> {
	return formulas.calcule_cch({
		cch1: cch1(ctx, installation, systeme),
		cch2: cch2(ctx, installation, systeme),
	});
}

export function cch_enr(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cch_enr> {
	return formulas.calcule_cch_enr({
		celec: ctx.resolve(production.ID, production.RULES.celec),
		celec_ac: ctx.resolve(production.ID, production.RULES.celec_ac),
		cch_elec: ctx.resolve(ID, RULES.cch_elec, systeme),
	});
}

export function cch_elec(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cch_elec> {
	const generateur = prepare_generateur(ctx, systeme);
	return formulas.calcule_cch_elec({
		cch1: cch1(ctx, installation, systeme),
		energie_generateur: generateur.energie_generateur,
	});
}

export function cch1(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cch1> {
	return ctx.once(ID, "cch1", systeme, () =>
		formulas.calcule_cch1({
			cch1: emissions(ctx, systeme).map((emission) =>
				cch1_e(ctx, installation, systeme, emission),
			),
		}),
	);
}

export function cch2(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cch2> {
	return ctx.once(ID, "cch2", systeme, () =>
		formulas.calcule_cch2({
			cch2: emissions(ctx, systeme).map((emission) =>
				cch2_e(ctx, installation, systeme, emission),
			),
		}),
	);
}

export function caux_dist(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return formulas.calcule_caux_dist({
		pcircem: ctx.resolve(ID, RULES.pcircem, systeme),
		nref: ctx.resolve(chauffage.ID, chauffage.RULES.nref),
	});
}

export function caux_dist_enr(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist_enr> {
	return formulas.calcule_caux_dist_enr({
		celec: ctx.resolve(production.ID, production.RULES.celec),
		celec_ac: ctx.resolve(production.ID, production.RULES.celec_ac),
		caux_dist: ctx.resolve(ID, RULES.caux_dist, systeme),
	});
}

export function bch(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_bch> {
	return ctx.once(ID, "bch", systeme, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.calcule_bch({
			bch: ctx.resolve(
				installationRules.ID,
				installationRules.RULES.bch,
				installation,
			),
			dht: dht(ctx, installation, systeme),
			sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
			installation_collective: installation.installation_collective,
			generateur_individuel: !generateur.generateur_collectif,
			systemes: installation.systemes
				.filter((s) => s.id !== systeme.id)
				.map((s) => {
					return {
						generateur_individuel: !prepare_generateur(ctx, s)
							.generateur_collectif,
					};
				}),
		});
	});
}

export function rdim(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_rdim> {
	const map = (systeme: Systeme) => {
		const generateur = prepare_generateur(ctx, systeme);
		return {
			...generateur,
			type_systeme: systeme.type,
			role: role(ctx, installation, systeme),
		};
	};
	return formulas.calcule_rdim({
		systemes: installation.systemes.filter((s) => s.id !== systeme.id).map(map),
		systeme: map(systeme),
	});
}

export function role(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_role> {
	return ctx.once(ID, "role", systeme, () => {
		const map = (systeme: Systeme) => {
			const generateur = prepare_generateur(ctx, systeme);
			return { ...generateur, type_systeme: systeme.type };
		};

		return formulas.calcule_role({
			systemes: installation.systemes
				.filter((s) => s.id !== systeme.id)
				.map(map),
			systeme: map(systeme),
		});
	});
}

export function pch(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_pch> {
	return formulas.calcule_pch({
		pch_installation: ctx.resolve(
			installationRules.ID,
			installationRules.RULES.pch,
			installation,
		),
		installation_collective: installation.installation_collective,
		generateur_individuel: !prepare_generateur(ctx, systeme)
			.generateur_collectif,
		systemes: installation.systemes
			.filter((s) => s.id !== systeme.id)
			.map((s) => {
				return {
					generateur_individuel: !prepare_generateur(ctx, s)
						.generateur_collectif,
				};
			}),
	});
}

export function pcircem(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_pcircem> {
	return formulas.calcule_pcircem({
		gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
		tbase: ctx.resolve(climat.ID, climat.RULES.tbase),
		sh: installation.surface,
		niveaux_desservis: systeme.reseau?.niveaux_desservis ?? 0,
		presence_circulateur_externe: formulas.set_presence_circulateur_externe({
			presence_circulateur_externe:
				systeme.reseau?.presence_circulateur_externe ?? null,
		}),
		rdim: ctx.resolve(ID, RULES.rdim, systeme),
		emetteurs: emetteurs(ctx, systeme).map((emetteur) => ({
			delta_pem: ctx.resolve(
				emetteurRules.ID,
				emetteurRules.RULES.delta_pem,
				emetteur,
			),
			fcot: ctx.resolve(emetteurRules.ID, emetteurRules.RULES.fcot, emetteur),
			dtheta_dim: ctx.resolve(
				emetteurRules.ID,
				emetteurRules.RULES.dtheta_dim,
				emetteur,
			),
		})),
	});
}

export function dht(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_dht> {
	return ctx.once(ID, "dht", systeme, () =>
		formulas.calcule_dht({
			tbase: ctx.resolve(climat.ID, climat.RULES.tbase),
			t: t(ctx, installation, systeme),
			sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
			nref: ctx.resolve(chauffage.ID, chauffage.RULES.nref),
		}),
	);
}

export function pe(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_pe> {
	return ctx.once(ID, "pe", systeme, () =>
		formulas.calcule_pe({
			pn: ctx.resolve(generateurRules.ID, generateurRules.RULES.pn, {
				id: systeme.generateur_id,
			}),
			rd: rd(installation, systeme),
			re: re(ctx, systeme),
			rr: rr(ctx, installation, systeme),
		}),
	);
}

export function t(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_t> {
	return ctx.once(ID, "t", systeme, () =>
		formulas.calcule_t({
			bch: ctx.resolve(
				installationRules.ID,
				installationRules.RULES.bch,
				installation,
			),
			pe: pe(ctx, installation, systeme),
			sollicitations: ctx.resolve(climat.ID, climat.RULES.sollicitations),
		}),
	);
}

export function int(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_int> {
	return formulas.calcule_int({
		int: emissions(ctx, systeme).map((emission) =>
			int_e(ctx, installation, systeme, emission),
		),
	});
}

export function ich(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_ich> {
	return formulas.calcule_ich({
		ich: emissions(ctx, systeme).map((emission) =>
			ich_e(ctx, installation, systeme, emission),
		),
	});
}

export function rd(
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_rd> {
	return formulas.calcule_rd({
		type_distribution: systeme.reseau?.type_distribution ?? null,
		temperature_distribution: temperature_distribution(systeme),
		presence_fluide_frigorigene:
			systeme.reseau?.presence_fluide_frigorigene ?? null,
		reseau_collectif: installation.installation_collective,
		isolation_reseau: isolation_reseau(systeme),
	});
}

export function re(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_re> {
	return formulas.calcule_re({
		re: emissions(ctx, systeme).map((emission) => re_e(ctx, systeme, emission)),
	});
}

export function rg(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_rg> {
	const generateur = prepare_generateur(ctx, systeme);
	const generateurs = prepare_generateurs(ctx, installation).filter(
		(s) => s.id !== systeme.id,
	);

	const utils = generateurRules.formulas.utils;

	switch (true) {
		case utils.is_reseau_chaleur(generateur):
		case utils.is_generateur_multi_batiment(generateur):
			return formulas.calcule_rg_reseau_chaleur();

		case utils.is_pac(generateur):
			return formulas.calcule_rg_pac();

		case utils.is_chaudiere_combustion(generateur):
		case utils.is_chaudiere_bois(generateur):
		case utils.is_poele_bouilleur(generateur):
		case utils.is_generateur_air_chaud_combustion(generateur):
		case utils.is_radiateur_gaz(generateur):
		case utils.is_pac_hybride(generateur):
			return formulas.calcule_rg({
				...generateur,
				scenario: ctx.scenario,
				gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
				tbase: ctx.resolve(climat.ID, climat.RULES.tbase),
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
		default:
			return formulas.calcule_rg_autres(generateur);
	}
}

export function rr(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_rr> {
	return formulas.calcule_rr({
		rr: emissions(ctx, systeme).map((emission) =>
			rr_e(ctx, installation, systeme, emission),
		),
	});
}

export function cch_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_cch> {
	return ctx.once(ID, `cch`, emission, () => {
		return formulas.emission.calcule_cch({
			cch1: cch1_e(ctx, installation, systeme, emission),
			cch2: cch2_e(ctx, installation, systeme, emission),
		});
	});
}

export function cch1_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_cch1> {
	return ctx.once(ID, `cch1`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_cch1({
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
			pac_hybride: generateurRules.formulas.utils.is_pac_hybride(generateur),
			bch: bch(ctx, installation, systeme),
			fch: ctx.resolve(
				installationRules.ID,
				installationRules.RULES.fch,
				installation,
			),
			rdim_i: ctx.resolve(
				installationRules.ID,
				installationRules.RULES.rdim,
				installation,
			),
			rdim: ctx.resolve(ID, RULES.rdim, systeme),
			int: int(ctx, installation, systeme),
			ich1: ich1_e(ctx, installation, systeme, emission),
			n: emissions(ctx, systeme).length,
		});
	});
}

export function cch2_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_cch2> {
	return ctx.once(ID, `cch2`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_cch2({
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
			pac_hybride: generateurRules.formulas.utils.is_pac_hybride(generateur),
			bch: bch(ctx, installation, systeme),
			fch: ctx.resolve(
				installationRules.ID,
				installationRules.RULES.fch,
				installation,
			),
			rdim_i: ctx.resolve(
				installationRules.ID,
				installationRules.RULES.rdim,
				installation,
			),
			rdim: ctx.resolve(ID, RULES.rdim, systeme),
			int: int(ctx, installation, systeme),
			ich2: ich2_e(ctx, installation, systeme, emission) ?? 0,
			n: emissions(ctx, systeme).length,
		});
	});
}

export function ich_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.calcule_ich> {
	return ctx.once(ID, `ich`, systeme, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_ich({
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
			pac_hybride: generateurRules.formulas.utils.is_pac_hybride(generateur),
			ich1: ich1_e(ctx, installation, systeme, emission),
			ich2: ich2_e(ctx, installation, systeme, emission),
		});
	});
}

export function ich1_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_ich1> {
	return ctx.once(ID, `ich1`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_ich1({
			rd: ctx.resolve(ID, RULES.rd, systeme),
			rg: ctx.resolve(ID, RULES.rg, systeme),
			re: re_e(ctx, systeme, emission),
			rr: rr_e(ctx, installation, systeme, emission),
			scop: ctx.resolve(
				generateurRules.ID,
				generateurRules.RULES.scop,
				generateur,
			),
		});
	});
}

export function ich2_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_ich2> | null {
	return ctx.once(ID, `ich2`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return generateurRules.formulas.utils.is_pac_hybride(generateur)
			? formulas.emission.calcule_ich2({
					rd: ctx.resolve(ID, RULES.rd, systeme),
					rg: ctx.resolve(ID, RULES.rg, systeme),
					re: re_e(ctx, systeme, emission),
					rr: rr_e(ctx, installation, systeme, emission),
				})
			: null;
	});
}

export function re_e(
	ctx: Context,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_re> {
	return ctx.once(ID, `re`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_re({
			type_emission: emission.type_emission,
			type_generateur: generateur.type_generateur,
			label_generateur: generateur.label_generateur,
		});
	});
}

export function rr_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_rr> {
	return ctx.once(ID, `rr`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_rr({
			type_emission: emission.type_emission,
			type_generateur: generateur.type_generateur,
			label_generateur: generateur.label_generateur,
			reseau_collectif: installation.installation_collective,
			presence_robinet_thermostatique: emission.presence_robinet_thermostatique,
			presence_regulation_terminale: installation.regulation_terminale,
		});
	});
}

export function int_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_int> {
	return ctx.once(ID, `int`, emission, () => {
		return formulas.emission.calcule_int({
			gv: ctx.resolve(enveloppe.ID, enveloppe.RULES.gv),
			sh: ctx.resolve(batiment.ID, batiment.RULES.sh),
			hsp: ctx.resolve(batiment.ID, batiment.RULES.hsp),
			i0: i0_e(ctx, installation, systeme, emission),
		});
	});
}

export function i0_e(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
	emission: Emission,
): ReturnType<typeof formulas.emission.calcule_i0> {
	return ctx.once(ID, `i0`, emission, () => {
		const generateur = prepare_generateur(ctx, systeme);
		return formulas.emission.calcule_i0({
			type_batiment: ctx.diagnostic.batiment.type,
			type_chauffage: installation.type,
			type_emission: emission.type_emission,
			inertie: ctx.resolve(enveloppe.ID, enveloppe.RULES.inertie),
			installation_collective: installation.installation_collective,
			comptage_individuel: installation.comptage_individuel,
			regulation_terminale: installation.regulation_terminale,
			type_programmation: installation.programmation,
			type_generateur: generateur.type_generateur,
		});
	});
}

export function emissions(
	ctx: Context,
	systeme: Systeme,
): models.common.NonEmptyArray<Emission> {
	return ctx.once(ID, "emissions", systeme, () => {
		const generateur = prepare_generateur(ctx, systeme);
		const emissions: Emission[] = emetteurs(ctx, systeme).map((e) => ({
			id: `${systeme.id}:emission:${e.id}`,
			presence_robinet_thermostatique: e.presence_robinet_thermostatique,
			type_emission: formulas.emission.calcule_type_emission({
				type_emetteur: e.type,
				type_generateur: generateur.type_generateur,
				type_distribution: systeme.reseau?.type_distribution ?? null,
			}),
		}));
		if (emissions.length === 0) {
			emissions.push({
				id: `${systeme.id}:emission:1`,
				type_emission: formulas.emission.calcule_type_emission({
					type_generateur: generateur.type_generateur,
					type_distribution: systeme.reseau?.type_distribution ?? null,
					type_emetteur: null,
				}),
				presence_robinet_thermostatique: null,
			});
		}
		return models.common.toNonEmptyArray(emissions);
	});
}

function prepare_generateurs(ctx: Context, installation: Installation) {
	return ctx.once(ID, "generateurs", installation, () =>
		installation.systemes.map((s) => prepare_generateur(ctx, s)),
	);
}

function prepare_generateur(ctx: Context, systeme: Systeme) {
	return ctx.once(ID, `generateur:${systeme.generateur_id}`, systeme, () => {
		const generateur = models.chauffage.get_generateur(
			ctx.diagnostic.chauffage,
			systeme.generateur_id,
		);
		return {
			id: systeme.generateur_id,
			type_generateur: generateurRules.rules.type_generateur(generateur),
			energie_generateur: generateurRules.rules.energie_generateur(generateur),
			bienergie_generateur: generateur.bienergie,
			generateur_multi_batiment: generateur.position.generateur_multi_batiment,
			generateur_collectif: generateur.position.generateur_collectif,
			label_generateur: generateur.signaletique.label,
			annee_installation_generateur: generateurRules.rules.annee_installation(
				ctx,
				generateur,
			),
			mode_combustion: generateurRules.rules.mode_combustion(generateur),
			presence_regulation:
				generateurRules.rules.presence_regulation(generateur),
			cascade: generateur.position.cascade,
			reseau_id: generateur.position.reseau_chaleur_id,
			pn_saisi: generateur.signaletique.pn,
			pn: ctx.resolve(generateurRules.ID, generateurRules.RULES.pn, generateur),
			rpn:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.rpn,
					generateur,
				) ?? 0,
			rpint:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.rpint,
					generateur,
				) ?? 0,
			qp0:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.qp0,
					generateur,
				) ?? 0,
			pveilleuse:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.pveilleuse,
					generateur,
				) ?? 0,
			scop:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.scop,
					generateur,
				) ?? 0,
			tfonc30:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.tfonc30,
					generateur,
				) ?? 0,
			tfonc100:
				ctx.resolve(
					generateurRules.ID,
					generateurRules.RULES.tfonc100,
					generateur,
				) ?? 0,
		};
	});
}

function emetteurs(
	ctx: Context,
	systeme: Systeme,
): models.chauffage.emetteur.Emetteur[] {
	return (
		systeme.reseau?.emetteurs.map((id) =>
			models.chauffage.get_emetteur(ctx.diagnostic.chauffage, id),
		) ?? []
	);
}

function temperature_distribution(
	systeme: Systeme,
): ReturnType<typeof formulas.set_temperature_distribution> {
	return formulas.set_temperature_distribution({
		temperature_distribution: systeme.reseau?.temperature_distribution ?? null,
	});
}

function isolation_reseau(
	systeme: Systeme,
): ReturnType<typeof formulas.set_isolation_reseau> {
	return formulas.set_isolation_reseau({
		isolation_reseau: systeme.reseau?.isolation ?? null,
	});
}

export function applique(
	ctx: Context,
	item: Systeme,
): models.chauffage.systeme.SystemeWithData {
	return {
		...item,
		data: {
			rdim: ctx.resolve(ID, RULES.rdim, item),
			pch: ctx.resolve(ID, RULES.pch, item),
			int: ctx.resolve(ID, RULES.int, item),
			ich: ctx.resolve(ID, RULES.ich, item),
			rd: ctx.resolve(ID, RULES.rd, item),
			re: ctx.resolve(ID, RULES.re, item),
			rg: ctx.resolve(ID, RULES.rg, item),
			rr: ctx.resolve(ID, RULES.rr, item),
			pcircem: ctx.resolve(ID, RULES.pcircem, item),
			consommations: ctx.resolve(ID, RULES.consommations, item),
		},
	};
}
