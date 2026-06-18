import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "../../common/formulas.js";
import type * as climat from "../../climat/formulas.js";
import type * as production from "../../production/formulas.js";
import type * as chauffage from "../formulas.js";
import type * as emetteur from "../emetteur/formulas.js";
import type * as installation from "../installation/formulas.js";
import type * as systeme from "../systeme/formulas.js";
import type * as generateurEcs from "../../ecs/generateur/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";
import { createParMois } from "../../helpers.js";
import { evaluate } from "../../math.js";

/**
 * @formule chauffage.generateur.cef
 * @formule chauffage.generateur.cep
 * @formule chauffage.generateur.eges
 * @return Consommations par usage et par énergie du générateur de chauffage
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
 * @formule chauffage.generateur.cch
 * @return Consommations du générateur chauffage en kWh/an
 */
export function calcule_cch(props: {
	cch: ReturnType<typeof systeme.calcule_cch>[];
}): number {
	return props.cch.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule chauffage.generateur.cch_elec
 * @return Consommation d'électricité du générateur chauffage en kWh/an
 */
export function calcule_cch_elec(props: {
	cch_elec: ReturnType<typeof systeme.calcule_cch_elec>[];
}): number {
	return props.cch_elec.reduce((acc, val) => acc + val, 0);
}

/**
 * @formule chauffage.generateur.caux_gen
 * @return Consommations de l'auxiliaire de génération de chauffage en kWh/an
 */
export function calcule_caux_gen(props: {
	bch: ReturnType<typeof chauffage.calcule_bch>;
	pn: ReturnType<typeof calcule_pn>;
	paux: ReturnType<typeof calcule_paux>;
	rdim: ReturnType<typeof calcule_rdim>;
}): number {
	const { pn, rdim } = props;
	const paux = props.paux / 1000;
	const bch = models.common.reduceParMois(props.bch);
	return (paux * bch * rdim) / pn;
}

/**
 * @formule chauffage.generateur.caux_gen_enr
 * @return Consommations d'électricité renouvelable de l'auxiliaire de génération de chauffage en kWh/an
 */
export function calcule_caux_gen_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	caux_gen: ReturnType<typeof calcule_caux_gen>;
}): number {
	return common.calcule_cener({
		celec: props.celec,
		celec_ac: props.celec_ac,
		usage: models.production.UsageElectriciteEnum.chauffage,
		cef: props.caux_gen,
	});
}

/**
 * @formule chauffage.generateur.rdim
 * @returns Ratio de dimensionnement du générateur de chauffage
 */
export function calcule_rdim(props: {
	systemes: {
		rdim: ReturnType<typeof systeme.dimensionnement.calcule_rdim>;
		rdim_installation: ReturnType<typeof installation.calcule_rdim>;
	}[];
}): number {
	const { systemes } = props;
	return systemes.reduce((acc, s) => acc + s.rdim * s.rdim_installation, 0);
}

/**
 * @formule chauffage.generateur.pn
 * @param props.pn_saisi : Puissance nominale saisie du générateur de chauffage en kW
 * @returns Puissance nominale conventionnelle du générateur de chauffage en kW
 */
export function calcule_pn(props: {
	pn_saisi: number | null;
	pdim: ReturnType<typeof calcule_pdim>;
}): number {
	const { pn_saisi, pdim } = props;
	return pn_saisi ?? pdim;
}

/**
 * @formule chauffage.generateur.pdim
 * @returns Puissance de dimensionnement du générateur en kW
 */
export function calcule_pdim(props: {
	pch: ReturnType<typeof calcule_pch>;
	pecs: ReturnType<typeof generateurEcs.calcule_pecs> | null;
}): number {
	const { pch, pecs } = props;
	return pecs ? Math.max(pch, pecs) : pch;
}

/**
 * @formule chauffage.generateur.pch
 * @param props.pn_saisi: Puissance nominale saisie du générateur de chauffage en kW
 * @return Puissance de chauffage du générateur de chauffage en kW
 */
export function calcule_pch(props: {
	pn_saisi: number | null;
	pch_systemes: ReturnType<typeof systeme.calcule_pch>[];
}): number {
	const { pn_saisi, pch_systemes } = props;
	return pn_saisi ?? pch_systemes.reduce((acc, p) => acc + p, 0);
}

