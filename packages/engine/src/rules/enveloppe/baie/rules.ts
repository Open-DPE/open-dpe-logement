import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as constants from "#rules/constants.js";
import * as masque from "#rules/enveloppe/masque/rules.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
import * as formulas from "./formulas.js";
import { NAMESPACE, RULES } from "./constants.js";

type Baie = models.enveloppe.baie.Baie;

export function calcule(
	ctx: Context,
	item: Baie,
): models.enveloppe.baie.BaieData {
	return {
		u: u(ctx, item),
		b: b(ctx, item),
		sdep: sdep(ctx, item),
		dp: dp(ctx, item),
		deltar: deltar(ctx, item),
		uw: uw(ctx, item),
		ug: ug(ctx, item),
		sw: sw(ctx, item),
		fe: fe(ctx, item),
		sse: models.common.reduceParMois(sse(ctx, item)),
	};
}

export function aiu(ctx: Context, item: Baie): ReturnType<typeof paroi.aiu> {
	return ctx.register(NAMESPACE, RULES.aiu, item, () => paroi.aiu(item));
}

export function isolation_aiu(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return ctx.register(NAMESPACE, RULES.isolation_aiu, item, () =>
		formulas.calcule_isolation_aiu({
			type_vitrage: type_vitrage(item),
		}),
	);
}
export function sdep(ctx: Context, item: Baie): ReturnType<typeof paroi.sdep> {
	return ctx.register(NAMESPACE, RULES.sdep, item, () => paroi.sdep(item));
}

export function b(ctx: Context, item: Baie): ReturnType<typeof paroi.b> {
	return ctx.register(NAMESPACE, RULES.b, item, () =>
		paroi.b(ctx, item, isolation(item)),
	);
}

