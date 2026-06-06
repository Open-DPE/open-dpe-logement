import * as models from "@open-dpe-logement/models";
import type { Context } from "#core/context.js";
import * as climat from "#rules/climat/registry.js";
import * as localNonChauffe from "#rules/enveloppe/local-non-chauffe/registry.js";
import * as paroi from "#rules/enveloppe/paroi/rules.js";
import * as masque from "#rules/enveloppe/masque/rules.js";
import * as formulas from "./formulas.js";
import { ID, RULES } from "./registry.js";

export function register(ctx: Context): void {
	ctx.diagnostic.enveloppe.baies.forEach((item) => {
		ctx.register(ID, RULES.aiu, item, () => aiu(item));
		ctx.register(ID, RULES.isolation_aiu, item, () => isolation_aiu(item));
		ctx.register(ID, RULES.sdep, item, () => sdep(item));
		ctx.register(ID, RULES.b, item, () => b(ctx, item));
		ctx.register(ID, RULES.dp, item, () => dp(ctx, item));
		ctx.register(ID, RULES.u, item, () => u(ctx, item));
		ctx.register(ID, RULES.deltar, item, () => deltar(ctx, item));
		ctx.register(ID, RULES.uw, item, () => uw(ctx, item));
		ctx.register(ID, RULES.uw1, item, () => uw1(ctx, item));
		ctx.register(ID, RULES.uw2, item, () => uw2(ctx, item));
		ctx.register(ID, RULES.ug, item, () => ug(item));
		ctx.register(ID, RULES.sse, item, () => sse(ctx, item));
		ctx.register(ID, RULES.sw, item, () => sw(ctx, item));
		ctx.register(ID, RULES.sw1, item, () => sw1(item));
		ctx.register(ID, RULES.sw2, item, () => sw2(ctx, item));
		ctx.register(ID, RULES.fe, item, () => fe(ctx, item));
		ctx.register(ID, RULES.fe1, item, () => fe1(item));
		ctx.register(ID, RULES.fe2, item, () => fe2(ctx, item));
		ctx.register(ID, RULES.omb, item, () => omb(item));
		ctx.register(ID, RULES.c1, item, () => c1(ctx, item));
	});
}

type Baie = models.enveloppe.baie.Baie;

export function aiu(item: Baie): ReturnType<typeof formulas.calcule_aiu> {
	return paroi.aiu(item);
}

export function isolation_aiu(
	item: Baie,
): ReturnType<typeof formulas.calcule_isolation_aiu> {
	return formulas.calcule_isolation_aiu({
		type_vitrage: type_vitrage(item),
	});
}

export function sdep(item: Baie): ReturnType<typeof formulas.calcule_sdep> {
	return paroi.sdep(item);
}

