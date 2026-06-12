import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#rules/constants.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Baie = models.enveloppe.localNonChauffe.Baie;

export function aue(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_aue> {
	return ctx.register(NAMESPACE, RULES.aue, item, () =>
		formulas.calcule_aue({
			mitoyennete: item.position.mitoyennete,
			surface: item.position.surface,
		}),
	);
}

export function aiu(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () =>
		formulas.calcule_aiu({
			mitoyennete: item.position.mitoyennete,
			surface: item.position.surface,
		}),
	);
}

export function sst(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sst> {
	return ctx.register(NAMESPACE, RULES.sst, item, () =>
		formulas.calcule_sst({
			surface: item.position.surface,
			t: t(ctx, item),
			c1: formulas.calcule_c1({
				zone_climatique: ctx.resolve(
					constants.climat.NAMESPACE,
					constants.climat.RULES.zone_climatique,
				),
				orientation: item.position.orientation,
				inclinaison: item.position.inclinaison,
			}),
		}),
	);
}

export function t(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_t> {
	return ctx.register(NAMESPACE, RULES.t, item, () =>
		formulas.calcule_t({
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
		}),
	);
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
