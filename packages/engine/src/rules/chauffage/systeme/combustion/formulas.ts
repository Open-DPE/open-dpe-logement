import * as models from "@open-dpe-logement/models";
import * as common from "../../../common/formulas.js";
import type * as climat from "../../../climat/formulas.js";
import type * as enveloppe from "../../../enveloppe/formulas.js";
import type * as generateur from "../../generateur/formulas.js";
import * as utils from "./utils.js";

export type Props = {
	scenario: models.common.Scenario;
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	tbase: ReturnType<typeof climat.calcule_tbase>;
	pn: ReturnType<typeof generateur.calcule_pn>;
	pn_combustion: ReturnType<typeof calcule_pn_combustion>;
	pn_cascade: ReturnType<typeof calcule_pn_cascade>;
	cascade: models.chauffage.generateur.Cascade | null;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
	rpn: ReturnType<typeof generateur.calcule_combustion>["rpn"];
	rpint: ReturnType<typeof generateur.calcule_combustion>["rpint"];
	qp0: ReturnType<typeof generateur.calcule_combustion>["qp0"];
	pveilleuse: ReturnType<typeof generateur.calcule_combustion>["pveilleuse"];
	kpcs: ReturnType<typeof common.calcule_kpcs>;
	mode_combustion: ReturnType<typeof generateur.set_mode_combustion>;
	presence_regulation: ReturnType<typeof generateur.set_presence_regulation>;
	tfonc30: ReturnType<typeof generateur.calcule_tfonc30> | null;
	tfonc100: ReturnType<typeof generateur.calcule_tfonc100> | null;
};

/**
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isChaudiereCombustion} ||
 * 	- {@linkcode models.chauffage.generateur.isPoeleBouilleur} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurAirChaudCombustion} ||
 * 	- {@linkcode models.chauffage.generateur.isRadiateurGaz} ||
 * 	- {@linkcode models.chauffage.generateur.isPACHybride} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurCollectifInconnu}
 *
 * @returns Rendement de génération des générateurs à combustion
 */
export function calcule_rg(props: Props): number {
	const cdim_ref = calcule_cdim_ref(props);
	const prel = calcule_prel(props);

	const tch = calcule_tch();
	const coeff_pond = calcule_coeff_pond();

	const tch_dim = calcule_tch_dim({ tch, cdim_ref });
	const coeff_pond_dim = calcule_coeff_pond_dim({ coeff_pond });

	const ctch = calcule_ctch({ ...props, tch_dim, prel });
	const tch_final = calcule_tch_final({ tch_dim, prel, ctch });
	const coeff_pond_final = calcule_coeff_pond_final({
		tch_dim,
		coeff_pond_dim,
		ctch,
	});

	const p = calcule_p({ pn: props.pn, tch_final });
	const qp = calcule_qp({ ...props, tch_final });
	const pfou = calcule_pfou({ p, coeff_pond_final });
	const pcons = calcule_pcons({ p, pfou, qp });
	const pmfou = calcule_pmfou({ ...props, pfou });
	const pmcons = calcule_pmcons({ pcons });

	const kpcs = props.kpcs;
	const qp0 = props.qp0 * kpcs;
	const pveilleuse = (props.pveilleuse / 1000) * kpcs;

	return (pmfou / (pmcons + 0.45 * qp0 + pveilleuse)) * kpcs;
}

/**
 * @returns Température de consigne en °C
 */
const TCONS = {
	[models.common.Scenario.enum.conventionnel]: 19,
	[models.common.Scenario.enum.depensier]: 21,
};

/**
 * Taux de charge et coefficient de pondération associé
 */
const TAUX_CHARGE = {
	"5": 5,
	"15": 15,
	"25": 25,
	"35": 35,
	"45": 45,
	"55": 55,
	"65": 65,
	"75": 75,
	"85": 85,
	"95": 95,
} as const;

type TauxCharge = (typeof TAUX_CHARGE)[keyof typeof TAUX_CHARGE];

type ParTauxCharge<T> = Record<TauxCharge, T>;

function createParTauxCharge<T>(fn: (x: TauxCharge) => T): ParTauxCharge<T> {
	const result: Partial<ParTauxCharge<T>> = {};
	for (const x of Object.values(TAUX_CHARGE) as TauxCharge[]) result[x] = fn(x);
	return result as ParTauxCharge<T>;
}

/**
 * Coefficient de pondération au point de fonciontionnement
 */
