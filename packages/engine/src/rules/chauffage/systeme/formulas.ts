import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "#rules/common/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as enveloppe from "#rules/enveloppe/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as production from "#rules/production/formulas.js";
import * as emetteur from "#rules/chauffage/emetteur/formulas.js";
import * as installation from "#rules/chauffage/installation/formulas.js";
import * as generateur from "#rules/chauffage/generateur/formulas.js";
import * as combustion from "./formulas/combustion.js";
import * as emission from "./formulas/emission.js";
import * as utils from "./utils.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import { createParMois } from "#utils/helpers.js";

export { combustion, emission, utils };

export const ROLES = {
	base: "base",
	releve: "releve",
	appoint: "appoint",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

export type Configuration = {
	[ROLES.base]: number;
	[ROLES.releve]: number;
	[ROLES.appoint]: number;
};

/**
 * @formule chauffage.systeme.cef
 * @formule chauffage.systeme.cep
 * @formule chauffage.systeme.eges
 * @return Consommations par usage et par énergie du générateur de chauffage
 */
export function calcule_consommations(props: {
	cch: ReturnType<typeof calcule_cch>;
	cch_enr: ReturnType<typeof calcule_cch_enr>;
	caux_dist: ReturnType<typeof calcule_caux_dist>;
	caux_dist_enr: ReturnType<typeof calcule_caux_dist_enr>;
	energie: models.chauffage.generateur.EnergieChauffage;
	reseau_id: string | null;
}): models.common.Consommations {
	return models.common.mergeConsommations(
		common.calcule_consommations({
			cef: props.cch,
			cef_enr: props.cch_enr,
			usage: models.common.UsageEnum.chauffage,
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
 * @formule chauffage.systeme.cch
 * @return Consommations du système de chauffage en kWh/an
 */
export function calcule_cch(props: {
	cch1: ReturnType<typeof calcule_cch1>;
	cch2: ReturnType<typeof calcule_cch2> | null;
}): number {
	return props.cch1 + (props.cch2 ?? 0);
}

/**
 * @formule chauffage.systeme.cch_elec
 * @return Consommation d'électricité du système de chauffage en kWh/an
 */
export function calcule_cch_elec(props: {
	cch1: ReturnType<typeof calcule_cch1>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
}): number {
	return props.energie_generateur === models.common.EnergieEnum.electricite
		? props.cch1
		: 0;
}

/**
 * @formule chauffage.systeme.cch_enr
 * @return Consommations d'électricité renouvelable du système de chauffage en kWh/an
 */
export function calcule_cch_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	cch_elec: ReturnType<typeof calcule_cch_elec>;
}): number {
	const cch_elec = props.cch_elec;
	const celec = props.celec.chauffage;
	const celec_ac = props.celec_ac.chauffage;
	const p_celec_ac = celec ? cch_elec / celec : 0;
	return celec_ac * p_celec_ac;
}

/**
 * @formule chauffage.systeme.cch2
 * @return Consommations de chauffage du système de chauffage (partie PAC pour les PAC hybrides) en kWh/an
 */
export function calcule_cch1(props: {
	cch1: ReturnType<typeof emission.calcule_cch1>[];
}): number {
	return props.cch1.reduce((acc, cch1) => acc + cch1, 0);
}

/**
 * @formule chauffage.systeme.cch2
 * @return Consommations de chauffage du système de chauffage (partie chaudière pour les PAC hybrides) en kWh/an
 */
export function calcule_cch2(props: {
	cch2: ReturnType<typeof emission.calcule_cch2>[];
}): number {
	return props.cch2.reduce((acc, cch2) => acc + cch2, 0);
}

/**
 * @formule chauffage.systeme.caux_dist
 * @return Consommations du circulateur de l'installation de chauffage en kWh/an
 */
export function calcule_caux_dist(props: {
	pcircem: ReturnType<typeof calcule_pcircem>;
	nref: ReturnType<typeof chauffage.calcule_nref>;
}): number {
	const { pcircem } = props;
	const nref = models.common.reduceParMois(props.nref);
	return (pcircem * nref) / 1000;
}

/**
 * @formule chauffage.systeme.caux_dist_enr
 * @return Consommations d'électricité renouvelable des auxiliaires de distribution de chauffage en kWh/an
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
 * @return Facteur d'intermittence moyen du système de chauffage
 */
export function calcule_int(props: {
	int: ReturnType<typeof calcule_int>[];
}): number {
	return props.int.reduce((acc, int) => acc + int, 0) / props.int.length;
}

/**
 * @return Inverse du rendement moyen du système de chauffage
 */
export function calcule_ich(props: {
	ich: ReturnType<typeof calcule_ich>[];
}): number {
	return props.ich.reduce((acc, ich) => acc + ich, 0) / props.ich.length;
}

/**
 * @param props.installation_collective : Installation collective ou individuelle
 * @param props.generateur_individuel : Générateur individuel ou collectif
 * @param props.systemes : Autres systèmes de chauffage associés à l'installation de chauffage
 * @param props.systemes[].generateur_individuel : Générateur individuel ou collectif
 * @return Besoins de chauffage en kWh/mois
 */
export function calcule_bch(props: {
	bch: ReturnType<typeof installation.calcule_bch>;
	dht: ReturnType<typeof calcule_dht>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	installation_collective: boolean;
	generateur_individuel: boolean;
	systemes: { generateur_individuel: boolean }[];
}): models.common.ParMois<number> {
	const { installation_collective, generateur_individuel } = props;
	const systemes = props.systemes.filter(
		(s) => s.generateur_individuel === generateur_individuel,
	);

	// Installation de chauffage collectif avec base + appoint
	if (
		installation_collective &&
		(generateur_individuel || systemes.length > 0)
	) {
		return createParMois((mois) => {
			const dht = props.dht[mois];
			const dh14 = props.sollicitations[mois].dh14;
			const bch = props.bch[mois];
			return generateur_individuel
				? bch * (dht / dh14)
				: bch * (1 - dht / dh14);
		});
	}
	// Autres cas
	return props.bch;
}

type ConfigurationSystemeProps = {
	type_systeme: models.chauffage.systeme.TypeSysteme;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
	generateur_multi_batiment: boolean;
	generateur_collectif: boolean;
	pn_saisi: number | null;
	role?: ReturnType<typeof calcule_role>;
};

/**
 * @return Ratio de dimensionnement du système de chauffage
 */
export function calcule_rdim(props: {
	systeme: Required<ConfigurationSystemeProps>;
	systemes: Required<ConfigurationSystemeProps>[];
}): number {
	const systeme = props.systeme;
	const systemes = props.systemes.filter(
		(s) => s.generateur_collectif === systeme.generateur_collectif,
	);

	const configuration = calcule_configuration({
		systemes: [...systemes, systeme],
	});
	const systemes_role = systemes.filter((s) => s.role === systeme.role);
	const rdim = configuration[systeme.role];

	// Les puissances nominales sont connues pour tous les systèmes
	if (
		systemes_role.every((s) => s.pn_saisi !== null) &&
		systeme.pn_saisi !== null
	) {
		const somme_pn =
			systemes_role.reduce((acc, s) => acc + (s.pn_saisi ?? 0), 0) +
			systeme.pn_saisi;
		return rdim * (systeme.pn_saisi / somme_pn);
	}
	const n = systemes_role.length + 1;
	return rdim * (1 / n);
}

/**
 * @return Rôle du système de chauffage (base, relève ou appoint)
 */
export function calcule_role(props: {
	systemes: ConfigurationSystemeProps[];
	systeme: ConfigurationSystemeProps;
}): Role {
	const systeme = props.systeme;
	const systemes = props.systemes.filter(
		(s) => s.generateur_collectif === systeme.generateur_collectif,
	);
	const { base, releve, appoint } = calcule_configuration({
		systemes: [...systemes, systeme],
	});

	if (base === 1 || (releve === 0 && appoint === 0)) return ROLES.base;
	if (appoint > 0 && utils.is_appoint({ systemes, systeme }))
		return ROLES.appoint;
	if (releve > 0 && utils.is_releve({ systemes, systeme })) return ROLES.releve;
	// Système en base
	return ROLES.base;
}

/**
 * @param props.systemes : Systèmes de chauffage individuels OU collectifs associés à l'installation
 * @return Configuration de l'installation de chauffage
 */
export function calcule_configuration(props: {
	systemes: ConfigurationSystemeProps[];
}): Configuration {
	const { systemes } = props;

	if (systemes.length <= 1) return { base: 1, releve: 0, appoint: 0 };

	const appoint = utils.has_appoint(systemes) ? 0.25 : 0;
	const releve = utils.has_releve_chaudieres_bois(systemes)
		? 0.25 * (1 - appoint)
		: utils.has_releve_pac(systemes)
			? 0.2 * (1 - appoint)
			: 0;

	const base = 1 - appoint - releve;
	return { base, releve, appoint };
}

/**
 * @param props.installation_collective: Installation collective
 * @param props.generateur_individuel: Générateur individuel
 * @param props.systemes: Autres systèmes de chauffage associés à l'installation de chauffage
 * @param props.systemes[].generateur_individuel: Générateur individuel
 */
export function calcule_pch(props: {
	pch_installation: ReturnType<typeof installation.calcule_pch>;
	installation_collective: boolean;
	generateur_individuel: boolean;
	systemes: { generateur_individuel: boolean }[];
}): number {
	const { pch_installation, installation_collective, generateur_individuel } =
		props;
	const systemes = props.systemes.filter(
		(s) => s.generateur_individuel === generateur_individuel,
	);
	const N = systemes.length + 1;
	return installation_collective && generateur_individuel
		? 0.5 * pch_installation * (1 / N)
		: pch_installation * (1 / N);
}

/**
 * @return Puissance émise utile du système de chauffage collectif en kW
 */
export function calcule_pe(props: {
	pn: ReturnType<typeof generateur.calcule_pn>;
	rd: ReturnType<typeof calcule_rd>;
	re: ReturnType<typeof calcule_re>;
	rr: ReturnType<typeof calcule_rr>;
}): number {
	const { pn, rd, re, rr } = props;
	return pn * rd * re * rr;
}

/**
 * @return Degré heure base T en °C.h/mois
 */
export function calcule_dht(props: {
	tbase: ReturnType<typeof climat.calcule_tbase>;
	t: ReturnType<typeof calcule_t>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
	nref: ReturnType<typeof chauffage.calcule_nref>;
}): models.common.ParMois<number> {
	const { tbase } = props;
	return createParMois((mois) => {
		const t = props.t[mois];
		const text = props.sollicitations[mois].text;
		const nref = props.nref[mois];
		if (null === text) return 0;
		const x = 0.5 * ((t - tbase) / (text - tbase));
		return (
			nref * (text - tbase) * x ** 5 * (14 - 28 * x + 20 * x ** 2 - 5 * x ** 3)
		);
	});
}

/**
 * @return Température de dimensionnement du système de chauffage collectif en °C/mois
 */
export function calcule_t(props: {
	bch: ReturnType<typeof installation.calcule_bch>;
	pe: ReturnType<typeof calcule_pe>;
	sollicitations: ReturnType<typeof climat.calcule_sollicitations>;
}): models.common.ParMois<number> {
	const { pe } = props;
	return createParMois((mois) => {
		const bch = props.bch[mois];
		const dh14 = props.sollicitations[mois].dh14;
		return 14 - (pe * dh14) / bch;
	});
}

/**
 * @param props.type_distribution - Type de distribution du système de chauffage
 * @param props.presence_fluide_frigorigene - Présence de fluide frigorigène dans le réseau de chauffage
 * @param props.reseau_collectif - Système de chauffage collectif ou individuel
 * @return Rendement de distribution du système de chauffage
 */
export function calcule_rd(props: {
	type_distribution: models.chauffage.systeme.TypeDistribution | null;
	temperature_distribution: ReturnType<
		typeof set_temperature_distribution
	> | null;
	presence_fluide_frigorigene: boolean | null;
	reseau_collectif: boolean | null;
	isolation_reseau: ReturnType<typeof set_isolation_reseau> | null;
}): number {
	const { type_distribution } = props;
	if (null === type_distribution) return 1;
	const abaque = abaques.chauffage.rd;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.rd;
}

/**
 * @return Rendement d'émission moyen  du système de chauffage
 */
export function calcule_re(props: {
	re: ReturnType<typeof emission.calcule_re>[];
}): number {
	return props.re.reduce((acc, re) => acc + re, 0) / props.re.length;
}

/**
 * @return Rendement de régulation moyen du système de chauffage
 */
export function calcule_rr(props: {
	rr: ReturnType<typeof emission.calcule_rr>[];
}): number {
	return props.rr.reduce((acc, rr) => acc + rr, 0) / props.rr.length;
}

/**
 * @return Rendement de génération du système de chauffage
 */
export function calcule_rg(
	props:
		| combustion.CombustionProps
		| generateur.utils.PoeleInsert
		| generateur.utils.GenerateurElectrique
		| generateur.utils.PAC
		| generateur.utils.ReseauChaleur
		| generateur.utils.GenerateurMultiBatiment,
): number {
	switch (true) {
		case generateur.utils.is_reseau_chaleur(props):
		case generateur.utils.is_generateur_multi_batiment(props):
			return 0.97;

		case generateur.utils.is_chaudiere_combustion(props):
		case generateur.utils.is_chaudiere_bois(props):
		case generateur.utils.is_poele_bouilleur(props):
		case generateur.utils.is_generateur_air_chaud_combustion(props):
		case generateur.utils.is_radiateur_gaz(props):
		case generateur.utils.is_pac_hybride(props):
			return combustion.calcule_rg(props);

		case generateur.utils.is_generateur_electrique(props):
		case generateur.utils.is_pac(props):
			return 1;

		default: {
			const abaque = abaques.chauffage.rg;
			const query = props;
			const match = abaque.search(query, abaque.load()).at(0);
			if (!match) throw new ValeurForfaitaireError(query);
			return match.rg;
		}
	}
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/49
 * @param props.sh : Surface de l'installation de chauffage en m²
 * @param props.niveaux_desservis : Nombre de niveaux desservis par l'installation de chauffage
 * @param props.presence_circulateur_externe : Présence d'un circulateur externe à l'installation de chauffage
 * @return Puissance du circulateur de l'installation de chauffage en W
 */
export function calcule_pcircem(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	tbase: ReturnType<typeof climat.calcule_tbase>;
	sh: number;
	niveaux_desservis: number;
	presence_circulateur_externe: boolean | null;
	rdim: ReturnType<typeof installation.calcule_rdim>;
	emetteurs: {
		delta_pem: ReturnType<typeof emetteur.calcule_delta_pem>;
		fcot: ReturnType<typeof emetteur.calcule_fcot>;
		dtheta_dim: ReturnType<typeof emetteur.calcule_dtheta_dim>;
	}[];
}): number {
	const { emetteurs } = props;
	if (emetteurs.length === 0) return 0;
	const { presence_circulateur_externe } = props;
	if (!presence_circulateur_externe) return 0;

	const { gv, tbase, sh, niveaux_desservis, rdim } = props;
	const fcot = Math.max(...emetteurs.map((i) => i.fcot));
	const dtheta_dim = Math.max(...emetteurs.map((i) => i.dtheta_dim));
	const delta_pem = Math.max(...emetteurs.map((i) => i.delta_pem));

	// Puissance nominale en chaud en kW
	const pnc = 10 ** -3 * gv * (20 - tbase);
	// Longueur du réseau en m
	const lem = 5 * fcot * (niveaux_desservis + (sh / niveaux_desservis) ** 0.5);
	// Pertes de charge du réseau en kPa
	const delta_pmnnom = 0.15 * lem + delta_pem;
	// Débit nominal du circulateur en m3/h
	const qvemnom = (pnc * rdim) / (1.163 * dtheta_dim);

	return Math.max(
		30,
		6.44 *
			(delta_pmnnom * (qvemnom / Math.max(1, sh / 400))) ** 0.676 *
			Math.max(1, sh / 400),
	);
}

export function set_presence_circulateur_externe(props: {
	presence_circulateur_externe: boolean | null;
}): boolean {
	return props.presence_circulateur_externe ?? false;
}

/**
 * @param props.temperature_distribution : Température de distribution du réseau de chauffage saisie
 * @return Température de distribution du réseau de chauffage retenue
 */
export function set_temperature_distribution(props: {
	temperature_distribution: models.chauffage.systeme.TemperatureDistribution | null;
}): models.chauffage.systeme.TemperatureDistribution {
	const { temperature_distribution } = props;
	return (
		temperature_distribution ??
		models.chauffage.systeme.TemperatureDistributionEnum.haute
	);
}

/**
 * @param props.isolation_reseau : Isolation du réseau de chauffage saisie
 * @return Isolation du réseau de chauffage retenue
 */
export function set_isolation_reseau(props: {
	isolation_reseau: boolean | null;
}): boolean {
	return props.isolation_reseau ?? false;
}
