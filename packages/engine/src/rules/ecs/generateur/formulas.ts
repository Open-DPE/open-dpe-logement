import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as climat from "#rules/climat/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as installation from "#rules/ecs/installation/formulas.js";
import * as systeme from "#rules/ecs/systeme/formulas.js";
import * as generateurChauffage from "#rules/chauffage/generateur/formulas.js";
import * as utils from "./utils.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import { reduceParMois } from "#utils/helpers.js";
import { evaluate } from "#utils/math.js";

/**
 * @doctrine ecs.generateur.cecs
 * @return Consommations du générateur d'eau chaude sanitaire en kWh/an
 */
export function calcule_cecs(props: {
	cecs: ReturnType<typeof systeme.calcule_cecs>[];
}): number {
	return props.cecs.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine ecs.generateur.caux
 * @return Consommations de l'auxiliaire de génération d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux(props: {
	becs: ReturnType<typeof ecs.calcule_becs>;
	pn: ReturnType<typeof calcule_pn>;
	paux: ReturnType<typeof calcule_paux>;
	rdim: ReturnType<typeof calcule_rdim>;
}): number {
	const { pn, paux, rdim } = props;
	const becs = reduceParMois(props.becs);
	return (paux * becs * rdim) / pn;
}

/**
 * @doctrine ecs.generateur.rdim
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
 * @doctrine ecs.generateur.pn
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
 * @doctrine ecs.generateur.pdim
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
 * @doctrine ecs.generateur.pecs
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
 * @doctrine ecs.generateur.paux
 * @see abaques.ecs.paux
 * @throws {ValeurForfaitaireError}
 * @return Puissance de l'auxiliaire de génération d'eau chaude sanitaire en kW
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
	return evaluate(match.paux, scope);
}

export type CopProps = {
	// Coefficient de performance énergétique saisi du générateur d'eau chaude sanitaire
	cop_saisi: number | null;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	annee_installation: ReturnType<typeof set_annee_installation>;
} & utils.GenerateurThermodynamique;

/**
 * @doctrine ecs.generateur.cop
 * @applicable si {@link utils.is_generateur_thermodynamique}
 * @see abaques.ecs.cop
 * @throws {ValeurForfaitaireError}
 * @return Coefficient de performance énergétique du générateur d'eau chaude sanitaire
 */
export function calcule_cop(props: CopProps): number {
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

export type CombustionProps = {
	rpn_saisi: number | null;
	qp0_saisi: number | null;
	pveilleuse_saisi: number | null;
	mode_combustion: ReturnType<typeof set_mode_combustion>;
	volume_stockage: ReturnType<typeof set_volume_stockage>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	pn: ReturnType<typeof calcule_pn>;
	presence_ventouse: ReturnType<typeof set_presence_ventouse>;
} & (utils.GenerateurCombustion | utils.PACHybride);

/**
 * @doctrine ecs.generateur.rpn
 * @doctrine ecs.generateur.qp0
 * @doctrine ecs.generateur.pveilleuse
 * @applicable si {@link utils.is_generateur_combustion} | {@link utils.is_pac_hybride}
 * @see abaques.ecs.combustion
 * @throws {ValeurForfaitaireError}
 * @return Performances des générateurs à combustion
 */
export function calcule_combustion(props: CombustionProps): Combustion {
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
		"bienergie_generateur" in props
			? props.bienergie_generateur
			: props.energie_generateur;

	const abaque = abaques.ecs.combustion;
	const match = abaque
		.search({ ...query, ...{ energie_generateur } }, abaque.load())
		.at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	const E = presence_ventouse ? 1.75 : 2.5;
	const F = presence_ventouse ? -0.55 : -0.8;
	const Pn = match.pn_max ? Math.min(match.pn_max, props.pn) : props.pn;
	const logPn = Math.log10(Pn);
	const scope = { E, F, Pn, logPn };

	combustion.rpn = combustion.rpn ?? evaluate(match.rpn, scope);
	combustion.qp0 = combustion.qp0 ?? evaluate(match.qp0, scope);
	combustion.pveilleuse = combustion.pveilleuse ?? match.pveilleuse;

	return combustion as Combustion;
}

/**
 * @doctrine ecs.generateur.cr
 * @see abaques.ecs.cr
 * @throws {ValeurForfaitaireError}
 * @return Coefficient de perte du ballon de stockage en Wh/l.°C.jour
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
 * @doctrine ecs.generateur.qgw
 * @return Pertes de stockage en Wh/an
 */
export function calcule_qgw(props: {
	energie_generateur: models.ecs.generateur.EnergieEcs;
	cr: ReturnType<typeof calcule_cr>;
	volume_stockage: ReturnType<typeof set_volume_stockage>;
}): number {
	const { energie_generateur, cr, volume_stockage } = props;
	if (volume_stockage === 0) return 0;
	return energie_generateur === models.ecs.generateur.EnergieEcsEnum.electricite
		? 8592 * (45 / 24) * volume_stockage * cr
		: 67662 * volume_stockage ** 0.55;
}

/**
 * @doctrine ecs.generateur.qgen
 * @param props.generateur_mixte : Générateur assurant la production d'eau chaude sanitaire et de chauffage
 * @return Pertes de génération du générateur d'eau chaude sanitaire en Wh/an
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
 * @return Type de générateur d'eau chaude sanitaire retenu
 */
export function set_type_generateur(props: {
	type_generateur: models.ecs.generateur.TypeGenerateur | null;
}): models.ecs.generateur.TypeGenerateur {
	const { type_generateur } = props;
	return type_generateur ?? models.ecs.generateur.TypeGenerateurEnum.chaudiere;
}

/**
 * @param props.energie_generateur : Energie du générateur d'eau chaude sanitaire saisie
 * @return Energie du générateur d'eau chaude sanitaire retenue
 */
export function set_energie_generateur(props: {
	energie_generateur: models.ecs.generateur.EnergieEcs | null;
}): models.ecs.generateur.EnergieEcs {
	const { energie_generateur } = props;
	return energie_generateur ?? models.ecs.generateur.EnergieEcsEnum.fioul;
}

/**
 * @param props.mode_combustion : Mode de combustion du générateur d'eau chaude sanitaire saisi
 * @return Mode de combustion du générateur d'eau chaude sanitaire retenu
 */
export function set_mode_combustion(props: {
	mode_combustion: models.ecs.generateur.ModeCombustion | null;
}): models.ecs.generateur.ModeCombustion {
	const { mode_combustion } = props;
	return mode_combustion ?? models.ecs.generateur.ModeCombustionEnum.standard;
}

/**
 * @param props.presence_ventouse : Présence d'une ventouse sur le générateur d'eau chaude sanitaire saisie
 * @return Présence d'une ventouse sur le générateur d'eau chaude sanitaire retenue
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
 * @return Année d'installation du générateur d'eau chaude sanitaire retenue
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
