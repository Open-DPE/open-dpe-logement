import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as localNonChauffe from "#rules/enveloppe/local-non-chauffe/registry.js";
import * as baie from "#rules/enveloppe/baie/registry.js";
import * as mur from "#rules/enveloppe/mur/registry.js";
import * as plancherBas from "#rules/enveloppe/plancher-bas/registry.js";
import * as plancherHaut from "#rules/enveloppe/plancher-haut/registry.js";
import * as porte from "#rules/enveloppe/porte/registry.js";
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
		const lnc = models.enveloppe.get_local_non_chauffe(
			ctx.diagnostic.enveloppe,
			item.position.local_non_chauffe_id,
		);
		const type_local_non_chauffe = lnc.type;

		if (models.enveloppe.localNonChauffe.isEspaceTamponSolarise(lnc)) {
			return formulas.calcule_b_ets({
				type_local_non_chauffe,
				zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
				orientations_ets: ctx.resolve(
					localNonChauffe.ID,
					localNonChauffe.RULES.orientations,
					lnc,
				),
				isolation_paroi: isolation,
			});
		}
		return formulas.calcule_b_lnc({
			blnc: ctx.resolve(localNonChauffe.ID, localNonChauffe.RULES.b, lnc),
		});
	}
}

export function dp(
	ctx: Context,
	item: Paroi,
	id:
		| typeof baie.ID
		| typeof mur.ID
		| typeof plancherBas.ID
		| typeof plancherHaut.ID
		| typeof porte.ID,
): ReturnType<typeof formulas.calcule_dp> {
	const sdep = ctx.resolve(id, "sdep", item);
	const u = ctx.resolve(id, "u", item);
	const b = ctx.resolve(id, "b", item);
	return formulas.calcule_dp({ sdep, b, u });
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
