import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#/rules/constants.js";
import * as formulas from "./formulas.js";

type Paroi = ParoiOpaque | Ouverture;

type ParoiOpaque =
	| models.enveloppe.mur.Mur
	| models.enveloppe.plancherBas.PlancherBas
	| models.enveloppe.plancherHaut.PlancherHaut;

type Ouverture = models.enveloppe.porte.Porte | models.enveloppe.baie.Baie;

export function aiu(item: Paroi): ReturnType<typeof formulas.calcule_aiu> {
	return formulas.calcule_aiu({
		surface: item.position.surface,
		mitoyennete: item.position.mitoyennete,
	});
}

export function sdep(item: Paroi): ReturnType<typeof formulas.calcule_sdep> {
	return formulas.calcule_sdep({
		surface: item.position.surface,
		mitoyennete: item.position.mitoyennete,
	});
}

export function b(ctx: Context, item: Paroi, isolation: boolean): formulas.b {
	if (models.enveloppe.common.isPositionParoiLocalNonChauffe(item.position)) {
		const lnc = models.enveloppe.getLocalNonChauffe(
			ctx.diagnostic.enveloppe,
			item.position.local_non_chauffe_id,
		);
		const type_local_non_chauffe = lnc.type;

		if (models.enveloppe.localNonChauffe.isEspaceTamponSolarise(lnc)) {
			return formulas.calcule_b_ets({
				type_local_non_chauffe,
				zone_climatique: ctx.resolve(
					constants.climat.NAMESPACE,
					constants.climat.RULES.zone_climatique,
				),
				orientations_ets: ctx.resolve(
					constants.enveloppe.localNonChauffe.NAMESPACE,
					constants.enveloppe.localNonChauffe.RULES.orientations,
					lnc,
				),
				isolation_paroi: isolation,
			});
		}
		return formulas.calcule_b_lnc({
			blnc: ctx.resolve(
				constants.enveloppe.localNonChauffe.NAMESPACE,
				constants.enveloppe.localNonChauffe.RULES.b,
				lnc,
			),
		});
	}
	return formulas.calcule_b_autres({ mitoyennete: item.position.mitoyennete });
}

export function annee_construction(
	ctx: Context,
	item: ParoiOpaque,
): ReturnType<typeof formulas.set_annee_construction> {
	return formulas.set_annee_construction({
		annee_construction: item.annee_construction,
		annee_renovation: item.annee_renovation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}

export function annee_installation(
	ctx: Context,
	item: Ouverture,
): ReturnType<typeof formulas.set_annee_installation> {
	return formulas.set_annee_installation({
		annee_installation: item.annee_installation,
		annee_construction_batiment: ctx.diagnostic.batiment.annee_construction,
	});
}
