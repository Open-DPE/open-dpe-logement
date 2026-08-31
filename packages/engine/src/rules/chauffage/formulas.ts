import * as models from "@open-dpe-logement/models";
import type * as batiment from "../batiment/formulas.js";
import type * as climat from "../climat/formulas.js";
import type * as enveloppe from "../enveloppe/formulas.js";
import type * as ecs from "../ecs/formulas.js";
import * as emetteur from "./emetteur/formulas.js";
import * as emission from "./emission/formulas.js";
import * as generateur from "./generateur/formulas.js";
import * as installation from "./installation/formulas.js";
import * as systeme from "./systeme/formulas.js";

export { generateur, installation, systeme, emetteur, emission };

/**
 * @returns Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	consommations: ReturnType<typeof generateur.calcule_consommations>[];
}): models.common.Consommations {
	return models.common.mergeConsommations(...props.consommations);
}

/**
 * @formule chauffage.cch
 * @returns Consommations de chauffage en kWh/an
 */
export function calcule_cch(props: {
	cch: ReturnType<typeof generateur.calcule_cch>[];
}): number {
	return props.cch.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule chauffage.cch_elec
 * @returns Consommation d'électricité de chauffage en kWh/an
 */
export function calcule_cch_elec(props: {
	cch_elec: ReturnType<typeof generateur.calcule_cch_elec>[];
}): number {
	return props.cch_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule chauffage.caux
 * @returns Consommations des auxiliaires de chauffage en kWh/an
 */
export function calcule_caux(props: {
	caux_gen: ReturnType<typeof calcule_caux_gen>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
}): number {
	return props.caux_gen + props.caux_dist;
}

/**
 * @formule chauffage.caux_gen
 * @returns Consommations des auxiliaires de génération en kWh/an
 */
export function calcule_caux_gen(props: {
	caux_gen: ReturnType<typeof generateur.calcule_caux_gen>[];
}): number {
	return props.caux_gen.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule chauffage.caux_dist
 * @returns Consommations des auxiliaires de distribution en kWh/an
 */
export function calcule_caux_dist(props: {
	caux_dist: ReturnType<typeof installation.calcule_caux_dist>[];
}): number {
	return props.caux_dist.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule chauffage.bch
 * @returns Besoins de chauffage en kWh/mois
 */
export function calcule_bch(props: {
	bch_hp: ReturnType<typeof calcule_bch_hp>;
	qgw_rec: ReturnType<typeof calcule_qgw_rec>;
	qdw_rec: ReturnType<typeof calcule_qdw_rec>;
	qgen_rec: ReturnType<typeof calcule_qgen_rec>;
}): models.common.ParMois<number> {
	return models.common.createParMois((mois) => {
		const bch_hp = props.bch_hp[mois];
		const qgw_rec = props.qgw_rec[mois];
		const qdw_rec = props.qdw_rec[mois];
		const qgen_rec = props.qgen_rec[mois];
		return bch_hp - (qgw_rec + qdw_rec + qgen_rec) / 1000;
	});
}

/**
 * @formule chauffage.bch_hp
 * @returns Besoins de chauffage hors pertes récupérées en kWh/mois
 */
export function calcule_bch_hp(props: {
	bv: ReturnType<typeof calcule_bv>;
	dh: ReturnType<typeof calcule_dh>;
}): models.common.ParMois<number> {
	return models.common.createParMois((mois) => {
		const bv = props.bv[mois];
		const dh = props.dh[mois];
		return (bv * dh) / 1000;
	});
}

/**
 * @formule chauffage.bv
 * @returns Besoins de chauffage en W/K
 */
export function calcule_bv(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	f: ReturnType<typeof calcule_f>;
}): models.common.ParMois<number> {
	return models.common.createParMois((mois) => {
		const f = props.f[mois];
		return props.gv * (1 - f);
	});
}

/**
 * @formule chauffage.pch
 * @todo - Implémenter les méthodes DPE Appartement depuis les données DPE Immeuble
 * @returns Puissance conventionnelle de chauffage en kW
 */
export function calcule_pch(props: {
	ratio_proratisation: ReturnType<typeof batiment.calcule_ratio_proratisation>;
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	tbase: ReturnType<typeof climat.calcule_tbase>;
}): number {
	const { ratio_proratisation, gv, tbase } = props;
	return (
		(1.2 * gv * (1 / ratio_proratisation) * (19 - tbase)) / (1000 * 0.95 ** 3)
	);
}

/**
 * @formule chauffage.f
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

	return models.common.createParMois((mois) => {
		const dh = props.dh[mois];
		const as = props.as[mois];
		const ai = props.ai[mois];

		if (gv === 0 || dh === 0) return 0;

		const x = (as + ai) / (gv * dh);

		switch (inertie) {
			case models.enveloppe.common.Inertie.enum.tres_lourde:
				return (x - x ** 3.6) / (1 - x ** 3.6);
			case models.enveloppe.common.Inertie.enum.lourde:
				return (x - x ** 3.6) / (1 - x ** 3.6);
			case models.enveloppe.common.Inertie.enum.moyenne:
				return (x - x ** 2.9) / (1 - x ** 2.9);
			case models.enveloppe.common.Inertie.enum.legere:
				return (x - x ** 2.5) / (1 - x ** 2.5);
		}
	});
}

/**
 * @formule chauffage.as
 * @returns Apports solaires en Wh/mois
 */
export function calcule_as(props: {
	sse: ReturnType<typeof enveloppe.calcule_sse>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
}): models.common.ParMois<number> {
	return models.common.createParMois((mois) => {
		const sse = props.sse[mois];
		const e = props.sollicitations[mois].e;
		return sse * e * 1000;
	});
}

/**
 * @formule chauffage.ai
 * @returns Apports internes en Wh/mois
 */
export function calcule_ai(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	nadeq: ReturnType<typeof ecs.calcule_nadeq>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { sh, nadeq } = props;
	return models.common.createParMois((mois) => {
		const nref = props.nref[mois];
		return ((3.18 + 0.34) * sh + 90 * (132 / 168) * nadeq) * nref;
	});
}

/**
 * @formule chauffage.qgw_rec
 * @returns Pertes de stockage récupérables en Wh/mois
 */
export function calcule_qgw_rec(props: {
	qgw: ReturnType<typeof ecs.calcule_qgw>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { qgw } = props;
	return models.common.createParMois((mois) => {
		const nref = props.nref[mois];
		return 0.48 * nref * (qgw / 8760);
	});
}

/**
 * @formule chauffage.qdw_rec
 * @returns Pertes de distribution d'eau chaude sanitaire récupérables en Wh/mois
 */
export function calcule_qdw_rec(props: {
	qdw_ind_vc: ReturnType<typeof ecs.calcule_qdw_ind_vc>;
	qdw_col_vc: ReturnType<typeof ecs.calcule_qdw_col_vc>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { qdw_ind_vc, qdw_col_vc } = props;
	return models.common.createParMois((mois) => {
		const nref = props.nref[mois];
		return 0.48 * nref * ((qdw_ind_vc + qdw_col_vc) / 8760);
	});
}

/**
 * @formule chauffage.qgen_rec
 * @returns Pertes de génération récupérables en Wh/mois
 */
export function calcule_qgen_rec(props: {
	qgen_ch_rec: ReturnType<typeof generateur.calcule_qgen_rec>[];
	qgen_ecs_rec: ReturnType<typeof calcule_qgen_ecs_rec>;
}): models.common.ParMois<number> {
	const qgen_ch_rec = models.common.mergeParMois(props.qgen_ch_rec);
	return models.common.createParMois((mois) => {
		return qgen_ch_rec[mois] + props.qgen_ecs_rec[mois];
	});
}

/**
 * @formule chauffage.qgen_ecs_rec
 * @returns Pertes de génération d'eau chaude sanitaire récupérables en Wh/mois
 */
export function calcule_qgen_ecs_rec(props: {
	qgen: ReturnType<typeof ecs.calcule_qgen>;
	nref: ReturnType<typeof calcule_nref>;
}): models.common.ParMois<number> {
	const { qgen } = props;
	return models.common.createParMois((mois) => {
		const nref = props.nref[mois];
		const dper = nref * (1790 / 8760);
		return qgen * dper;
	});
}

/**
 * @formule chauffage.effet_joule
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
 * @formule chauffage.nref
 * @returns Nombre d'heures de chauffage en h/mois
 */
export function calcule_nref(props: {
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	scenario: models.common.Scenario;
}): models.common.ParMois<number> {
	const { sollicitations, scenario } = props;
	return models.common.createParMois((mois) => {
		switch (scenario) {
			case models.common.Scenario.enum.conventionnel:
				return sollicitations[mois].nref19;
			case models.common.Scenario.enum.depensier:
				return sollicitations[mois].nref21;
		}
	});
}

/**
 * @formule chauffage.dh
 * @returns Degrés-heures de chauffage en °C.h/mois
 */
export function calcule_dh(props: {
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	scenario: models.common.Scenario;
}): models.common.ParMois<number> {
	const { sollicitations, scenario } = props;
	return models.common.createParMois((mois) => {
		switch (scenario) {
			case models.common.Scenario.enum.conventionnel:
				return sollicitations[mois].dh19;
			case models.common.Scenario.enum.depensier:
				return sollicitations[mois].dh21;
		}
	});
}
