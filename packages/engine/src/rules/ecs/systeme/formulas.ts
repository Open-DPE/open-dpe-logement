import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "../../common/formulas.js";
import type * as climat from "../../climat/formulas.js";
import type * as production from "../../production/formulas.js";
import type * as generateur from "../generateur/formulas.js";
import type * as installation from "../installation/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";

const TypeGenerateurEnum = models.ecs.generateur.TypeGenerateurEnum;
const LabelGenerateurEnum = models.ecs.generateur.LabelEnum;
const PositionChauffeEauEnum = models.ecs.generateur.PositionChauffeEauEnum;

/**
 * @formule ecs.systeme.cef
 * @formule ecs.systeme.cep
 * @formule ecs.systeme.eges
 * @returns Consommations par usage et par énergie du générateur d'eau chaude sanitaire
 */
export function calcule_consommations(props: {
	cecs: ReturnType<typeof calcule_cecs>;
	cecs_enr: ReturnType<typeof calcule_cecs_enr>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
	caux_dist_enr: ReturnType<typeof calcule_caux_dist_enr>;
	energie: models.ecs.generateur.EnergieEcs;
	reseau_id: string | null;
}): models.common.Consommations {
	return models.common.mergeConsommations(
		common.calcule_consommations({
			cef: props.cecs,
			cef_enr: props.cecs_enr,
			usage: models.common.UsageEnum.ecs,
			energie: props.energie,
			reseau_id: props.reseau_id,
		}),
		common.calcule_consommations({
			cef: props.caux_dist,
			cef_enr: props.caux_dist_enr,
			usage: models.common.UsageEnum.auxiliaire,
			energie: models.common.EnergieEnum.electricite,
			reseau_id: null,
		}),
	);
}

/**
 * @formule ecs.systeme.cecs
 * @returns Consommation d'énergie du système d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs(props: {
	becs: ReturnType<typeof installation.calcule_becs>;
	fecs: ReturnType<typeof installation.calcule_fecs>;
	rdim: ReturnType<typeof calcule_rdim>;
	iecs: ReturnType<typeof calcule_iecs>;
}): number {
	const { fecs, rdim, iecs } = props;
	const becs = models.common.reduceParMois(props.becs);
	return becs * (1 - fecs) * iecs * rdim;
}

/**
 * @formule ecs.systeme.cecs_elec
 * @returns Consommation d'électricité du système d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_elec(props: {
	cecs: ReturnType<typeof calcule_cecs>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
}): number {
	return common.calcule_celec({
		cef: props.cecs,
		energie: props.energie_generateur,
	});
}

/**
 * @formule ecs.systeme.cecs_enr
 * @returns Consommations d'électricité renouvelable du système d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	cecs_elec: ReturnType<typeof calcule_cecs_elec>;
}): number {
	return common.calcule_cener({
		celec: props.celec,
		celec_ac: props.celec_ac,
		usage: models.production.UsageElectriciteEnum.ecs,
		cef: props.cecs_elec,
	});
}

/**
 * @formule ecs.systeme.caux_dist
 * @returns Consommation des auxiliaires de distribution d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_dist(props: {
	qcirb: ReturnType<typeof calcule_qcirb>;
	qtrac: ReturnType<typeof calcule_qtrac>;
}): number {
	return (props.qcirb + props.qtrac) / 1000;
}

/**
 * @formule ecs.systeme.caux_dist_enr
 * @returns Consommations d'électricité renouvelable des auxiliaires de distribution d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_dist_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
}): number {
	return common.calcule_cener({
		celec: props.celec,
		celec_ac: props.celec_ac,
		usage: models.production.UsageElectriciteEnum.auxiliaires_distribution,
		cef: props.caux_dist,
	});
}

/**
 * @formule ecs.systeme.qcirb
 * @param props.sh : Surface de l'installation d'eau chaude sanitaire en m²
 * @param props.installation_collective : Installation collective d'eau chaude sanitaire
 * @param props.niveaux_desservis : Nombre de niveaux desservis par l'installation d'eau chaude sanitaire
 * @returns Consommations du circulateur d'eau chaude sanitaire en Wh/an
 */