export const COEFF_POND = {
	[TAUX_CHARGE["5"]]: 0.1,
	[TAUX_CHARGE["15"]]: 0.25,
	[TAUX_CHARGE["25"]]: 0.2,
	[TAUX_CHARGE["35"]]: 0.15,
	[TAUX_CHARGE["45"]]: 0.1,
	[TAUX_CHARGE["55"]]: 0.1,
	[TAUX_CHARGE["65"]]: 0.05,
	[TAUX_CHARGE["75"]]: 0.025,
	[TAUX_CHARGE["85"]]: 0.025,
	[TAUX_CHARGE["95"]]: 0,
};

/**
 * @returns Taux de charge en valeur décimale
 */
export function calcule_tch(): ParTauxCharge<number> {
	return createParTauxCharge((x) => x / 100);
}

/**
 * @returns Taux de charge dimensionné en valeur décimale
 */
export function calcule_tch_dim(props: {
	tch: ReturnType<typeof calcule_tch>;
	cdim_ref: ReturnType<typeof calcule_cdim_ref>;
}): ParTauxCharge<number> {
	const { cdim_ref } = props;
	return createParTauxCharge((x) => {
		const tch = props.tch[x];
		return x === 95 ? tch : Math.min(tch / cdim_ref, 1);
	});
}

/**
 * @returns Taux de charge final en valeur décimale
 */
export function calcule_tch_final(props: {
	tch_dim: ReturnType<typeof calcule_tch_dim>;
	prel: ReturnType<typeof calcule_prel>;
	ctch: ReturnType<typeof calcule_ctch> | null;
}): ParTauxCharge<number> {
	const prel = props.prel;
	return createParTauxCharge((x) => {
		const tch_dim = props.tch_dim[x];
		const ctch = props.ctch ? props.ctch[x] : null;
		return ctch ? Math.min(1, ctch / prel) : tch_dim;
	});
}

/**
 * @returns Coefficient de pondération
 */
export function calcule_coeff_pond(): ParTauxCharge<number> {
	return createParTauxCharge((x) => COEFF_POND[x]);
}

/**
 * @returns Coefficient de pondération dimensionné - Valeur fantôme
 */