export function b(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_b> {
	return paroi.b(ctx, item, isolation(item));
}

export function dp(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_dp> {
	return formulas.calcule_dp({
		sdep: ctx.resolve(ID, RULES.sdep, item),
		b: ctx.resolve(ID, RULES.b, item),
		u: ctx.resolve(ID, RULES.u, item),
		double_fenetre: item.position.baie_id ? true : false,
	});
}

export function u(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_u> {
	return formulas.calcule_u({
		ujn_saisi: item.ujn,
		uw: ctx.resolve(ID, RULES.uw, item),
		deltar: ctx.resolve(ID, RULES.deltar, item),
	});
}

export function deltar(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_deltar> {
	const types_fermetures = [item.type_fermeture];
	if (item.position.baie_id) {
		const baie = models.enveloppe.get_baie(
			ctx.diagnostic.enveloppe,
			item.position.baie_id,
		);
		types_fermetures.push(baie.type_fermeture);
	}
	return formulas.calcule_deltar({
		types_fermetures: types_fermetures,
	});
}

export function uw(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_uw> {
	return formulas.calcule_uw({
		uw1: ctx.resolve(ID, RULES.uw1, item),
		uw2: ctx.resolve(ID, RULES.uw2, item),
	});
}

export function uw1(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_uw0> {
	return formulas.calcule_uw0({
		uw_saisi: item.uw,
		type_baie: item.type,
		presence_soubassement: item.menuiserie?.presence_soubassement ?? null,
		materiau: materiau(item),
		presence_rupteur_pont_thermique: presence_rupteur_pont_thermique(item),
		ug: ctx.resolve(ID, RULES.ug, item),
	});
}

export function uw2(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_uw0> | null {
	return item.position.baie_id
		? ctx.resolve(ID, RULES.uw1, { id: item.position.baie_id })
			? ctx.resolve(ID, RULES.uw1, { id: item.position.baie_id })
			: null
		: null;
}

export function ug(item: Baie): ReturnType<typeof formulas.calcule_ug> {
	return formulas.calcule_ug({
		ug_saisi: item.ug,
		type_baie: item.type,
		type_vitrage: type_vitrage(item),
		type_survitrage: type_survitrage(item),
		nature_lame_air: nature_lame_air(item),
		epaisseur_lame_air: epaisseur_lame_air(item),
		inclinaison_vitrage: item.position.inclinaison,
	});
}
export function sse(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sse> {
	const lnc = item.position.local_non_chauffe_id
		? models.enveloppe.get_local_non_chauffe(
				ctx.diagnostic.enveloppe,
				item.position.local_non_chauffe_id,
			)
		: null;

	return formulas.calcule_sse({
		surface: item.position.surface,
		mitoyennete: item.position.mitoyennete,
		sw: ctx.resolve(ID, RULES.sw, item),
		fe: ctx.resolve(ID, RULES.fe, item),
		c1: ctx.resolve(ID, RULES.c1, item),
		double_fenetre: item.position.baie_id ? true : false,
		t: lnc
			? ctx.resolve(localNonChauffe.ID, localNonChauffe.RULES.t, lnc)
			: null,
	});
}

export function sw(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sw> {
	return formulas.calcule_sw({
		sw1: ctx.resolve(ID, RULES.sw1, item),
		sw2: ctx.resolve(ID, RULES.sw2, item),
	});
}

export function sw1(item: Baie): ReturnType<typeof formulas.calcule_sw0> {
	return formulas.calcule_sw0({
		sw_saisi: item.sw,
		type_baie: item.type,
		presence_soubassement: item.menuiserie?.presence_soubassement ?? false,
		materiau: materiau(item),
		type_vitrage: type_vitrage(item),
		type_pose: item.position.type_pose,
		type_survitrage: type_survitrage(item),
	});
}

export function sw2(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_sw0> | null {
	return item.position.baie_id
		? ctx.resolve(ID, RULES.sw1, { id: item.position.baie_id })
		: null;
}

export function fe(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_fe> {
	return formulas.calcule_fe({
		fe1: ctx.resolve(ID, RULES.fe1, item),
		fe2: ctx.resolve(ID, RULES.fe2, item),
	});
}

export function fe1(item: Baie): ReturnType<typeof formulas.calcule_fe1> {
	return formulas.calcule_fe1({
		fe1: item.position.masques.map((m) => masque.fe1(item.position.orientation, m)),
	});
}

export function fe2(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_fe1> {
	return formulas.calcule_fe2({
		fe2: item.position.masques.map((m) => masque.fe2(item.position.orientation, m)),
		omb: ctx.resolve(ID, RULES.omb, item),
	});
}

export function omb(item: Baie): ReturnType<typeof formulas.calcule_omb> {
	return formulas.calcule_omb({
		omb: item.position.masques.map((m) => masque.omb(item.position.orientation, m)),
	});
}

export function c1(
	ctx: Context,
	item: Baie,
): ReturnType<typeof formulas.calcule_c1> {
	return formulas.calcule_c1({
		zone_climatique: ctx.resolve(climat.ID, climat.RULES.zone_climatique),
		orientation: item.position.orientation,
		inclinaison: item.position.inclinaison,
	});
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

export function applique(ctx: Context, item: Baie): models.enveloppe.baie.BaieWithData {
	return {
		...item,
		data: {
			u: ctx.resolve(ID, RULES.u, item),
			b: ctx.resolve(ID, RULES.b, item),
			sdep: ctx.resolve(ID, RULES.sdep, item),
			dp: ctx.resolve(ID, RULES.dp, item),
			deltar: ctx.resolve(ID, RULES.deltar, item),
			uw: ctx.resolve(ID, RULES.uw, item),
			ug: ctx.resolve(ID, RULES.ug, item),
			sw: ctx.resolve(ID, RULES.sw, item),
			fe: ctx.resolve(ID, RULES.fe, item),
			sse: Object.values(ctx.resolve(ID, RULES.sse, item)).reduce((s: number, n: number) => s + n, 0),
			c1: Object.values(ctx.resolve(ID, RULES.c1, item)).reduce((s: number, n: number) => s + n, 0),
		},
	};
}
