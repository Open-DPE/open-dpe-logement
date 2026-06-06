import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "#rules/common/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as production from "#rules/production/formulas.js";
import * as generateur from "#rules/ecs/generateur/formulas.js";
import * as installation from "#rules/ecs/installation/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";

/**
 * @doctrine ecs.systeme.cef
 * @doctrine ecs.systeme.cep
 * @doctrine ecs.systeme.eges
 * @return Consommations par usage et par énergie du générateur d'eau chaude sanitaire
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
 * @doctrine ecs.systeme.cecs
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
 * @doctrine ecs.systeme.cecs_elec
 * @return Consommation d'électricité du système d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_elec(props: {
	cecs: ReturnType<typeof calcule_cecs>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
}): number {
	return props.energie_generateur === models.common.EnergieEnum.electricite
		? props.cecs
		: 0;
}

/**
 * @doctrine ecs.systeme.cecs_enr
 * @return Consommations d'électricité renouvelable du système d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	cecs_elec: ReturnType<typeof calcule_cecs_elec>;
}): number {
	const cecs_elec = props.cecs_elec;
	const celec = props.celec.ecs;
	const celec_ac = props.celec_ac.ecs;
	const p_celec_ac = celec ? cecs_elec / celec : 0;
	return celec_ac * p_celec_ac;
}

/**
 * @doctrine ecs.systeme.caux_dist
 * @return Consommation des auxiliaires de distribution d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_dist(props: {
	qcirb: ReturnType<typeof calcule_qcirb>;
	qtrac: ReturnType<typeof calcule_qtrac>;
}): number {
	return (props.qcirb + props.qtrac) / 1000;
}

/**
 * @doctrine ecs.systeme.caux_dist_enr
 * @return Consommations d'électricité renouvelable des auxiliaires de distribution d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_dist_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
}): number {
	const caux_dist = props.caux_dist;
	const celec = props.celec.auxiliaires_distribution;
	const celec_ac = props.celec_ac.auxiliaires_distribution;
	const p_celec_ac = celec ? caux_dist / celec : 0;
	return celec_ac * p_celec_ac;
}

/**
 * @doctrine ecs.systeme.qcirb
 * @param props.sh : Surface de l'installation d'eau chaude sanitaire en m²
 * @param props.installation_collective : Installation collective d'eau chaude sanitaire
 * @param props.niveaux_desservis : Nombre de niveaux desservis par l'installation d'eau chaude sanitaire
 * @return Consommations du circulateur d'eau chaude sanitaire en Wh/an
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
 * @doctrine ecs.systeme.qtrac
 * @return Consommation du traçeur d'eau chaude sanitaire en Wh/an
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
 * @doctrine ecs.systeme.rdim
 * @param props.n_systemes - Nombre de systèmes d'eau chaude sanitaire associés à l'installation
 * @returns Ratio de dimensionnement du système d'eau chaude sanitaire
 */
export function calcule_rdim(props: { n_systemes: number }): number {
	return props.n_systemes ? 1 / props.n_systemes : 0;
}

/**
 * @doctrine ecs.systeme.iecs
 * @returns Inverse du rendement du système d'eau chaude sanitaire
 */
export function calcule_iecs(props: {
	rd: ReturnType<typeof calcule_rd>;
	rg: ReturnType<typeof calcule_rendements>["rg"];
	rs: ReturnType<typeof calcule_rendements>["rs"];
	rgs: ReturnType<typeof calcule_rendements>["rgs"];
}): number {
	const { rd, rg, rs, rgs } = props;
	return rd * rg * rs * rgs;
}

/**
 * @doctrine ecs.systeme.rd
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

export const TYPES_SYSTEME = {
	chaudiere_mixte: "chaudiere_mixte",
	accumulateur_gaz: "accumulateur_gaz",
	chauffe_eau_gaz: "chauffe_eau_gaz",
	chauffe_eau_thermodynamique: "chauffe_eau_thermodynamique",
	pac_double_service: "pac_double_service",
	pac_hybride: "pac_hybride",
	chaudiere_electrique: "chaudiere_electrique",
	chauffe_eau_electrique: "chauffe_eau_electrique",
	reseau_chaleur: "reseau_chaleur",
} as const;

/**
 * @returns Type de système d'eau chaude sanitaire
 */