export function calcule_coeff_pond_dim(props: {
	coeff_pond: ReturnType<typeof calcule_coeff_pond>;
}): ParTauxCharge<number> {
	return props.coeff_pond;
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/51
 * @returns Coefficient de pondération final au point de fonctionnement x
 */
export function calcule_coeff_pond_final(props: {
	tch_dim: ReturnType<typeof calcule_tch_dim>;
	coeff_pond_dim: ReturnType<typeof calcule_coeff_pond_dim>;
	ctch: ReturnType<typeof calcule_ctch>;
}): ParTauxCharge<number> {
	const { tch_dim, coeff_pond_dim, ctch } = props;

	return createParTauxCharge((x) => {
		const coeff_pond_dim_x = coeff_pond_dim[x];
		if (!ctch) return coeff_pond_dim_x;
		const ctch_x = ctch[x];
		const tch_dim_x = tch_dim[x];

		const somme = Object.values(TAUX_CHARGE).reduce((acc, x) => {
			const tch_dim_x = tch_dim[x];
			const coeff_pond_dim_x = coeff_pond_dim[x];
			const ctch_x = ctch[x];
			return acc + (ctch_x / tch_dim_x) * coeff_pond_dim_x;
		}, 0);

		return somme > 0 ? ((ctch_x / tch_dim_x) * coeff_pond_dim_x) / somme : 0;
	});
}

export function calcule_ctch(props: {
	tch_dim: ReturnType<typeof calcule_tch_dim>;
	prel: ReturnType<typeof calcule_prel>;
	cascade: Props["cascade"];
	pn: Props["pn"];
	pn_cascade: Props["pn_cascade"];
}): ParTauxCharge<number> | null {
	const { prel, cascade, pn, pn_cascade } = props;

	if (null === cascade) return null;

	return createParTauxCharge((x) => {
		const tch_dim = props.tch_dim[x];
		// Cascade sans priorité
		if (cascade === 0) return prel * tch_dim;
		// Cascade avec priorité : le générateur est le générateur prioritaire
		if (cascade === 1) return Math.min(prel, tch_dim);
		// Cascade avec priorité : le générateur est le générateur secondaire
		const prel1 = (pn_cascade - pn) / pn_cascade;
		const ctch1 = Math.min(prel1, tch_dim);
		return Math.min(prel, tch_dim - ctch1);
	});
}

/**
 * @returns Coefficient de pondération permettant de prendre en compte les charges partielles
 */
export function calcule_cdim_ref(props: {
	scenario: Props["scenario"];
	gv: Props["gv"];
	tbase: Props["tbase"];
	pn_combustion: Props["pn_combustion"];
}): number {
	const { gv, tbase, pn_combustion } = props;
	const tcons = TCONS[props.scenario];
	if (tcons === tbase) return 0;
	return gv ? (1000 * pn_combustion) / (gv * (tcons - tbase)) : 0;
}

/**
 * @returns Puissance relative du générateur en cascade
 */
export function calcule_prel(props: {
	pn: Props["pn"];
	pn_cascade: Props["pn_cascade"];
}): number {
	const { pn, pn_cascade } = props;
	return pn_cascade ? pn / pn_cascade : 1;
}

/**
 * @returns Puissance au point de fonctionnement x en kW
 */
export function calcule_p(props: {
	pn: Props["pn"];
	tch_final: ReturnType<typeof calcule_tch_final>;
}): ParTauxCharge<number> {
	const { pn } = props;
	return createParTauxCharge((x) => props.tch_final[x] * pn);
}

/**
 * @returns Puissance moyenne fournie en kW
 */
export function calcule_pmfou(props: {
	pfou: ReturnType<typeof calcule_pfou>;
}): number {
	return Object.values(props.pfou).reduce((acc, pfou) => acc + pfou, 0);
}

/**
 * @returns Puissance fournie au point de fonctionnement x en kW
 */
export function calcule_pfou(props: {
	p: ReturnType<typeof calcule_p>;
	coeff_pond_final: ReturnType<typeof calcule_coeff_pond_final>;
}): ParTauxCharge<number> {
	return createParTauxCharge((x) => props.p[x] * props.coeff_pond_final[x]);
}

/**
 * @returns Puissance moyenne consommée en kW
 */
export function calcule_pmcons(props: {
	pcons: ReturnType<typeof calcule_pcons>;
}): number {
	return Object.values(props.pcons).reduce((acc, pcons) => acc + pcons, 0);
}

/**
 * @returns Puissance consommée au point de fonctionnement x en kW
 */
export function calcule_pcons(props: {
	p: ReturnType<typeof calcule_p>;
	pfou: ReturnType<typeof calcule_pfou>;
	qp: ReturnType<typeof calcule_qp>;
}): ParTauxCharge<number> {
	return createParTauxCharge((x) => {
		const p_x = props.p[x];
		const pfou_x = props.pfou[x];
		const qp_x = props.qp[x];
		return p_x ? pfou_x * ((p_x + qp_x) / p_x) : 0;
	});
}

/**
 * @param props.systemes : Liste des systèmes de chauffage à combustion associés
 * @returns Puissance nominale des générateurs de chauffage à combustion en kW
 */
export function calcule_pn_combustion(props: {
	generateur_collectif: boolean;
	systemes: {
		generateur_collectif: boolean;
		pn: ReturnType<typeof generateur.calcule_pn>;
	}[];
}): number {
	return props.systemes
		.filter((s) => s.generateur_collectif === props.generateur_collectif)
		.reduce((acc, s) => acc + s.pn, 0);
}

/**
 * @param props.systemes : Liste des systèmes de chauffage à combustion associés
 * @param props.systemes[].cascade : Indique si le système de chauffage est en cascade ou non
 * @returns Puissance nominale des générateurs de chauffage en cascade en kW
 */
export function calcule_pn_cascade(props: {
	generateur_collectif: boolean;
	systemes: {
		generateur_collectif: boolean;
		pn: ReturnType<typeof generateur.calcule_pn>;
		cascade: models.chauffage.generateur.Cascade | null;
	}[];
}): number {
	return props.systemes
		.filter(
			(s) =>
				s.generateur_collectif === props.generateur_collectif &&
				s.cascade !== null,
		)
		.reduce((acc, s) => acc + s.pn, 0);
}

type QPProps = Props & {
	tch_final: ReturnType<typeof calcule_tch_final>;
};

/**
 * @returns Pertes pour chaque point de fonctionnement
 */
export function calcule_qp(props: QPProps): ParTauxCharge<number> {
	switch (true) {
		case utils.is_chaudiere_gaz(props):
		case utils.is_chaudiere_fioul(props):
		case utils.is_pac_hybride(props): {
			return calcule_qpx_chaudiere(props);
		}

		case utils.is_radiateur_gaz(props): {
			return calcule_qpx_radiateur_gaz(props);
		}

		default: {
			return calcule_qpx_autres(props);
		}
	}
}

/**
 * @returns Pertes pour chaque point de fonctionnement des chaudières gaz, fioul et PAC hybride
 */
export function calcule_qpx_chaudiere(props: QPProps): ParTauxCharge<number> {
	const qp0 = props.qp0 * props.kpcs;
	const qp30 = calcule_qp30(props);
	const qp100 = calcule_qp100(props);

	return createParTauxCharge((x) => {
		const tch = props.tch_final[x];

		switch (props.mode_combustion) {
			case models.chauffage.generateur.ModeCombustion.enum.standard: {
				return tch < 30
					? ((qp30 - 0.15 * qp0) * tch) / 0.3 + 0.15 * qp0
					: ((qp100 - qp30) * tch) / 0.7 + qp30 - ((qp100 - qp30) * 0.3) / 0.7;
			}
			case models.chauffage.generateur.ModeCombustion.enum.basse_temperature:
			case models.chauffage.generateur.ModeCombustion.enum.condensation: {
				const qp15 = qp30 / 2;

				if (tch < 15) {
					return ((qp15 - 0.15 * qp0) * tch) / 0.15 + 0.15 * qp0;
				} else if (tch < 30) {
					return (
						((qp30 - qp15) * tch) / 0.15 + qp15 - ((qp30 - qp15) * 0.15) / 0.15
					);
				} else {
					return (
						((qp100 - qp30) * tch) / 0.7 + qp30 - ((qp100 - qp30) * 0.3) / 0.7
					);
				}
			}
		}
	});
}

/**
 * @returns Pertes pour chaque point de fonctionnement des radiateurs gaz
 */
export function calcule_qpx_radiateur_gaz(
	props: QPProps,
): ParTauxCharge<number> {
	const pn = props.pn;
	const rpn = (props.rpn * 100) / props.kpcs;
	return createParTauxCharge((x) => {
		const tch = props.tch_final[x];
		return 1.04 * ((100 - rpn) / rpn) * pn * tch;
	});
}

/**
 * @returns Pertes pour chaque point de fonctionnement des autres générateurs à combustion
 */
export function calcule_qpx_autres(props: QPProps): ParTauxCharge<number> {
	const qp0 = props.qp0 * props.kpcs;
	const qp50 = calcule_qp50(props);
	const qp100 = calcule_qp100(props);
	return createParTauxCharge((x) => {
		const tch = props.tch_final[x];
		return tch < 50
			? ((qp50 - 0.15 * qp0) * tch) / 0.5 + 0.15 * qp0
			: ((qp100 - qp50) * tch) / 0.5 + 2 * qp50 - qp100;
	});
}

/**
 * @returns Pertes à 30% de charge
 */
export function calcule_qp30(props: Props): number {
	const { pn, tfonc30, tfonc100, presence_regulation, kpcs } = props;
	const rpint = (props.rpint * 100) / kpcs;
	const tfonc = presence_regulation ? tfonc30 : tfonc100;

	if (null === tfonc) {
		throw new Error(
			"Tfonc30 et tfonc100 doivent être renseignés pour les chaudières à combustion",
		);
	}

	switch (props.mode_combustion) {
		case models.chauffage.generateur.ModeCombustion.enum.basse_temperature:
			return (
				0.3 *
				pn *
				((100 - (rpint + 0.1 * (40 - tfonc))) / (rpint + 0.1 * (40 - tfonc)))
			);

		case models.chauffage.generateur.ModeCombustion.enum.condensation:
			return (
				0.3 *
				pn *
				((100 - (rpint + 0.2 * (33 - tfonc))) / (rpint + 0.2 * (33 - tfonc)))
			);

		default: {
			return (
				0.3 *
				pn *
				((100 - (rpint + 0.1 * (50 - tfonc))) / (rpint + 0.1 * (50 - tfonc)))
			);
		}
	}
}

/**
 * @returns Pertes à 50% de charge
 */
export function calcule_qp50(props: Props): number {
	const { pn, kpcs } = props;
	const rpint = (props.rpint * 100) / kpcs;
	return 0.5 * pn * ((100 - rpint) / rpint);
}

/**
 * @returns Pertes à 100% de charge des autres generateurs à combustion
 */
export function calcule_qp100(props: Props): number {
	const { pn, tfonc100, kpcs } = props;
	const rpn = (props.rpn * 100) / kpcs;

	switch (true) {
		case utils.is_chaudiere_gaz(props):
		case utils.is_chaudiere_fioul(props):
		case utils.is_pac_hybride(props): {
			if (null === tfonc100) {
				throw new Error(
					"Tfonc30 et tfonc100 doivent être renseignés pour les chaudières à combustion",
				);
			}
			return (
				pn *
				((100 - (rpn + 0.1 * (70 - tfonc100))) / (rpn + 0.1 * (70 - tfonc100)))
			);
		}

		default:
			return pn * ((100 - rpn) / rpn);
	}
}