/**
 * @formule chauffage.generateur.paux
 * @see abaques.chauffage.paux
 * @throws {ValeurForfaitaireError}
 * @return Puissance de l'auxiliaire de génération de chauffage en W
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
	const abaque = abaques.chauffage.paux;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	const G = match.G;
	const H = match.H;
	const Pn = match.pn_max ? Math.min(match.pn_max, pn) : pn;
	const scope = { G, H, Pn };
	return evaluate(String(match.paux), scope);
}

export type Combustion = {
	// Rendement à charge intermédiaire
	rpint: number;
	// Rendement à pleine charge
	rpn: number;
	// Pertes à l'arrêt en kW
	qp0: number;
	// Puissance de la veilleuse en W
	pveilleuse: number;
};

/**
 * @formule chauffage.generateur.rpint
 * @formule chauffage.generateur.rpn
 * @formule chauffage.generateur.qp0
 * @formule chauffage.generateur.pveilleuse
 *
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isChaudiereCombustion} ||
 * 	- {@linkcode models.chauffage.generateur.isPoeleBouilleur} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurAirChaudCombustion} ||
 * 	- {@linkcode models.chauffage.generateur.isRadiateurGaz} ||
 * 	- {@linkcode models.chauffage.generateur.isPACHybride} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurCollectifInconnu}
 *
 * @see abaques.chauffage.combustion
 * @throws {ValeurForfaitaireError}
 * @return Performances du générateur de chauffage à combustion
 */