export function calcule_type_systeme(props: {
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
	bienergie: models.ecs.generateur.Bienergie | null;
	generateur_multi_batiment: boolean;
	volume_stockage: ReturnType<typeof generateur.set_volume_stockage>;
}): (typeof TYPES_SYSTEME)[keyof typeof TYPES_SYSTEME] {
	if (props.generateur_multi_batiment) return TYPES_SYSTEME.reseau_chaleur;

	const electricite = models.ecs.generateur.EnergieEcsEnum.electricite;

	switch (props.type_generateur) {
		case models.ecs.generateur.TypeGenerateurEnum.chaudiere: {
			return props.energie_generateur === electricite
				? TYPES_SYSTEME.chaudiere_electrique
				: TYPES_SYSTEME.chaudiere_mixte;
		}
		case models.ecs.generateur.TypeGenerateurEnum.poele_bouilleur: {
			return TYPES_SYSTEME.chaudiere_mixte;
		}
		case models.ecs.generateur.TypeGenerateurEnum.chauffe_eau: {
			if (props.energie_generateur === electricite)
				return TYPES_SYSTEME.chauffe_eau_electrique;
			return props.volume_stockage
				? TYPES_SYSTEME.accumulateur_gaz
				: TYPES_SYSTEME.chauffe_eau_gaz;
		}
		case models.ecs.generateur.TypeGenerateurEnum.cet_air_ambiant:
		case models.ecs.generateur.TypeGenerateurEnum.cet_air_exterieur:
		case models.ecs.generateur.TypeGenerateurEnum.cet_air_extrait: {
			return TYPES_SYSTEME.chauffe_eau_thermodynamique;
		}
		case models.ecs.generateur.TypeGenerateurEnum.pac_double_service: {
			return props.bienergie
				? TYPES_SYSTEME.pac_hybride
				: TYPES_SYSTEME.pac_double_service;
		}
		case models.ecs.generateur.TypeGenerateurEnum.reseau_chaleur: {
			return TYPES_SYSTEME.reseau_chaleur;
		}
	}
}

export type RendementsChaudiereMixteProps = {
	type_systeme: typeof TYPES_SYSTEME.chaudiere_mixte;
} & Parameters<typeof calcule_rendements_chaudiere_mixte>[0];

export type RendementsAccumulateurGazProps = {
	type_systeme: typeof TYPES_SYSTEME.accumulateur_gaz;
} & Parameters<typeof calcule_rendements_accumulateur_gaz>[0];

export type RendementsChauffeEauGazProps = {
	type_systeme: typeof TYPES_SYSTEME.chauffe_eau_gaz;
} & Parameters<typeof calcule_rendements_chauffe_eau_gaz>[0];

export type RendementsChauffeEauThermodynamiqueProps = {
	type_systeme: typeof TYPES_SYSTEME.chauffe_eau_thermodynamique;
} & Parameters<typeof calcule_rendements_generateur_thermodynamique>[0];

export type RendementsPACDoubleServiceProps = {
	type_systeme: typeof TYPES_SYSTEME.pac_double_service;
} & Parameters<typeof calcule_rendements_generateur_thermodynamique>[0];

export type RendementsPACHybrideProps = {
	type_systeme: typeof TYPES_SYSTEME.pac_hybride;
} & Parameters<typeof calcule_rendements_chaudiere_mixte>[0];

export type RendementsChaudiereElectriqueProps = {
	type_systeme: typeof TYPES_SYSTEME.chaudiere_electrique;
} & Parameters<typeof calcule_rendements_systeme_electrique>[0];

export type RendementsChauffeEauElectriqueProps = {
	type_systeme: typeof TYPES_SYSTEME.chauffe_eau_electrique;
} & Parameters<typeof calcule_rendements_systeme_electrique>[0];

export type RendementsReseauChaleurProps = {
	type_systeme: typeof TYPES_SYSTEME.reseau_chaleur;
} & Parameters<typeof calcule_rendements_reseau_chaleur>[0];

export type RendementsProps =
	| RendementsChaudiereMixteProps
	| RendementsAccumulateurGazProps
	| RendementsChauffeEauGazProps
	| RendementsChauffeEauThermodynamiqueProps
	| RendementsPACDoubleServiceProps
	| RendementsPACHybrideProps
	| RendementsChaudiereElectriqueProps
	| RendementsChauffeEauElectriqueProps
	| RendementsReseauChaleurProps;

export type Rendements = {
	// Rendement de génération
	rg: number;
	// Rendement de stockage
	rs: number;
	// rendement de génération et de stockage
	rgs: number;
};

/**
 * @doctrine ecs.systeme.rd
 * @doctrine ecs.systeme.rg
 * @doctrine ecs.systeme.rs
 * @doctrine ecs.systeme.rgs
 * @returns Rendements dy système
 */
export function calcule_rendements(props: RendementsProps): Rendements {
	switch (props.type_systeme) {
		case TYPES_SYSTEME.chaudiere_mixte:
		case TYPES_SYSTEME.pac_hybride:
			return calcule_rendements_chaudiere_mixte(props);
		case TYPES_SYSTEME.accumulateur_gaz:
			return calcule_rendements_accumulateur_gaz(props);
		case TYPES_SYSTEME.chauffe_eau_gaz:
			return calcule_rendements_chauffe_eau_gaz(props);
		case TYPES_SYSTEME.chauffe_eau_thermodynamique:
		case TYPES_SYSTEME.pac_double_service:
			return calcule_rendements_generateur_thermodynamique(props);
		case TYPES_SYSTEME.chaudiere_electrique:
		case TYPES_SYSTEME.chauffe_eau_electrique:
			return calcule_rendements_systeme_electrique(props);
		case TYPES_SYSTEME.reseau_chaleur:
			return calcule_rendements_reseau_chaleur(props);
	}
}

