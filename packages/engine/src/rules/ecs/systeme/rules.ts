import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Installation = models.ecs.installation.Installation;
type Systeme = models.ecs.systeme.Systeme;

export function calcule(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): models.ecs.systeme.SystemeWithData {
	return {
		...systeme,
		data: {
			rdim: rdim(ctx, installation),
			iecs: iecs(ctx, systeme),
			rd: rd(ctx, installation, systeme),
			rs: rs(ctx, systeme),
			rg: rg(ctx, systeme),
			rgs: rgs(ctx, systeme),
			qcirb: qcirb(ctx, installation, systeme),
			qtrac: qtrac(ctx, installation, systeme),
			consommations: consommations(ctx, installation, systeme),
		},
	};
}

export function consommations(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_consommations> {
	const generateur = models.ecs.get_generateur(
		ctx.diagnostic.ecs,
		systeme.generateur_id,
	);
	return formulas.calcule_consommations({
		cecs: cecs(ctx, installation, systeme),
		cecs_enr: cecs_enr(ctx, systeme),
		caux_dist: caux_dist(ctx, systeme),
		caux_dist_enr: caux_dist_enr(ctx, systeme),
		energie: generateurRules.rules.energie_generateur(generateur),
		reseau_id: generateur.position.reseau_chaleur_id,
	});
}

export function cecs(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cecs> {
	return formulas.calcule_cecs({
		becs: ctx.resolve(
			installationRegistry.NAMESPACE,
			installationRegistry.RULES.becs,
			installation,
		),
		fecs: ctx.resolve(
			installationRegistry.NAMESPACE,
			installationRegistry.RULES.fecs,
			installation,
		),
		rdim: ctx.resolve(NAMESPACE, RULES.rdim, systeme),
		iecs: ctx.resolve(NAMESPACE, RULES.iecs, systeme),
	});
}

export function cecs_enr(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cecs_enr> {
	return formulas.calcule_cecs_enr({
		celec: ctx.resolve(production.NAMESPACE, production.RULES.celec),
		celec_ac: ctx.resolve(production.NAMESPACE, production.RULES.celec_ac),
		cecs_elec: ctx.resolve(NAMESPACE, RULES.cecs_elec, systeme),
	});
}

export function cecs_elec(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_cecs_elec> {
	const generateur = models.ecs.get_generateur(
		ctx.diagnostic.ecs,
		systeme.generateur_id,
	);
	return formulas.calcule_cecs_elec({
		cecs: ctx.resolve(NAMESPACE, RULES.cecs, systeme),
		energie_generateur: generateurRules.rules.energie_generateur(generateur),
	});
}

export function caux_dist(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist> {
	return formulas.calcule_caux_dist({
		qtrac: ctx.resolve(NAMESPACE, RULES.qtrac, item),
		qcirb: ctx.resolve(NAMESPACE, RULES.qcirb, item),
	});
}

export function caux_dist_enr(
	ctx: Context,
	item: Systeme,
): ReturnType<typeof formulas.calcule_caux_dist_enr> {
	return formulas.calcule_caux_dist_enr({
		celec: ctx.resolve(production.NAMESPACE, production.RULES.celec),
		celec_ac: ctx.resolve(production.NAMESPACE, production.RULES.celec_ac),
		caux_dist: ctx.resolve(NAMESPACE, RULES.caux_dist, item),
	});
}

export function qcirb(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_qcirb> {
	return formulas.calcule_qcirb({
		nj: ctx.resolve(climat.NAMESPACE, climat.RULES.nj),
		sh: installation.surface,
		installation_collective: installation.installation_collective,
		bouclage: bouclage_reseau(systeme),
		niveaux_desservis: systeme.reseau.niveaux_desservis,
		qdw: ctx.resolve(
			installationRegistry.NAMESPACE,
			installationRegistry.RULES.qdw,
			installation,
		),
	});
}

export function qtrac(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_qtrac> {
	return formulas.calcule_qtrac({
		becs: ctx.resolve(
			installationRegistry.NAMESPACE,
			installationRegistry.RULES.becs,
			installation,
		),
		installation_collective: installation.installation_collective,
		bouclage: bouclage_reseau(systeme),
	});
}

export function rdim(
	installation: Installation,
): ReturnType<typeof formulas.calcule_rdim> {
	return formulas.calcule_rdim({
		n_systemes: installation.systemes.length,
	});
}

export function iecs(
	ctx: Context,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_iecs> {
	return formulas.calcule_iecs({
		rd: ctx.resolve(NAMESPACE, RULES.rd, systeme),
		rg: ctx.resolve(NAMESPACE, RULES.rg, systeme),
		rs: ctx.resolve(NAMESPACE, RULES.rs, systeme),
		rgs: ctx.resolve(NAMESPACE, RULES.rgs, systeme),
	});
}

export function rd(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_rd> {
	const generateur = models.ecs.get_generateur(
		ctx.diagnostic.ecs,
		systeme.generateur_id,
	);
	return formulas.calcule_rd({
		installation_collective: installation.installation_collective,
		bouclage_reseau: bouclage_reseau(systeme),
		alimentation_contigue: systeme.reseau.alimentation_contigue,
		production_volume_habitable: generateur.position.position_volume_chauffe,
	});
}

export function rendements(
	ctx: Context,
	installation: Installation,
	systeme: Systeme,
): ReturnType<typeof formulas.calcule_rendements> {
	return ctx.register(NAMESPACE, RULES.rendements, () => {
		const generateur = models.ecs.get_generateur(
			ctx.diagnostic.ecs,
			systeme.generateur_id,
		);

		switch (true) {
			case models.ecs.generateur.isReseauChaleur(generateur):
			case models.ecs.generateur.isGenerateurMultiBatiment(generateur): {
				return formulas.calcule_rendements_reseau_chaleur({
					isolation_reseau: isolation_reseau(systeme),
				});
			}

			case models.ecs.generateur.isChaudiereCombustion(generateur):
			case models.ecs.generateur.isPoeleBoisBouilleur(generateur):
			case models.ecs.generateur.isPacHybride(generateur):
			case models.ecs.generateur.isGenerateurCollectifInconnu(generateur): {
				const combustion = ctx.resolve(
					generateurRules.NAMESPACE,
					generateurRules.RULES.combustion,
					generateur,
				);
				return formulas.calcule_rendements_chaudiere_mixte({
					becs: ctx.resolve(
						installationRegistry.NAMESPACE,
						installationRegistry.RULES.becs,
						installation,
					),
					qgw: ctx.resolve(
						generateurRules.NAMESPACE,
						generateurRules.RULES.qgw,
						generateur,
					),
					rpn: combustion.rpn,
					qp0: combustion.qp0,
					pveilleuse: combustion.pveilleuse,
				});
			}

			case models.ecs.generateur.isChauffeEauGaz(generateur): {
				const combustion = ctx.resolve(
					generateurRules.NAMESPACE,
					generateurRules.RULES.combustion,
					generateur,
				);
				return formulas.calcule_rendements_chaudiere_mixte({
					becs: ctx.resolve(
						installationRegistry.NAMESPACE,
						installationRegistry.RULES.becs,
						installation,
					),
					qgw: ctx.resolve(
						generateurRules.NAMESPACE,
						generateurRules.RULES.qgw,
						generateur,
					),
					rpn: combustion.rpn,
					qp0: combustion.qp0,
					pveilleuse: combustion.pveilleuse,
				});
			}

			case models.ecs.generateur.isChauffeEauThermodynamique(generateur):
			case models.ecs.generateur.isPacDoubleService(generateur): {
				return formulas.calcule_rendements_systeme_thermodynamique({
					cop: ctx.resolve(
						generateurRules.NAMESPACE,
						generateurRules.RULES.cop,
						generateur,
					),
				});
			}
		}
	});
}

export function bouclage_reseau(
	systeme: Systeme,
): ReturnType<typeof formulas.set_bouclage_reseau> {
	return formulas.set_bouclage_reseau({
		bouclage_reseau: systeme.reseau.bouclage ?? null,
	});
}

export function isolation_reseau(
	systeme: Systeme,
): ReturnType<typeof formulas.set_isolation_reseau> {
	return formulas.set_isolation_reseau({
		isolation_reseau: systeme.reseau.isolation ?? null,
	});
}