export function dp(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_dp> {
	return ctx.register(NAMESPACE, RULES.dp, item, () =>
		formulas.calcule_dp({
			sdep: sdep(ctx, item),
			b: b(ctx, item),
			u: u(ctx, item),
			double_fenetre: item.position.baie_id ? true : false,
		}),
	);
}

export function u(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_u> {
	return ctx.register(NAMESPACE, RULES.u, item, () =>
		formulas.calcule_u({
			ujn_saisi: item.ujn,
			uw: uw(ctx, item),
			deltar: deltar(ctx, item),
		}),
	);
}

export function deltar(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_deltar> {
	return ctx.register(NAMESPACE, RULES.deltar, item, () => {
		const types_fermetures = [item.type_fermeture];
		if (item.position.baie_id) {
			const baie = models.enveloppe.getBaie(
				ctx.diagnostic.enveloppe,
				item.position.baie_id,
			);
			types_fermetures.push(baie.type_fermeture);
		}
		return formulas.calcule_deltar({
			types_fermetures: types_fermetures,
		});
	});
}

export function uw(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_uw> {
	return ctx.register(NAMESPACE, RULES.uw, item, () =>
		formulas.calcule_uw({
			uw1: uw1(ctx, item),
			uw2: uw2(ctx, item),
		}),
	);
}

export function uw1(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_uw0> {
	return ctx.register(NAMESPACE, RULES.uw1, item, () =>
		formulas.calcule_uw0({
			uw_saisi: item.uw,
			type_baie: item.type,
			presence_soubassement: item.menuiserie?.presence_soubassement ?? null,
			materiau: materiau(item),
			presence_rupteur_pont_thermique: presence_rupteur_pont_thermique(item),
			ug: ug(ctx, item),
		}),
	);
}

export function uw2(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_uw0> | null {
	return ctx.register(NAMESPACE, RULES.uw2, item, () =>
		item.position.baie_id
			? uw1(
					ctx,
					models.enveloppe.getBaie(
						ctx.diagnostic.enveloppe,
						item.position.baie_id,
					),
				)
			: null,
	);
}

export function ug(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_ug> {
	return ctx.register(NAMESPACE, RULES.ug, item, () =>
		formulas.calcule_ug({
			ug_saisi: item.ug,
			type_baie: item.type,
			type_vitrage: type_vitrage(item),
			type_survitrage: type_survitrage(item),
			nature_lame_air: nature_lame_air(item),
			epaisseur_lame_air: epaisseur_lame_air(item),
			inclinaison_vitrage: item.position.inclinaison,
		}),
	);
}
export function sse(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sse> {
	return ctx.register(NAMESPACE, RULES.sse, item, () => {
		const lnc = item.position.local_non_chauffe_id
			? models.enveloppe.getLocalNonChauffe(
					ctx.diagnostic.enveloppe,
					item.position.local_non_chauffe_id,
				)
			: null;

		return formulas.calcule_sse({
			surface: item.position.surface,
			mitoyennete: item.position.mitoyennete,
			sw: sw(ctx, item),
			fe: fe(ctx, item),
			c1: c1(ctx, item),
			double_fenetre: item.position.baie_id ? true : false,
			t: lnc
				? ctx.resolve(
						constants.enveloppe.localNonChauffe.NAMESPACE,
						constants.enveloppe.localNonChauffe.RULES.t,
						lnc,
					)
				: null,
		});
	});
}

export function sw(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sw> {
	return ctx.register(NAMESPACE, RULES.sw, item, () =>
		formulas.calcule_sw({
			sw1: sw1(ctx, item),
			sw2: sw2(ctx, item),
		}),
	);
}

export function sw1(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sw0> {
	return ctx.register(NAMESPACE, RULES.sw1, item, () =>
		formulas.calcule_sw0({
			sw_saisi: item.sw,
			type_baie: item.type,
			presence_soubassement: item.menuiserie?.presence_soubassement ?? false,
			materiau: materiau(item),
			type_vitrage: type_vitrage(item),
			type_pose: item.position.type_pose,
			type_survitrage: type_survitrage(item),
		}),
	);
}

export function sw2(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sw0> | null {
	return ctx.register(NAMESPACE, RULES.sw2, item, () =>
		item.position.baie_id
			? sw1(
					ctx,
					models.enveloppe.getBaie(
						ctx.diagnostic.enveloppe,
						item.position.baie_id,
					),
				)
			: null,
	);
}

export function fe(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_fe> {
	return ctx.register(NAMESPACE, RULES.fe, item, () =>
		formulas.calcule_fe({
			fe1: fe1(ctx, item),
			fe2: fe2(ctx, item),
		}),
	);
}

export function fe1(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_fe1> {
	return ctx.register(NAMESPACE, RULES.fe1, item, () =>
		formulas.calcule_fe1({
			fe1: item.position.masques
				.map((m) => masque.fe1(item.position.orientation, m))
				.filter((value) => value !== null),
		}),
	);
}

export function fe2(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_fe1> {
	return ctx.register(NAMESPACE, RULES.fe2, item, () =>
		formulas.calcule_fe2({
			fe2: item.position.masques
				.map((m) => masque.fe2(item.position.orientation, m))
				.filter((value) => value !== null),
			omb: omb(ctx, item),
		}),
	);
}

export function omb(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_omb> {
	return ctx.register(NAMESPACE, RULES.omb, item, () =>
		formulas.calcule_omb({
			omb: item.position.masques
				.map((m) => masque.omb(item.position.orientation, m))
				.filter((value) => value !== null),
		}),
	);
}

export function c1(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_c1> {
	return ctx.register(NAMESPACE, RULES.c1, item, () =>
		formulas.calcule_c1({
			zone_climatique: ctx.resolve(
				constants.climat.NAMESPACE,
				constants.climat.RULES.zone_climatique,
			),
			orientation: item.position.orientation,
			inclinaison: item.position.inclinaison,
		}),
	);
}

export function isolation(
	item: Baie,
): ReturnType<typeof formulas.set_isolation> {
	return formulas.set_isolation({
		type_vitrage: type_vitrage(item),
	});
}

export function type_vitrage(
	item: Baie,
): ReturnType<typeof formulas.set_type_vitrage> {
	return formulas.set_type_vitrage({
		type_vitrage: item.vitrage.type,
	});
}

export function type_survitrage(
	item: Baie,
): ReturnType<typeof formulas.set_type_survitrage> | null {
	return item.survitrage
		? formulas.set_type_survitrage({
				type_survitrage: item.survitrage.type,
			})
		: null;
}

export function materiau(item: Baie): ReturnType<typeof formulas.set_materiau> {
	return formulas.set_materiau({
		materiau: item.menuiserie?.materiau ?? null,
	});
}

export function nature_lame_air(
	item: Baie,
): ReturnType<typeof formulas.set_nature_lame_air> | null {
	return item.vitrage
		? formulas.set_nature_lame_air({
				nature_lame_air: item.vitrage?.nature_lame ?? null,
			})
		: null;
}

export function epaisseur_lame_air(
	item: Baie,
): ReturnType<typeof formulas.set_epaisseur_lame_air> | null {
	return item.vitrage
		? formulas.set_epaisseur_lame_air({
				epaisseur_lame_air: item.vitrage?.epaisseur_lame ?? null,
			})
		: null;
}

export function presence_rupteur_pont_thermique(
	item: Baie,
): ReturnType<typeof formulas.set_presence_rupteur_pont_thermique> {
	return formulas.set_presence_rupteur_pont_thermique({
		presence_rupteur_pont_thermique:
			item.menuiserie?.presence_rupteur_pont_thermique ?? null,
	});
}
