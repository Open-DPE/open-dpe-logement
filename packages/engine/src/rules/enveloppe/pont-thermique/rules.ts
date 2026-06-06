import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.ponts_thermiques.forEach((item) => {
		ctx.register(ID, RULES.pt, item, () => pt(ctx, item));
		ctx.register(ID, RULES.kpt, item, () => kpt(ctx, item));
	});
}

type PontThermique = models.enveloppe.pontThermique.PontThermique;

export function pt(
	ctx: Context,
	item: PontThermique,
): ReturnType<typeof formulas.calcule_pt> {
	return formulas.calcule_pt({
		type_liaison: item.liaison.type,
		kpt: ctx.resolve(ID, RULES.kpt, item),
		l: item.longueur,
		pont_thermique_partiel: item.liaison.pont_thermique_partiel ?? false,
	});
}

export function kpt(
	ctx: Context,
	item: PontThermique,
): ReturnType<typeof formulas.calcule_kpt> {
	const enums = models.enveloppe.pontThermique.TypeLiaisonEnum;
	const type_liaison = item.liaison.type;
	const kpt_saisi = item.kpt;
	const mur = models.enveloppe.get_mur(
		ctx.diagnostic.enveloppe,
		item.liaison.mur_id,
	);

	switch (type_liaison) {
		case enums.plancher_bas_mur: {
			const plancher = models.enveloppe.get_plancher_bas(
				ctx.diagnostic.enveloppe,
				item.liaison.plancher_id,
			);
			return formulas.calcule_kpt({
				kpt_saisi,
				type_liaison,
				isolation_mur: isolation_mur(ctx, mur),
				type_isolation_mur: type_isolation_mur(mur),
				isolation_plancher: isolation_plancher_bas(ctx, plancher),
				type_isolation_plancher: type_isolation_plancher_bas(plancher),
			});
		}
		case enums.plancher_haut_mur: {
			const plancher = models.enveloppe.get_plancher_haut(
				ctx.diagnostic.enveloppe,
				item.liaison.plancher_id,
			);

			return formulas.calcule_kpt({
				kpt_saisi,
				type_liaison,
				isolation_mur: isolation_mur(ctx, mur),
				type_isolation_mur: type_isolation_mur(mur),
				isolation_plancher: isolation_plancher_haut(ctx, plancher),
				type_isolation_plancher: type_isolation_plancher_haut(plancher),
			});
		}
		case enums.baie_mur: {
			const baie = models.enveloppe.get_baie(
				ctx.diagnostic.enveloppe,
				item.liaison.ouverture_id,
			);
			return formulas.calcule_kpt({
				kpt_saisi,
				type_liaison,
				isolation_mur: isolation_mur(ctx, mur),
				type_isolation_mur: type_isolation_mur(mur),
				type_pose_menuiserie: baie.position.type_pose,
				presence_retour_isolation: presence_retour_isolation(baie),
				largeur_dormant: largeur_dormant(baie),
			});
		}
		case enums.porte_mur: {
			const porte = models.enveloppe.get_porte(
				ctx.diagnostic.enveloppe,
				item.liaison.ouverture_id,
			);
			return formulas.calcule_kpt({
				kpt_saisi,
				type_liaison,
				isolation_mur: isolation_mur(ctx, mur),
				type_isolation_mur: type_isolation_mur(mur),
				type_pose_menuiserie: porte.position.type_pose,
				presence_retour_isolation: presence_retour_isolation(porte),
				largeur_dormant: largeur_dormant(porte),
			});
		}
		case enums.plancher_intermediaire_mur:
		case enums.refend_mur: {
			return formulas.calcule_kpt({
				kpt_saisi,
				type_liaison,
				isolation_mur: isolation_mur(ctx, mur),
				type_isolation_mur: type_isolation_mur(mur),
			});
		}
	}
}

export function isolation_mur(
	ctx: Context,
	entity: models.enveloppe.mur.Mur,
): ReturnType<typeof formulas.set_isolation_mur> {
	return formulas.set_isolation_mur({
		isolation: entity.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

export function isolation_plancher_haut(
	ctx: Context,
	entity: models.enveloppe.plancherHaut.PlancherHaut,
): ReturnType<typeof formulas.set_isolation_plancher_haut> {
	return formulas.set_isolation_plancher_haut({
		isolation: entity.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

export function isolation_plancher_bas(
	ctx: Context,
	entity: models.enveloppe.plancherBas.PlancherBas,
): ReturnType<typeof formulas.set_isolation_plancher_bas> {
	return formulas.set_isolation_plancher_bas({
		mitoyennete: entity.position.mitoyennete,
		isolation: entity.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

export function type_isolation_mur(
	entity: models.enveloppe.mur.Mur,
): ReturnType<typeof formulas.set_type_isolation_mur> {
	return formulas.set_type_isolation_mur({
		type_isolation: entity.isolation.type,
	});
}

export function type_isolation_plancher_haut(
	entity: models.enveloppe.plancherHaut.PlancherHaut,
): ReturnType<typeof formulas.set_type_isolation_plancher_haut> {
	return formulas.set_type_isolation_plancher_haut({
		type_isolation: entity.isolation.type,
	});
}

export function type_isolation_plancher_bas(
	entity: models.enveloppe.plancherBas.PlancherBas,
): ReturnType<typeof formulas.set_type_isolation_plancher_bas> {
	return formulas.set_type_isolation_plancher_bas({
		type_isolation: entity.isolation.type,
	});
}

export function largeur_dormant(
	entity: models.enveloppe.baie.Baie | models.enveloppe.porte.Porte,
): ReturnType<typeof formulas.set_largeur_dormant> {
	return formulas.set_largeur_dormant({
		largeur_dormant: entity.menuiserie?.largeur_dormant ?? null,
	});
}

export function presence_retour_isolation(
	entity: models.enveloppe.baie.Baie | models.enveloppe.porte.Porte,
): ReturnType<typeof formulas.set_presence_retour_isolation> {
	return formulas.set_presence_retour_isolation({
		presence_retour_isolation:
			entity.menuiserie?.presence_retour_isolation ?? null,
	});
}

export function applique(ctx: Context, item: PontThermique): models.enveloppe.pontThermique.PontThermiqueWithData {
	return {
		...item,
		data: {
			kpt: ctx.resolve(ID, RULES.kpt, item),
			pt: ctx.resolve(ID, RULES.pt, item),
		},
	};
}
