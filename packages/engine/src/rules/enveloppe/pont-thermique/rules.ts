import * as models from "@open-dpe-logement/models";
import type { Context } from "../../../core/context.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

export const REGISTRY = {
	[NAMESPACE]: {
		[RULES.pt]: pt,
		[RULES.kpt]: kpt,
	},
};

type PontThermique = models.enveloppe.pontThermique.PontThermique;

export function pt(
	ctx: Context,
	item: PontThermique,
): ReturnType<typeof formulas.calcule_pt> {
	return ctx.register(NAMESPACE, RULES.pt, item, () =>
		formulas.calcule_pt({
			type_liaison: item.liaison.type,
			kpt: kpt(ctx, item),
			l: item.longueur,
			pont_thermique_partiel: item.liaison.pont_thermique_partiel ?? false,
		}),
	);
}

export function kpt(
	ctx: Context,
	item: PontThermique,
): ReturnType<typeof formulas.calcule_kpt> {
	return ctx.register(NAMESPACE, RULES.kpt, item, () => {
		const enums = models.enveloppe.pontThermique.TYPES_LIAISON;
		const mur = models.enveloppe.findMur(
			item.liaison.mur_id,
			ctx.diagnostic.enveloppe,
		);

		const props = {
			kpt_saisi: item.kpt,
			type_liaison: item.liaison.type,
			isolation_mur: isolation_mur(ctx, mur),
			type_isolation_mur: type_isolation_mur(mur),
			isolation_plancher: null,
			type_isolation_plancher: null,
			type_pose_menuiserie: null,
			presence_retour_isolation: null,
			largeur_dormant: null,
		};

		switch (item.liaison.type) {
			case enums.plancher_bas_mur: {
				const plancher = models.enveloppe.findPlancherBas(
					item.liaison.plancher_id,
					ctx.diagnostic.enveloppe,
				);
				return formulas.calcule_kpt({
					...props,
					isolation_plancher: isolation_plancher_bas(ctx, plancher),
					type_isolation_plancher: type_isolation_plancher_bas(plancher),
				});
			}
			case enums.plancher_haut_mur: {
				const plancher = models.enveloppe.findPlancherHaut(
					item.liaison.plancher_id,
					ctx.diagnostic.enveloppe,
				);
				return formulas.calcule_kpt({
					...props,
					isolation_plancher: isolation_plancher_haut(ctx, plancher),
					type_isolation_plancher: type_isolation_plancher_haut(plancher),
				});
			}

			case enums.baie_mur: {
				const baie = models.enveloppe.findBaie(
					item.liaison.ouverture_id,
					ctx.diagnostic.enveloppe,
				);
				return formulas.calcule_kpt({
					...props,
					type_pose_menuiserie: baie.position.type_pose,
					presence_retour_isolation: presence_retour_isolation(baie),
					largeur_dormant: largeur_dormant(baie),
				});
			}

			case enums.porte_mur: {
				const porte = models.enveloppe.findPorte(
					item.liaison.ouverture_id,
					ctx.diagnostic.enveloppe,
				);
				return formulas.calcule_kpt({
					...props,
					type_pose_menuiserie: porte.position.type_pose,
					presence_retour_isolation: presence_retour_isolation(porte),
					largeur_dormant: largeur_dormant(porte),
				});
			}

			case enums.plancher_intermediaire_mur:
			case enums.refend_mur: {
				return formulas.calcule_kpt(props);
			}
		}
	});
}

function isolation_mur(
	ctx: Context,
	entity: models.enveloppe.mur.Mur,
): ReturnType<typeof formulas.set_isolation_mur> {
	return formulas.set_isolation_mur({
		isolation: entity.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

function isolation_plancher_haut(
	ctx: Context,
	entity: models.enveloppe.plancherHaut.PlancherHaut,
): ReturnType<typeof formulas.set_isolation_plancher_haut> {
	return formulas.set_isolation_plancher_haut({
		isolation: entity.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

function isolation_plancher_bas(
	ctx: Context,
	entity: models.enveloppe.plancherBas.PlancherBas,
): ReturnType<typeof formulas.set_isolation_plancher_bas> {
	return formulas.set_isolation_plancher_bas({
		mitoyennete: entity.position.mitoyennete,
		isolation: entity.isolation.etat,
		annee_construction: ctx.diagnostic.batiment.annee_construction,
	});
}

function type_isolation_mur(
	entity: models.enveloppe.mur.Mur,
): ReturnType<typeof formulas.set_type_isolation_mur> {
	return formulas.set_type_isolation_mur({
		type_isolation: entity.isolation.type,
	});
}

function type_isolation_plancher_haut(
	entity: models.enveloppe.plancherHaut.PlancherHaut,
): ReturnType<typeof formulas.set_type_isolation_plancher_haut> {
	return formulas.set_type_isolation_plancher_haut({
		type_isolation: entity.isolation.type,
	});
}

function type_isolation_plancher_bas(
	entity: models.enveloppe.plancherBas.PlancherBas,
): ReturnType<typeof formulas.set_type_isolation_plancher_bas> {
	return formulas.set_type_isolation_plancher_bas({
		type_isolation: entity.isolation.type,
	});
}

function largeur_dormant(
	entity: models.enveloppe.baie.Baie | models.enveloppe.porte.Porte,
): ReturnType<typeof formulas.set_largeur_dormant> {
	return formulas.set_largeur_dormant({
		largeur_dormant: entity.menuiserie?.largeur_dormant ?? null,
	});
}

function presence_retour_isolation(
	entity: models.enveloppe.baie.Baie | models.enveloppe.porte.Porte,
): ReturnType<typeof formulas.set_presence_retour_isolation> {
	return formulas.set_presence_retour_isolation({
		presence_retour_isolation:
			entity.menuiserie?.presence_retour_isolation ?? null,
	});
}
