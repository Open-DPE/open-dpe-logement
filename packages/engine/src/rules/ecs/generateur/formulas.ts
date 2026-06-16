import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "../../common/formulas.js";
import type * as climat from "../../climat/formulas.js";
import type * as production from "../../production/formulas.js";
import type * as ecs from "../formulas.js";
import type * as installation from "../installation/formulas.js";
import type * as systeme from "../systeme/formulas.js";
import type * as generateurChauffage from "../../chauffage/generateur/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";
import { evaluate } from "../../math.js";

/**
 * @formule ecs.generateur.cef
 * @formule ecs.generateur.cep
 * @formule ecs.generateur.eges
 * @returns Consommations par usage et par énergie du générateur d'eau chaude sanitaire
 */
export function calcule_consommations(props: {
	consommations: ReturnType<typeof systeme.calcule_consommations>[];
	caux_gen: ReturnType<typeof calcule_caux_gen>;
	caux_gen_enr: ReturnType<typeof calcule_caux_gen_enr>;
}): models.common.Consommations {
	return models.common.mergeConsommations(
		...props.consommations,
		common.calcule_consommations({
			cef: props.caux_gen,
			cef_enr: props.caux_gen_enr,
			usage: models.common.UsageEnum.auxiliaire,
			energie: models.common.EnergieEnum.electricite,
			reseau_id: null,
		}),
	);
}

/**
 * @formule ecs.generateur.cecs
 * @returns Consommations du générateur d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs(props: {
	cecs: ReturnType<typeof systeme.calcule_cecs>[];
}): number {
	return props.cecs.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.generateur.cecs_elec
 * @returns Consommation d'électricité du générateur d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_elec(props: {
	cecs_elec: ReturnType<typeof systeme.calcule_cecs_elec>[];
}): number {
	return props.cecs_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule ecs.generateur.caux_gen
 * @returns Consommations de l'auxiliaire de génération d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_gen(props: {
	becs: ReturnType<typeof ecs.calcule_becs>;
	pn: ReturnType<typeof calcule_pn>;
	paux: ReturnType<typeof calcule_paux>;
	rdim: ReturnType<typeof calcule_rdim>;
}): number {
	const { pn, paux, rdim } = props;
	const becs = models.common.reduceParMois(props.becs);
	return (paux * becs * rdim) / pn;
}

/**
 * @formule ecs.generateur.caux_gen_enr
 * @returns Consommations d'électricité renouvelable de l'auxiliaire de génération d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_gen_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	caux_gen: ReturnType<typeof calcule_caux_gen>;
}): number {
	return common.calcule_cener({
		celec: props.celec,
		celec_ac: props.celec_ac,
		usage: models.production.UsageElectriciteEnum.ecs,
		cef: props.caux_gen,
	});
}

/**
 * @formule ecs.generateur.rdim
 * @returns Ratio de dimensionnement du générateur d'eau chaude sanitaire
 */
export function calcule_rdim(props: {
	systemes: {
		rdim: ReturnType<typeof calcule_rdim>;
		rdim_installation: ReturnType<typeof installation.calcule_rdim>;
	}[];
}): number {
	const { systemes } = props;
	return systemes.reduce((acc, s) => acc + s.rdim * s.rdim_installation, 0);
}

/**
 * @formule ecs.generateur.pn
 * @param props.pn_saisi : Puissance nominale saisie du générateur d'eau chaude sanitaire en kW
 * @returns Puissance nominale conventionnelle du générateur d'eau chaude sanitaire en kW
 */
export function calcule_pn(props: {
	pn_saisi: number | null;
	pdim: ReturnType<typeof calcule_pdim>;
}): number {
	const { pn_saisi, pdim } = props;
	return pn_saisi ?? pdim;
}

/**
 * @formule ecs.generateur.pdim
 * @returns Puissance de dimensionnement du générateur en kW
 */
export function calcule_pdim(props: {
	pecs: ReturnType<typeof calcule_pecs>;
	pch: ReturnType<typeof generateurChauffage.calcule_pch> | null;
}): number {
	const { pecs, pch } = props;
	return pch ? Math.max(pecs, pch) : pecs;
}

/**
 * @formule ecs.generateur.pecs
 * @returns Puissance de dimensionnement du besoin d'eau chaude sanitaire en kW
 */
export function calcule_pecs(props: {
	pn_saisi: number | null;
	volume_stockage: ReturnType<typeof set_volume_stockage>;
}): number {
	const { pn_saisi, volume_stockage } = props;
	if (pn_saisi) return pn_saisi;
	switch (true) {
		case volume_stockage === 0:
			return 21;
		case volume_stockage <= 20:
			return 21 - 0.8 * volume_stockage;
		case volume_stockage <= 150:
			return 5 - 1.751 * ((volume_stockage - 20) / 65);
		default:
			return (7.14 * volume_stockage + 428) / 1000;
	}
}