export function calcule_qcirb(props: {
	nj: ReturnType<typeof climat.calcule_nj>;
	sh: number;
	installation_collective: boolean;
	qdw: ReturnType<typeof installation.calcule_qdw>;
	bouclage: ReturnType<typeof set_bouclage_reseau>;
	niveaux_desservis: number;
}): number {
	const { installation_collective, bouclage } = props;
	if (false === installation_collective) return 0;
	if (bouclage !== models.ecs.systeme.BouclageEnum.boucle) return 0;

	const { sh, qdw, niveaux_desservis } = props;
	const nj = models.common.reduceParMois(props.nj);
	const nh = nj * 24;
	const nh_puisage = nj * 5;
	const lb = Math.sqrt(sh / niveaux_desservis) + 6 * (niveaux_desservis - 0.5);
	const delta_pb = 0.2 * lb + 10;
	const phyd = (qdw * delta_pb) / 3.6;
	const effcircb = phyd ** 0.324 / 15.3;
	const pcircb = Math.max(20, phyd / effcircb);
	return nh_puisage * pcircb + (nh - nh_puisage) * 20;
}

/**
 * @formule ecs.systeme.qtrac
 * @returns Consommation du traçeur d'eau chaude sanitaire en Wh/an
 */
export function calcule_qtrac(props: {
	becs: ReturnType<typeof installation.calcule_becs>;
	installation_collective: boolean;
	bouclage: ReturnType<typeof set_bouclage_reseau>;
}): number {
	const { installation_collective, bouclage } = props;
	if (false === installation_collective) return 0;
	if (bouclage !== models.ecs.systeme.BouclageEnum.trace) return 0;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	return becs * 0.14;
}

/**
 * @formule ecs.systeme.rdim
 * @param props.n_systemes - Nombre de systèmes d'eau chaude sanitaire associés à l'installation
 * @returns Ratio de dimensionnement du système d'eau chaude sanitaire
 */
export function calcule_rdim(props: { n_systemes: number }): number {
	return props.n_systemes ? 1 / props.n_systemes : 0;
}

/**
 * @formule ecs.systeme.iecs
 * @returns Inverse du rendement du système d'eau chaude sanitaire
 */
export function calcule_iecs(props: {
	rd: ReturnType<typeof calcule_rd>;
	rg: Rendements["rg"];
	rs: Rendements["rs"];
	rgs: Rendements["rgs"];
}): number {
	const { rd, rg, rs, rgs } = props;
	return 1 / (rd * rg * rs * rgs);
}

/**
 * @formule ecs.systeme.rd
 * @see abaques.ecs.rd
 * @throws {ValeurForfaitaireError}
 * @returns Rendement de distribution du système d'eau chaude sanitaire
 */
export function calcule_rd(props: {
	installation_collective: boolean;
	bouclage_reseau: ReturnType<typeof set_bouclage_reseau> | null;
	alimentation_contigue: boolean | null;
	production_volume_habitable: boolean;
}): number {
	const abaque = abaques.ecs.rd;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.rd;
}

/**
 * @formule ecs.systeme.rd
 * @formule ecs.systeme.rg
 * @formule ecs.systeme.rs
 * @formule ecs.systeme.rgs
 *
 * @see calcule_rendements_reseau_chaleur
 * @see calcule_rendements_chaudiere_mixte
 * @see calcule_rendements_chauffe_eau_gaz
 * @see calcule_rendements_systeme_thermodynamique
 * @see calcule_rendements_systeme_electrique
 * Rendements du système d'eau chaude sanitaire
 */
export type Rendements = {
	rd: ReturnType<typeof calcule_rd>;
	// Rendement de génération
	rg: number;
	// Rendement de stockage
	rs: number;
	// rendement de génération et de stockage
	rgs: number;
};

/**
 * @guard {@linkcode models.ecs.generateur.isReseauChaleur} || {@linkcode models.ecs.generateur.isGenerateurMultiBatiment}
 * @returns Rendements du réseau de chaleur et des générateurs multi-bâtiment
 */
export function calcule_rendements_reseau_chaleur(props: {
	rd: ReturnType<typeof calcule_rd>;
	isolation_reseau: ReturnType<typeof set_isolation_reseau>;
}): Rendements {
	const { rd, isolation_reseau } = props;
	const rgs = isolation_reseau ? 0.9 : 0.75;
	return { rd, rgs, rg: 1, rs: 1 };
}

/**
 * @guard :
 * - {@linkcode models.ecs.generateur.isChaudiereCombustion} ||
 * - {@linkcode models.ecs.generateur.isPoeleBoisBouilleur} ||
 * - {@linkcode models.ecs.generateur.isPacDoubleServiceHybride} ||
 * - {@linkcode models.ecs.generateur.isGenerateurCollectifInconnu}
 * @returns Rendements de la chaudière mixte
 */
