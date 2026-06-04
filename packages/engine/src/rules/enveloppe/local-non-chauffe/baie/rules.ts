import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

type Baie = models.enveloppe.localNonChauffe.Baie;

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.locaux_non_chauffes.forEach((lnc) => {
		lnc.baies.forEach((item) => {
			ctx.register(ID, RULES.aue, item, () => aue(item));
			ctx.register(ID, RULES.aiu, item, () => aiu(item));
			ctx.register(ID, RULES.sst, item, () => sst(ctx, item));
			ctx.register(ID, RULES.t, item, () => t(item));
		});
	});
}

export function aue(item: Baie): ReturnType<typeof formulas.calcule_aue> {
	return formulas.calcule_aue({
		mitoyennete: item.position.mitoyennete,
		surface: item.position.surface,
	});
}

export function aiu(item: Baie): ReturnType<typeof formulas.calcule_aiu> {
	return formulas.calcule_aiu({
		mitoyennete: item.position.mitoyennete,
		surface: item.position.surface,
	});
}

export function sst(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sst> {
	const t = ctx.resolve(ID, RULES.t, item);
	return formulas.calcule_sst({
		surface: item.position.surface,
		t: ctx.resolve(ID, RULES.t, item),
		c1: formulas.calcule_c1({
			zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
			orientation: item.position.orientation,
			inclinaison: item.position.inclinaison,
		}),
	});
}

export function t(item: Baie): ReturnType<typeof formulas.calcule_t> {
	return formulas.calcule_t({
		type_vitrage: formulas.set_type_vitrage({
			type_vitrage: item.type_vitrage,
		}),
		materiau: formulas.set_materiau({
			materiau: item.materiau_menuiserie,
		}),
		presence_rupteur_pont_thermique:
			formulas.set_presence_rupteur_pont_thermique({
				presence_rupteur_pont_thermique: item.presence_rupteur_pont_thermique,
			}),
	});
}

export function isolation(
	item: Baie,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({ type_vitrage: type_vitrage(item) });
}

export function type_vitrage(
	item: Baie,
): ReturnType<typeof formulas.set_type_vitrage> {
	return formulas.set_type_vitrage({ type_vitrage: item.type_vitrage });
}

export function materiau(item: Baie): ReturnType<typeof formulas.set_materiau> {
	return formulas.set_materiau({ materiau: item.materiau_menuiserie });
}

export function presence_rupteur_pont_thermique(
	item: Baie,
): ReturnType<typeof formulas.set_presence_rupteur_pont_thermique> {
	return formulas.set_presence_rupteur_pont_thermique({
		presence_rupteur_pont_thermique: item.presence_rupteur_pont_thermique,
	});
}