/**
 * @formule ecs.generateur.paux
 * @see abaques.ecs.paux
 * @throws {ValeurForfaitaireError}
 * @returns Puissance de l'auxiliaire de génération d'eau chaude sanitaire en kW
 */
export function calcule_paux(props: {
	type_generateur: ReturnType<typeof set_type_generateur>;
	energie_generateur: ReturnType<typeof set_energie_generateur>;
	generateur_multi_batiment: boolean;
	presence_ventouse: ReturnType<typeof set_presence_ventouse>;
	pn: ReturnType<typeof calcule_pn>;
}): number {
	const { pn, generateur_multi_batiment, ...query } = props;
	if (generateur_multi_batiment) return 0;
	const abaque = abaques.ecs.paux;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	const G = match.G;
	const H = match.H;
	const Pn = match.pn_max ? Math.min(match.pn_max, pn) : pn;
	const scope = { G, H, Pn };
	return evaluate(String(match.paux), scope);
}

/**
 * @formule ecs.generateur.cop
 *
 * @guard :
 * - {@linkcode models.ecs.generateur.isChauffeEauThermodynamique} ||
 * - {@linkcode models.ecs.generateur.isPacDoubleService} ||
 * - {@linkcode models.ecs.generateur.isPacHybride}
 *
 * @see abaques.ecs.cop
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de performance énergétique du générateur d'eau chaude sanitaire
 */
export function calcule_cop(props: {
	cop_saisi: number | null;
	type_generateur: ReturnType<typeof set_type_generateur>;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	annee_installation: ReturnType<typeof set_annee_installation>;
}): number {
	const { cop_saisi, ...query } = props;
	if (cop_saisi) return cop_saisi;

	const abaque = abaques.ecs.cop;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.cop;
}

export type Combustion = {
	// Rendement à pleine charge
	rpn: number;
	// Pertes à l'arrêt en kW
	qp0: number;
	// Puissance de la veilleuse en W
	pveilleuse: number;
};

/**
 * @formule ecs.generateur.rpn
 * @formule ecs.generateur.qp0
 * @formule ecs.generateur.pveilleuse
 *
 * @guard :
 * - {@linkcode models.ecs.generateur.isChaudiereCombustion} ||
 * - {@linkcode models.ecs.generateur.isPoeleBoisBouilleur} ||
 * - {@linkcode models.ecs.generateur.isChauffeEauGaz} ||
 * - {@linkcode models.ecs.generateur.isPacHybride} ||
 * - {@linkcode models.ecs.generateur.isGenerateurCollectifInconnu}
 *
 * @see abaques.ecs.combustion
 * @throws {ValeurForfaitaireError}
 * @returns Performances des générateurs à combustion
 */