/**
 * @returns Rendements de la chaudière mixte
 */
export function calcule_rendements_chaudiere_mixte(props: {
	becs: ReturnType<typeof installation.calcule_becs>;
	qgw: ReturnType<typeof generateur.calcule_qgw>;
	rpn: ReturnType<typeof generateur.calcule_combustion>["rpn"];
	qp0: ReturnType<typeof generateur.calcule_combustion>["qp0"];
	pveilleuse: ReturnType<typeof generateur.calcule_combustion>["pveilleuse"];
}): Rendements {
	const qgw = props.qgw;
	const qp0 = (props.qp0 ?? 0) * 1000;
	const rpn = props.rpn ?? 0;
	const pveilleuse = props.pveilleuse ?? 0;
	const becs = models.common.reduceParMois(props.becs) * 1000;

	const rgs =
		1 /
		(1 / rpn + (1790 * qp0 + qgw) / becs + 6970 * ((0.5 * pveilleuse) / becs));
	return { rgs, rg: 1, rs: 1 };
}

/**
 * @returns Rendements de l'accumulateur gaz
 */
export function calcule_rendements_accumulateur_gaz(props: {
	becs: ReturnType<typeof installation.calcule_becs>;
	qgw: ReturnType<typeof generateur.calcule_qgw>;
	rpn: ReturnType<typeof generateur.calcule_combustion>["rpn"];
	qp0: ReturnType<typeof generateur.calcule_combustion>["qp0"];
	pveilleuse: ReturnType<typeof generateur.calcule_combustion>["pveilleuse"];
}): Rendements {
	const qgw = props.qgw;
	const qp0 = (props.qp0 ?? 0) * 1000;
	const rpn = props.rpn ?? 0;
	const pveilleuse = props.pveilleuse ?? 0;
	const becs = models.common.reduceParMois(props.becs) * 1000;

	const rgs =
		1 / (1 / rpn + (8592 * qp0 + qgw) / becs + 6970 * (pveilleuse / becs));
	return { rgs, rg: 1, rs: 1 };
}

/**
 * @returns Rendements du chauffe-eau gaz
 */
export function calcule_rendements_chauffe_eau_gaz(props: {
	becs: ReturnType<typeof installation.calcule_becs>;
	rpn: ReturnType<typeof generateur.calcule_combustion>["rpn"];
	qp0: ReturnType<typeof generateur.calcule_combustion>["qp0"];
	pveilleuse: ReturnType<typeof generateur.calcule_combustion>["pveilleuse"];
}): Rendements {
	const qp0 = (props.qp0 ?? 0) * 1000;
	const rpn = props.rpn ?? 0;
	const pveilleuse = props.pveilleuse ?? 0;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	let rg: number = 1 / rpn;
	rg += 1790 * (qp0 / becs);
	rg += 6970 * (pveilleuse / becs);
	rg = 1 / rg;
	return { rgs: 1, rg: rg, rs: 1 };
}

/**
 * @return Rendements du réseau de chaleur et des générateurs multi-bâtiment
 */
export function calcule_rendements_reseau_chaleur(props: {
	isolation_reseau: ReturnType<typeof set_isolation_reseau>;
}): Rendements {
	const rgs = props.isolation_reseau ? 0.9 : 0.75;
	return { rgs, rg: 1, rs: 1 };
}

/**
 * @param props.position_chauffe_eau : Position du chauffe-eau
 * @param props.label_generateur : Label du générateur d'eau chaude sanitaire
 * @return Rendements du système électrique
 */
export function calcule_rendements_systeme_electrique(props: {
	type_systeme:
		| typeof TYPES_SYSTEME.chaudiere_electrique
		| typeof TYPES_SYSTEME.chauffe_eau_electrique;
	becs: ReturnType<typeof installation.calcule_becs>;
	rd: ReturnType<typeof calcule_rd>;
	qgw: ReturnType<typeof generateur.calcule_qgw>;
	position_chauffe_eau: models.ecs.generateur.PositionChauffeEau | null;
	label_generateur: models.ecs.generateur.Label | null;
}): Rendements {
	const { position_chauffe_eau, label_generateur, rd, qgw } = props;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	const chauffe_eau_vertical =
		models.ecs.generateur.PositionChauffeEauEnum.chauffe_eau_vertical;
	const ne_performance_c = models.ecs.generateur.LabelEnum.ne_performance_c;

	const rg =
		props.type_systeme === TYPES_SYSTEME.chaudiere_electrique ? 0.97 : 1;

	const rs =
		position_chauffe_eau === chauffe_eau_vertical &&
		label_generateur === ne_performance_c
			? 1.08 / (1 + (qgw * rd) / becs)
			: 1 / (1 + (qgw * rd) / becs);

	return { rgs: 1, rg: rg, rs };
}

export function calcule_rendements_generateur_thermodynamique(props: {
	cop: ReturnType<typeof generateur.calcule_cop>;
}): Rendements {
	return { rgs: props.cop ?? 0, rg: 1, rs: 1 };
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