export function calcule_rendements_chaudiere_mixte(props: {
	rd: ReturnType<typeof calcule_rd>;
	becs: ReturnType<typeof installation.calcule_becs>;
	qgw: ReturnType<typeof generateur.calcule_qgw>;
	rpn: ReturnType<typeof generateur.calcule_combustion>["rpn"];
	qp0: ReturnType<typeof generateur.calcule_combustion>["qp0"];
	pveilleuse: ReturnType<typeof generateur.calcule_combustion>["pveilleuse"];
}): Rendements {
	const { rd, qgw, rpn, pveilleuse } = props;
	const qp0 = props.qp0 * 1000;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	const rgs =
		1 /
		(1 / rpn + (1790 * qp0 + qgw) / becs + 6970 * ((0.5 * pveilleuse) / becs));
	return { rd, rgs, rg: 1, rs: 1 };
}

/**
 * @guard {@linkcode models.ecs.generateur.isChauffeEauGaz}
 * @returns Rendements du chauffe-eau gaz
 */
export function calcule_rendements_chauffe_eau_gaz(props: {
	rd: ReturnType<typeof calcule_rd>;
	becs: ReturnType<typeof installation.calcule_becs>;
	qgw: ReturnType<typeof generateur.calcule_qgw>;
	rpn: ReturnType<typeof generateur.calcule_combustion>["rpn"];
	qp0: ReturnType<typeof generateur.calcule_combustion>["qp0"];
	pveilleuse: ReturnType<typeof generateur.calcule_combustion>["pveilleuse"];
}): Rendements {
	const { rd, qgw, rpn, pveilleuse } = props;
	const qp0 = props.qp0 * 1000;
	const becs = models.common.reduceParMois(props.becs) * 1000;

	// Accumulateur
	if (qgw) {
		const rgs =
			1 / (1 / rpn + (8592 * qp0 + qgw) / becs + 6970 * (pveilleuse / becs));
		return { rd, rgs, rg: 1, rs: 1 };
	}
	// Chauffe eau instantané
	let rg: number = 1 / rpn;
	rg += 1790 * (qp0 / becs);
	rg += 6970 * (pveilleuse / becs);
	rg = 1 / rg;
	return { rd, rgs: 1, rg: rg, rs: 1 };
}

/**
 * @guard {@linkcode models.ecs.generateur.isChaudiereElectrique} || {@linkcode models.ecs.generateur.isChauffeEauElectrique}
 * @returns Rendements du système électrique
 */
export function calcule_rendements_systeme_electrique(props: {
	rd: ReturnType<typeof calcule_rd>;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	becs: ReturnType<typeof installation.calcule_becs>;
	qgw: ReturnType<typeof generateur.calcule_qgw>;
	position_chauffe_eau: models.ecs.generateur.PositionChauffeEau | null;
	label_generateur: models.ecs.generateur.Label | null;
}): Rendements {
	const { position_chauffe_eau, label_generateur, rd, qgw } = props;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	const rg = props.type_generateur === TypeGenerateurEnum.chaudiere ? 0.97 : 1;
	const rs =
		position_chauffe_eau === PositionChauffeEauEnum.chauffe_eau_vertical &&
		label_generateur === LabelGenerateurEnum.ne_performance_c
			? 1.08 / (1 + (qgw * rd) / becs)
			: 1 / (1 + (qgw * rd) / becs);

	return { rd, rgs: 1, rg: rg, rs };
}

/**
 * @guard {@linkcode models.ecs.generateur.isChauffeEauThermodynamique} || {@linkcode models.ecs.generateur.isPACDoubleService}
 * @returns Rendements du système thermodynamique
 */
export function calcule_rendements_systeme_thermodynamique(props: {
	rd: ReturnType<typeof calcule_rd>;
	cop: ReturnType<typeof generateur.calcule_cop>;
}): Rendements {
	const { rd, cop } = props;
	return { rd, rgs: cop, rg: 1, rs: 1 };
}

/**
 * @param props.bouclage_reseau : Bouclage du réseau de distribution d'eau chaude sanitaire saisi
 * @returns Bouclage du réseau de distribution d'eau chaude sanitaire retenu
 */
export function set_bouclage_reseau(props: {
	bouclage_reseau: models.ecs.systeme.Bouclage | null;
}): models.ecs.systeme.Bouclage {
	const { bouclage_reseau } = props;
	return bouclage_reseau ?? models.ecs.systeme.BouclageEnum.non_boucle;
}

/**
 * @param props.isolation_reseau : Isolation du réseau de distribution d'eau chaude sanitaire saisie
 * @returns Isolation du réseau de distribution d'eau chaude sanitaire retenue
 */
export function set_isolation_reseau(props: {
	isolation_reseau: boolean | null;
}): boolean {
	const { isolation_reseau } = props;
	return isolation_reseau ?? false;
}