export function calcule_combustion(props: {
	rpn_saisi: number | null;
	qp0_saisi: number | null;
	pveilleuse_saisi: number | null;
	type_generateur: ReturnType<typeof set_type_generateur>;
	energie_generateur: ReturnType<typeof set_energie_generateur>;
	bienergie_generateur: models.ecs.generateur.Bienergie | null;
	mode_combustion: ReturnType<typeof set_mode_combustion>;
	volume_stockage: ReturnType<typeof set_volume_stockage>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	pn: ReturnType<typeof calcule_pn>;
	presence_ventouse: ReturnType<typeof set_presence_ventouse>;
}): Combustion {
	const {
		rpn_saisi,
		qp0_saisi,
		pveilleuse_saisi,
		presence_ventouse,
		...query
	} = props;

	const combustion: Partial<Combustion> = {};

	if (rpn_saisi) combustion.rpn = rpn_saisi;
	if (qp0_saisi) combustion.qp0 = qp0_saisi;
	if (pveilleuse_saisi) combustion.pveilleuse = pveilleuse_saisi;

	if (combustion.rpn && combustion.qp0 && combustion.pveilleuse)
		return combustion as Combustion;

	const energie_generateur =
		props.bienergie_generateur ?? props.energie_generateur;

	const q = { ...query, ...{ energie_generateur } };
	const abaque = abaques.ecs.combustion;
	const match = abaque.search(q, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	const E = presence_ventouse ? 1.75 : 2.5;
	const F = presence_ventouse ? -0.55 : -0.8;
	const Pn = match.pn_max ? Math.min(match.pn_max, props.pn) : props.pn;
	const logPn = Math.log10(Pn);
	const scope = { E, F, Pn, logPn };

	combustion.rpn = combustion.rpn ?? evaluate(String(match.rpn), scope);
	combustion.qp0 = combustion.qp0 ?? evaluate(String(match.qp0), scope);
	combustion.pveilleuse = combustion.pveilleuse ?? match.pveilleuse;
	return combustion as Combustion;
}

/**
 * @formule ecs.generateur.cr
 * @see abaques.ecs.cr
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de perte du ballon de stockage en Wh/l.°C.jour
 */
export function calcule_cr(props: {
	type_generateur: models.ecs.generateur.TypeGenerateur;
	energie_generateur: models.ecs.generateur.EnergieEcs;
	position_chauffe_eau: models.ecs.generateur.PositionChauffeEau | null;
	label_generateur: models.ecs.generateur.Label | null;
	volume_stockage: ReturnType<typeof set_volume_stockage>;
}): number {
	if (0 === props.volume_stockage) return 0;
	const abaque = abaques.ecs.cr;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.cr;
}

/**
 * @formule ecs.generateur.qgw
 * @returns Pertes de stockage en Wh/an
 */
export function calcule_qgw(props: {
	energie_generateur: models.ecs.generateur.EnergieEcs;
	cr: ReturnType<typeof calcule_cr>;
	volume_stockage: ReturnType<typeof set_volume_stockage>;
}): number {
	const { energie_generateur, cr, volume_stockage } = props;
	if (volume_stockage === 0) return 0;
	return energie_generateur === models.common.EnergieEnum.electricite
		? 8592 * (45 / 24) * volume_stockage * cr
		: 67662 * volume_stockage ** 0.55;
}

/**
 * @formule ecs.generateur.qgen
 * @param props.generateur_mixte : Générateur assurant la production d'eau chaude sanitaire et de chauffage
 * @returns Pertes de génération du générateur d'eau chaude sanitaire en Wh/an
 */
export function calcule_qgen(props: {
	generateur_mixte: boolean;
	presence_ventouse: ReturnType<typeof set_presence_ventouse> | null;
	qp0: ReturnType<typeof calcule_combustion>["qp0"];
}): number {
	const { generateur_mixte } = props;
	if (!generateur_mixte) return 0;
	const qp0 = (props.qp0 ?? 0) * 1000;
	const cper = props.presence_ventouse ? 0.75 : 5;
	return 0.48 * cper * qp0;
}

/**
 * @param props.type_generateur : Type de générateur d'eau chaude sanitaire saisi
 * @returns Type de générateur d'eau chaude sanitaire retenu
 */
export function set_type_generateur(props: {
	type_generateur: models.ecs.generateur.TypeGenerateur | null;
}): models.ecs.generateur.TypeGenerateur {
	const { type_generateur } = props;
	return type_generateur ?? models.ecs.generateur.TypeGenerateurEnum.chaudiere;
}

/**
 * @param props.energie_generateur : Energie du générateur d'eau chaude sanitaire saisie
 * @returns Energie du générateur d'eau chaude sanitaire retenue
 */
export function set_energie_generateur(props: {
	energie_generateur: models.ecs.generateur.EnergieEcs | null;
}): models.ecs.generateur.EnergieEcs {
	const { energie_generateur } = props;
	return energie_generateur ?? models.common.EnergieEnum.fioul;
}

/**
 * @param props.mode_combustion : Mode de combustion du générateur d'eau chaude sanitaire saisi
 * @returns Mode de combustion du générateur d'eau chaude sanitaire retenu
 */
export function set_mode_combustion(props: {
	mode_combustion: models.ecs.generateur.ModeCombustion | null;
}): models.ecs.generateur.ModeCombustion {
	const { mode_combustion } = props;
	return mode_combustion ?? models.ecs.generateur.ModeCombustionEnum.standard;
}

/**
 * @param props.presence_ventouse : Présence d'une ventouse sur le générateur d'eau chaude sanitaire saisie
 * @returns Présence d'une ventouse sur le générateur d'eau chaude sanitaire retenue
 */
export function set_presence_ventouse(props: {
	presence_ventouse: boolean | null;
}): boolean {
	const { presence_ventouse } = props;
	return presence_ventouse ?? false;
}

/**
 * @param props.annee_installation : Année d'installation du générateur d'eau chaude sanitaire saisie
 * @param props.annee_construction_batiment : Année de construction du bâtiment
 * @returns Année d'installation du générateur d'eau chaude sanitaire retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}

/**
 * @param props.volume_stockage : Volume de stockage d'eau chaude sanitaire en litres saisi
 * @returns Volume de stockage d'eau chaude sanitaire en litres retenu
 */
export function set_volume_stockage(props: {
	volume_stockage: number | null;
}): number {
	const { volume_stockage } = props;
	return volume_stockage ?? 50;
}
