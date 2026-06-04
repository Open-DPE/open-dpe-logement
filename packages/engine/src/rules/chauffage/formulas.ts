import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as enveloppe from "#rules/enveloppe/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as generateur from "#rules/chauffage/generateur/formulas.js";
import * as installation from "#rules/chauffage/installation/formulas.js";
import { createParMois, mergeParMois } from "#utils/helpers.js";

/**
 * @doctrine chauffage.cch
 * @return Consommations de chauffage en kWh/an
 */
export function calcule_cch(props: {
	cch: ReturnType<typeof generateur.calcule_cch>[];
}): number {
	return props.cch.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine chauffage.cch_elec
 * @return Consommation d'électricité de chauffage en kWh/an
 */
export function calcule_cch_elec(props: {
	cch_elec: ReturnType<typeof generateur.calcule_cch_elec>[];
}): number {
	return props.cch_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine chauffage.caux
 * @return Consommations des auxiliaires de chauffage en kWh/an
 */
export function calcule_caux(props: {
	caux_gen: ReturnType<typeof calcule_caux_gen>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
}): number {
	return props.caux_gen + props.caux_dist;
}

/**
 * @doctrine chauffage.caux_gen
 * @return Consommations des auxiliaires de génération en kWh/an
 */
export function calcule_caux_gen(props: {
	caux_gen: ReturnType<typeof generateur.calcule_caux>[];
}): number {
	return props.caux_gen.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine chauffage.caux_dist
 * @return Consommations des auxiliaires de distribution en kWh/an
 */
export function calcule_caux_dist(props: {
	caux_dist: ReturnType<typeof installation.calcule_caux_dist>[];
}): number {
	return props.caux_dist.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine chauffage.bch
 * @returns Besoins de chauffage en kWh/mois
 */
export function calcule_bch(props: {
	bch_hp: ReturnType<typeof calcule_bch_hp>;
	qgw_rec: ReturnType<typeof calcule_qgw_rec>;
	qdw_rec: ReturnType<typeof calcule_qdw_rec>;
	qgen_rec: ReturnType<typeof calcule_qgen_rec>;
}): models.common.ParMois<number> {
	return createParMois((mois) => {
		const bch_hp = props.bch_hp[mois];
		const qgw_rec = props.qgw_rec[mois];
		const qdw_rec = props.qdw_rec[mois];
		const qgen_rec = props.qgen_rec[mois];
		return bch_hp - (qgw_rec + qdw_rec + qgen_rec) / 1000;
	});
}

/**
 * @doctrine chauffage.bch_hp
 * @returns Besoins de chauffage hors pertes récupérées en kWh/mois
 */
export function calcule_bch_hp(props: {
	bv: ReturnType<typeof calcule_bv>;
	dh: ReturnType<typeof calcule_dh>;
}): models.common.ParMois<number> {
	return createParMois((mois) => {
		const bv = props.bv[mois];
		const dh = props.dh[mois];
		return (bv * dh) / 1000;
	});
}

/**
 * @doctrine chauffage.bv
 * @returns Besoins de chauffage en kWh/mois
 */
export function calcule_bv(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	f: ReturnType<typeof calcule_f>;
}): models.common.ParMois<number> {
	const { gv } = props;
	return createParMois((mois) => {
		const f = props.f[mois];
		return (gv * (1 - f)) / 1000;
	});
}

/**
 * @doctrine chauffage.pch
 * @return Puissance conventionnelle de chauffage en kW
 */
export function calcule_pch(props: {
	ratio_proratisation: ReturnType<typeof batiment.calcule_ratio_proratisation>;
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	tbase: ReturnType<typeof climat.calcule_tbase>;
}): number {
	const { ratio_proratisation, gv, tbase } = props;
	return (1.2 * gv * ratio_proratisation * tbase) / (1000 * 0.95 ** 3);
}

/**
 * @doctrine chauffage.f
 * @returns Fraction des besoins de chauffage couverts par les apports gratuits
 */
export function calcule_f(props: {
	inertie: ReturnType<typeof enveloppe.calcule_inertie>;
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	dh: ReturnType<typeof calcule_dh>;
	as: ReturnType<typeof calcule_as>;
	ai: ReturnType<typeof calcule_ai>;
}): models.common.ParMois<number> {
	const { inertie, gv } = props;

	return createParMois((mois) => {
		const dh = props.dh[mois];
		const as = props.as[mois];
		const ai = props.ai[mois];
		const x = (as + ai) / (gv * dh);

		switch (inertie) {
			case models.enveloppe.common.InertieEnum.tres_lourde:
				return (x - x ** 3.6) / (1 - x ** 3.6);
			case models.enveloppe.common.InertieEnum.lourde:
				return (x - x ** 3.6) / (1 - x ** 3.6);
			case models.enveloppe.common.InertieEnum.moyenne:
				return (x - x ** 2.9) / (1 - x ** 2.9);
			case models.enveloppe.common.InertieEnum.legere:
				return (x - x ** 2.5) / (1 - x ** 2.5);
		}
	});
}

/**
 * @doctrine chauffage.as
 * @returns Apports solaires en Wh/mois
 */
export function calcule_as(props: {
	sse: ReturnType<typeof enveloppe.calcule_sse>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
}): models.common.ParMois<number> {
	return createParMois((mois) => {
		const sse = props.sse[mois];
		const e = props.sollicitations[mois].e;
		return sse * e * 1000;
	});
}

/**
 * @doctrine chauffage.ai
 * @returns Apports internes en Wh/mois
 */
export function calcule_ai(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	nadeq: ReturnType<typeof ecs.calcule_nadeq>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { sh, nadeq } = props;
	return createParMois((mois) => {
		const nref = props.nref[mois];
		return ((3.18 + 0.34) * sh + 90 * (132 / 168) * nadeq) * nref;
	});
}

/**
 * @doctrine chauffage.qgw_rec
 * @returns Pertes de stockage récupérables en Wh/mois
 */
export function calcule_qgw_rec(props: {
	qgw: ReturnType<typeof ecs.calcule_qgw>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { qgw } = props;
	return createParMois((mois) => {
		const nref = props.nref[mois];
		return 0.48 * nref * (qgw / 8760);
	});
}

/**
 * @doctrine chauffage.qdw_rec
 * @return Pertes de distribution d'eau chaude sanitaire récupérables en Wh/mois
 */
export function calcule_qdw_rec(props: {
	qdw_ind_vc: ReturnType<typeof ecs.calcule_qdw_ind_vc>;
	qdw_col_vc: ReturnType<typeof ecs.calcule_qdw_col_vc>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { qdw_ind_vc, qdw_col_vc } = props;
	return createParMois((mois) => {
		const nref = props.nref[mois];
		return 0.48 * nref * ((qdw_ind_vc + qdw_col_vc) / 8760);
	});
}

/**
 * @doctrine chauffage.qgen_rec
 * @return Pertes de génération récupérables en Wh/mois
 */
export function calcule_qgen_rec(props: {
	qgen_ch_rec: ReturnType<typeof generateur.calcule_qgen_rec>[];
	qgen_ecs_rec: ReturnType<typeof calcule_qgen_ecs_rec>;
}): models.common.ParMois<number> {
	const qgen_ch_rec = mergeParMois(props.qgen_ch_rec);
	return createParMois((mois) => {
		return qgen_ch_rec[mois] + props.qgen_ecs_rec[mois];
	});
}

/**
 * @doctrine chauffage.qgen_ecs_rec
 * @return Pertes de génération d'eau chaude sanitaire récupérables en Wh/mois
 */
export function calcule_qgen_ecs_rec(props: {
	qgen: ReturnType<typeof ecs.calcule_qgen>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { qgen } = props;
	return createParMois((mois) => {
		const nref = props.nref[mois];
		const dper = nref * (1790 / 8760);
		return qgen * dper;
	});
}

/**
 * @doctrine chauffage.effet_joule
 * @see https://github.com/dpe-audit/dpe-logement/issues/46
 * @returns Chauffage majoritaire par effet joule (plus de 50 % de la surface chauffée)
 */
export function calcule_effet_joule(props: {
	installations: {
		surface: number;
		effet_joule: ReturnType<typeof installation.calcule_effet_joule>;
	}[];
}): boolean {
	const { installations } = props;
	const s = installations.reduce((acc, { surface }) => acc + surface, 0);
	const w = installations.reduce(
		(acc, { surface, effet_joule }) => (effet_joule ? acc + surface : acc),
		0,
	);
	return w / s >= 0.5;
}

/**
 * @doctrine chauffage.nref
 * @returns Nombre d'heures de chauffage en h/mois
 */
export function calcule_nref(props: {
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	scenario: models.common.Scenario;
}): models.common.ParMois<number> {
	const { sollicitations, scenario } = props;
	return createParMois((mois) => {
		switch (scenario) {
			case models.common.ScenarioEnum.conventionnel:
				return sollicitations[mois].nref19;
			case models.common.ScenarioEnum.depensier:
				return sollicitations[mois].nref21;
		}
	});
}

/**
 * @doctrine chauffage.dh
 * @returns Degrés-heures de chauffage en °C.h/mois
 */
export function calcule_dh(props: {
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	scenario: models.common.Scenario;
}): models.common.ParMois<number> {
	const { sollicitations, scenario } = props;
	return createParMois((mois) => {
		switch (scenario) {
			case models.common.ScenarioEnum.conventionnel:
				return sollicitations[mois].dh19;
			case models.common.ScenarioEnum.depensier:
				return sollicitations[mois].dh21;
		}
	});
}