export function calcule_combustion(props: {
	rpint_saisi: number | null;
	rpn_saisi: number | null;
	qp0_saisi: number | null;
	pveilleuse_saisi: number | null;
	type_generateur: ReturnType<typeof set_type_generateur>;
	energie_generateur: ReturnType<typeof set_energie_generateur>;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
	mode_combustion: ReturnType<typeof set_mode_combustion>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	pn: ReturnType<typeof calcule_pn>;
	presence_ventouse: ReturnType<typeof set_presence_ventouse>;
}): Combustion {
	const {
		rpint_saisi,
		rpn_saisi,
		qp0_saisi,
		pveilleuse_saisi,
		presence_ventouse,
		...query
	} = props;

	const combustion: Partial<Combustion> = {};

	if (rpint_saisi) combustion.rpint = rpint_saisi;
	if (rpn_saisi) combustion.rpn = rpn_saisi;
	if (qp0_saisi) combustion.qp0 = qp0_saisi;
	if (pveilleuse_saisi) combustion.pveilleuse = pveilleuse_saisi;

	if (Object.keys(combustion).length === 4) {
		return combustion as Combustion;
	}

	const energie_generateur =
		props.bienergie_generateur ?? props.energie_generateur;
	const q = { ...query, energie_generateur };
	const abaque = abaques.chauffage.combustion;
	const match = abaque.search(q, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(q);

	const E = presence_ventouse ? 1.75 : 2.5;
	const F = presence_ventouse ? -0.55 : -0.8;
	const Pn = match.pn_max ? Math.min(match.pn_max, query.pn) : query.pn;
	const logPn = Math.log10(Pn);
	const scope = { E, F, Pn, logPn };

	combustion.rpint = combustion.rpint ?? evaluate(String(match.rpint), scope);
	combustion.rpn = combustion.rpn ?? evaluate(String(match.rpn), scope);
	combustion.qp0 = combustion.qp0 ?? evaluate(String(match.qp0), scope);
	combustion.pveilleuse = combustion.pveilleuse ?? match.pveilleuse;

	return combustion as Combustion;
}

/**
 * @formule chauffage.generateur.scop
 *
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isPAC} ||
 * 	- {@linkcode models.chauffage.generateur.isPACHybride}
 *
 * @see abaques.chauffage.scop
 * @throws {ValeurForfaitaireError}
 * @return Coefficient de performance énergétique saisonnier SCOP
 */
export function calcule_scop(props: {
	scop_saisi: number | null;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	type_generateur: ReturnType<typeof set_type_generateur>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	types_emetteur: models.chauffage.emetteur.TypeEmetteur[];
}): number {
	const { scop_saisi } = props;
	if (scop_saisi) return scop_saisi;
	const { zone_climatique, type_generateur, annee_installation } = props;
	const types_emetteur = [...new Set(props.types_emetteur)];
	const abaque = abaques.chauffage.scop;

	if (types_emetteur.length === 0) {
		const query = { zone_climatique, type_generateur, annee_installation };
		const match = abaque.search(query, abaque.load()).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.scop;
	}
	const values = types_emetteur.map((type_emetteur) => {
		const query = {
			zone_climatique,
			type_generateur,
			annee_installation,
			type_emetteur,
		};
		const match = abaque.search(query, abaque.load()).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.scop;
	});
	return Math.min(...values);
}

/**
 * @formule chauffage.generateur.tfonc30
 *
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isChaudiereCombustion} ||
 * 	- {@linkcode models.chauffage.generateur.isPoeleBouilleur} ||
 * 	- {@linkcode models.chauffage.generateur.isPACHybride} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurCollectifInconnu}
 *
 * @return Température de fonctionnement à 30% de charge en °C
 */
export function calcule_tfonc30(props: {
	tfonc30_saisi: number | null;
	mode_combustion: ReturnType<typeof set_mode_combustion>;
	annee_installation_generateur: ReturnType<typeof set_annee_installation>;
	emetteurs: {
		temperature_distribution: ReturnType<
			typeof emetteur.set_temperature_distribution
		>;
		annee_installation: ReturnType<typeof emetteur.set_annee_installation>;
	}[];
}): number {
	if (props.tfonc30_saisi) return props.tfonc30_saisi;

	const { mode_combustion, annee_installation_generateur } = props;
	const abaque = abaques.chauffage.tfonc30;

	// Valeur par défaut en l'absence d'émetteurs de chauffage
	if (props.emetteurs.length === 0) {
		const query = {
			mode_combustion,
			temperature_distribution:
				models.chauffage.emetteur.TemperatureDistributionEnum.haute,
			annee_installation_emetteur: annee_installation_generateur,
			annee_installation_generateur,
		};
		const match = abaque.search(query, abaque.load()).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.tfonc30;
	}
	// tfonc30 la plus contraignante parmi les émetteurs de chauffage
	const values = props.emetteurs.map(
		({ temperature_distribution, annee_installation }) => {
			const query = {
				mode_combustion,
				temperature_distribution,
				annee_installation_emetteur: annee_installation,
				annee_installation_generateur,
			};
			const match = abaque.search(query, abaque.load()).at(0);
			if (!match) throw new ValeurForfaitaireError(query);
			return match.tfonc30;
		},
	);
	return Math.max(...values);
}

/**
 * @formule chauffage.generateur.tfonc100
 *
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isChaudiereCombustion} ||
 * 	- {@linkcode models.chauffage.generateur.isPoeleBouilleur} ||
 * 	- {@linkcode models.chauffage.generateur.isPACHybride} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurCollectifInconnu}
 *
 * @return Température de fonctionnement à 100% de charge en °C
 */
export function calcule_tfonc100(props: {
	tfonc100_saisi: number | null;
	annee_installation_generateur: ReturnType<typeof set_annee_installation>;
	emetteurs: {
		temperature_distribution: ReturnType<
			typeof emetteur.set_temperature_distribution
		>;
		annee_installation: ReturnType<typeof emetteur.set_annee_installation>;
	}[];
}): number {
	if (props.tfonc100_saisi) return props.tfonc100_saisi;

	const abaque = abaques.chauffage.tfonc100;
	// Valeur par défaut en l'absence d'émetteurs de chauffage
	if (props.emetteurs.length === 0) {
		const query = {
			temperature_distribution:
				models.chauffage.emetteur.TemperatureDistributionEnum.haute,
			annee_installation_emetteur: props.annee_installation_generateur,
		};
		const match = abaque.search(query, abaque.load()).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.tfonc100;
	}
	// tfonc100 la plus contraignante parmi les émetteurs de chauffage
	const values = props.emetteurs.map(
		({ temperature_distribution, annee_installation }) => {
			const query = {
				annee_installation_emetteur: annee_installation,
				temperature_distribution,
			};
			const match = abaque.search(query, abaque.load()).at(0);
			if (!match) throw new ValeurForfaitaireError(query);
			return match.tfonc100;
		},
	);
	return Math.max(...values);
}

/**
 * @formule chauffage.generateur.qgen_rec
 * @param props.generateur_mixte : Générateur assurant la production de chauffage et d'eau chaude sanitaire
 * @return Pertes de génération récupérables du générateur de chauffage en Wh/mois
 */
export function calcule_qgen_rec(props: {
	generateur_mixte: boolean;
	qgen: ReturnType<typeof calcule_qgen>;
	pn: ReturnType<typeof calcule_pn>;
	nref: ReturnType<typeof chauffage.calcule_nref>;
	bch_hp: ReturnType<typeof chauffage.calcule_bch_hp>;
}): models.common.ParMois<number> {
	const { generateur_mixte, qgen, pn } = props;
	return createParMois((mois) => {
		const nref = props.nref[mois];
		const bch_hp = props.bch_hp[mois];
		const dper = generateur_mixte
			? Math.min(nref, (1.3 * bch_hp) / (0.3 * pn) + nref * (1790 / 8760))
			: Math.min(nref, (1.3 * bch_hp) / (0.3 * pn));
		return qgen * dper;
	});
}

/**
 * @formule chauffage.generateur.qgen
 * @return Pertes de génération du générateur de chauffage en Wh/an
 */
export function calcule_qgen(props: {
	presence_ventouse: ReturnType<typeof set_presence_ventouse>;
	qp0: ReturnType<typeof calcule_combustion>["qp0"] | null;
}): number {
	const qp0 = (props.qp0 ?? 0) * 1000;
	const cper = props.presence_ventouse ? 0.75 : 5;
	return 0.48 * cper * qp0;
}

/**
 * @see calcule_qpx_chaudiere_combustion
 * @see calcule_qpx_autres
 */
export type QPx = {
	// Pertes à 30% de charge en W
	qp30: number;
	// Pertes à 50% de charge en W
	qp50: number;
	// Pertes à 100% de charge en W
	qp100: number;
};

/**
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isChaudiereGaz} ||
 * 	- {@linkcode models.chauffage.generateur.isChaudiereFioul} ||
 * 	- {@linkcode models.chauffage.generateur.isPACHybride} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurCollectifInconnu}
 */
export function calcule_qpx_chaudiere_combustion(props: {
	pn: ReturnType<typeof calcule_pn>;
	rpn: ReturnType<typeof calcule_combustion>["rpn"];
	rpint: ReturnType<typeof calcule_combustion>["rpint"];
	kpcs: ReturnType<typeof common.calcule_kpcs>;
	mode_combustion: ReturnType<typeof set_mode_combustion>;
	presence_regulation: ReturnType<typeof set_presence_regulation>;
	tfonc30: ReturnType<typeof calcule_tfonc30>;
	tfonc100: ReturnType<typeof calcule_tfonc100>;
}): Pick<QPx, "qp30" | "qp100"> {
	switch (props.mode_combustion) {
		case models.chauffage.generateur.ModeCombustionEnum.standard: {
			const { pn, tfonc30, tfonc100, presence_regulation, kpcs } = props;
			const rpint = (props.rpint * 100) / kpcs;
			const rpn = (props.rpn * 100) / kpcs;
			const qp30 = presence_regulation
				? 0.3 *
					pn *
					((100 - (rpint + 0.1 * (50 - tfonc30))) /
						(rpint + 0.1 * (50 - tfonc30)))
				: 0.3 *
					pn *
					((100 - (rpint + 0.1 * (50 - tfonc100))) /
						(rpint + 0.1 * (50 - tfonc100)));
			const qp100 =
				pn *
				((100 - (rpn + 0.1 * (70 - tfonc100))) / (rpn + 0.1 * (70 - tfonc100)));

			return { qp30, qp100 };
		}
		case models.chauffage.generateur.ModeCombustionEnum.basse_temperature:
		case models.chauffage.generateur.ModeCombustionEnum.condensation: {
			const { pn, tfonc30, tfonc100, presence_regulation, kpcs } = props;
			const rpint = (props.rpint * 100) / kpcs;
			const rpn = (props.rpn * 100) / kpcs;
			const qp30 = presence_regulation
				? 0.3 *
					pn *
					((100 - (rpint + 0.2 * (33 - tfonc30))) /
						(rpint + 0.2 * (33 - tfonc30)))
				: 0.3 *
					pn *
					((100 - (rpint + 0.2 * (33 - tfonc100))) /
						(rpint + 0.2 * (33 - tfonc100)));
			const qp100 =
				pn *
				((100 - (rpn + 0.1 * (70 - tfonc100))) / (rpn + 0.1 * (70 - tfonc100)));

			return { qp30, qp100 };
		}
	}
}

/**
 * @guard :
 * 	- {@linkcode models.chauffage.generateur.isChaudiereCharbon} ||
 * 	- {@linkcode models.chauffage.generateur.isChaudiereBois} ||
 * 	- {@linkcode models.chauffage.generateur.isPoeleBouilleur} ||
 * 	- {@linkcode models.chauffage.generateur.isGenerateurAirChaudCombustion}
 */
export function calcule_qpx_autres(props: {
	pn: ReturnType<typeof calcule_pn>;
	rpn: ReturnType<typeof calcule_combustion>["rpn"];
	rpint: ReturnType<typeof calcule_combustion>["rpint"];
	kpcs: ReturnType<typeof common.calcule_kpcs>;
}): Pick<QPx, "qp50" | "qp100"> {
	const { pn, kpcs } = props;
	const rpint = (props.rpint * 100) / kpcs;
	const rpn = (props.rpn * 100) / kpcs;
	const qp50 = 0.5 * pn * ((100 - rpint) / rpint);
	const qp100 = pn * ((100 - rpn) / rpn);
	return { qp50, qp100 };
}

/**
 * @param props.type_generateur : Type de générateur de chauffage saisi
 * @return Type de générateur de chauffage retenu
 */
export function set_type_generateur(props: {
	type_generateur: models.chauffage.generateur.TypeGenerateur | null;
}): models.chauffage.generateur.TypeGenerateur {
	const { type_generateur } = props;
	return (
		type_generateur ?? models.chauffage.generateur.TypeGenerateurEnum.chaudiere
	);
}

/**
 * @param props.energie_generateur : Energie du générateur de chauffage saisie
 * @return Energie du générateur de chauffage retenue
 */
export function set_energie_generateur(props: {
	energie_generateur: models.chauffage.generateur.EnergieChauffage | null;
}): models.chauffage.generateur.EnergieChauffage {
	const { energie_generateur } = props;
	return (
		energie_generateur ?? models.chauffage.generateur.EnergieChauffageEnum.fioul
	);
}

/**
 * @param props.mode_combustion : Mode de combustion du générateur de chauffage saisi
 * @return Mode de combustion du générateur de chauffage retenu
 */
export function set_mode_combustion(props: {
	mode_combustion: models.chauffage.generateur.ModeCombustion | null;
}): models.chauffage.generateur.ModeCombustion {
	const { mode_combustion } = props;
	return (
		mode_combustion ?? models.chauffage.generateur.ModeCombustionEnum.standard
	);
}

/**
 * @param props.presence_ventouse : Présence d'une ventouse sur le générateur de chauffage saisie
 * @return Présence d'une ventouse sur le générateur de chauffage retenue
 */
export function set_presence_ventouse(props: {
	presence_ventouse: boolean | null;
}): boolean {
	const { presence_ventouse } = props;
	return presence_ventouse ?? false;
}

/**
 * @param props.presence_regulation : Présence d'une régulation de combustion sur le générateur de chauffage saisie
 * @return Présence d'une régulation de combustion sur le générateur de chauffage retenue
 */
export function set_presence_regulation(props: {
	presence_regulation: boolean | null;
}): boolean {
	const { presence_regulation } = props;
	return presence_regulation ?? false;
}

/**
 * @param props.annee_installation : Année d'installation du générateur de chauffage saisie
 * @param props.annee_construction_batiment : Année de construction du bâtiment
 * @return Année d'installation du générateur de chauffage retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}
