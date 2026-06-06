import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as enveloppe from "#rules/enveloppe/formulas.js";
import * as generateur from "#rules/chauffage/generateur/formulas.js";
import * as installation from "#rules/chauffage/installation/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import {
	calcule_bch,
	calcule_rdim,
	calcule_rd,
	calcule_rg,
} from "../formulas.js";

/**
 * Facteur d'utilisation de la PAC pour les générateurs hybrides
 */
export const FUT_PAC_HYBRIDE = {
	[models.batiment.ZoneClimatiqueEnum.H1a]: 0.8,
	[models.batiment.ZoneClimatiqueEnum.H1b]: 0.8,
	[models.batiment.ZoneClimatiqueEnum.H1c]: 0.8,
	[models.batiment.ZoneClimatiqueEnum.H2a]: 0.83,
	[models.batiment.ZoneClimatiqueEnum.H2b]: 0.83,
	[models.batiment.ZoneClimatiqueEnum.H2c]: 0.83,
	[models.batiment.ZoneClimatiqueEnum.H2d]: 0.83,
	[models.batiment.ZoneClimatiqueEnum.H3]: 0.88,
};

/**
 * @param props.n - Nombre d'émissions associées au système de chauffage
 * @return Consommations de chauffage du système en kWh/an
 */
export function calcule_cch(props: {
	cch1: ReturnType<typeof calcule_cch1>;
	cch2: ReturnType<typeof calcule_cch2> | null;
}): number {
	const { cch1, cch2 } = props;
	return cch1 + (cch2 ?? 0);
}

/**
 * @param props.n - Nombre d'émissions associées au système de chauffage
 * @return Consommations de chauffage du système OU de la partie PAC des PAC hybrides en kWh/an
 */
export function calcule_cch1(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	pac_hybride: boolean;
	bch: ReturnType<typeof calcule_bch>;
	fch: ReturnType<typeof installation.calcule_fch>;
	rdim_i: ReturnType<typeof installation.calcule_rdim>;
	rdim: ReturnType<typeof calcule_rdim>;
	int: ReturnType<typeof calcule_int>;
	ich1: ReturnType<typeof calcule_ich1>;
	n: number;
}): number {
	const { fch, rdim_i, rdim, int, ich1, n, pac_hybride } = props;
	const bch = models.common.reduceParMois(props.bch);
	const cch = bch * (1 - fch) * int * ich1 * rdim_i * rdim * (1 / n);
	return pac_hybride ? cch * FUT_PAC_HYBRIDE[props.zone_climatique] : cch;
}

/**
 * @param props.n - Nombre d'émissions associées au système de chauffage
 * @return Consommations de chauffage de la partie chaudière des PAC hybrides en kWh/an
 */
export function calcule_cch2(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	pac_hybride: boolean;
	bch: ReturnType<typeof calcule_bch>;
	fch: ReturnType<typeof installation.calcule_fch>;
	rdim_i: ReturnType<typeof installation.calcule_rdim>;
	rdim: ReturnType<typeof calcule_rdim>;
	int: ReturnType<typeof calcule_int>;
	ich2: ReturnType<typeof calcule_ich2>;
	n: number;
}): number {
	const { fch, rdim_i, rdim, int, ich2, n, pac_hybride } = props;
	const bch = models.common.reduceParMois(props.bch);
	const cch = bch * (1 - fch) * int * ich2 * rdim_i * rdim * (1 / n);
	return pac_hybride ? cch * (1 - FUT_PAC_HYBRIDE[props.zone_climatique]) : cch;
}

/**
 * @return Facteur d'intermittence du système de chauffage
 */
export function calcule_int(props: {
	gv: ReturnType<typeof enveloppe.calcule_gv>;
	sh: ReturnType<typeof batiment.calcule_sh>;
	hsp: ReturnType<typeof batiment.calcule_hsp>;
	i0: ReturnType<typeof calcule_i0>;
}): number {
	const { gv, sh, hsp, i0 } = props;
	const G = gv / (sh * hsp);
	return i0 / (1 + 0.1 * (G - 1));
}

/**
 * @param props.installation_collective : Installation collective ou individuelle
 * @param props.comptage_individuel : Présence de comptage individuel
 * @param props.regulation_terminale : Présence de régulation terminale
 * @return Coefficient d'intermittence du système de chauffage
 */
export function calcule_i0(props: {
	type_batiment: models.batiment.TypeBatiment;
	type_chauffage: models.chauffage.installation.TypeInstallation;
	type_emission: ReturnType<typeof calcule_type_emission>;
	inertie: ReturnType<typeof enveloppe.calcule_inertie>;
	installation_collective: boolean;
	comptage_individuel: boolean | null;
	regulation_terminale: boolean | null;
	type_programmation: models.chauffage.installation.TypeProgrammation;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
}): number {
	const { type_generateur, ...query } = props;
	const abaque = abaques.chauffage.i0;
	const data = abaque.load();

	// Cas des convecteurs bi-jonction
	if (
		type_generateur ===
		models.chauffage.generateur.TypeGenerateurEnum.convecteur_bi_jonction
	) {
		const q1 = { ...query, installation_collective: true };
		const match1 = abaque.search(q1, data).at(0);
		if (!match1) throw new ValeurForfaitaireError(q1);
		const i0_1 = match1.i0;

		const q2 = { ...query, installation_collective: false };
		const match2 = abaque.search(q2, data).at(0);
		if (!match2) throw new ValeurForfaitaireError(q2);
		const i0_2 = match2.i0;

		return i0_1 * 0.6 + i0_2 * 0.4;
	}
	// Autres cas
	const match = abaque.search(query, data).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.i0;
}

/**
 * @return Inverse du rendement du système de chauffage
 */
export function calcule_ich(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	pac_hybride: boolean;
	ich1: ReturnType<typeof calcule_ich1>;
	ich2: ReturnType<typeof calcule_ich2> | null;
}): number {
	const { ich1, ich2 } = props;
	if (null === ich2) return ich1;
	if (false === props.pac_hybride) return ich1;
	const fut = FUT_PAC_HYBRIDE[props.zone_climatique];
	return ich1 * fut + ich2 * (1 - fut);
}

/**
 * @return Inverse du rendement du système OU de la partie PAC des PAC hybrides
 */
export function calcule_ich1(props: {
	rd: ReturnType<typeof calcule_rd>;
	rg: ReturnType<typeof calcule_rg>;
	re: ReturnType<typeof calcule_re>;
	rr: ReturnType<typeof calcule_rr>;
	scop: ReturnType<typeof generateur.calcule_scop> | null;
}): number {
	const { rd, rg, re, rr, scop } = props;
	return scop ? 1 / (rd * re * rr * scop) : 1 / (rd * re * rg * rr);
}

/**
 * @return Inverse du rendement de la partie chaudière des PAC hybrides
 */
export function calcule_ich2(props: {
	rd: ReturnType<typeof calcule_rd>;
	rg: ReturnType<typeof calcule_rg>;
	re: ReturnType<typeof calcule_re>;
	rr: ReturnType<typeof calcule_rr>;
}): number {
	const { rd, rg, re, rr } = props;
	return 1 / (rd * re * rg * rr);
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/50
 * @return Rendement d'émission du système de chauffage
 */
export function calcule_re(props: {
	type_emission: ReturnType<typeof calcule_type_emission>;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	label_generateur: models.chauffage.generateur.Label | null;
}): number {
	const query = props;
	const abaque = abaques.chauffage.re;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.re;
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/50
 * @param props.reseau_collectif - Système de chauffage collectif ou individuel
 * @param props.presence_robinet_thermostatique - Présence de robinet thermostatique sur l'émetteur
 * @param props.presence_regulation_terminale - Présence de régulation terminale
 * @return Rendement de régulation du système de chauffage
 */
export function calcule_rr(props: {
	type_emission: ReturnType<typeof calcule_type_emission>;
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	label_generateur: models.chauffage.generateur.Label | null;
	reseau_collectif: boolean | null;
	presence_robinet_thermostatique: boolean | null;
	presence_regulation_terminale: boolean | null;
}): number {
	const query = props;
	const abaque = abaques.chauffage.rr;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.rr;
}

/**
 * @param props.type_distribution - Type de distribution du système de chauffage
 * @param props.type_emetteur - Type d'émetteur du système de chauffage
 * @return Type d'émission du système de chauffage
 */
export function calcule_type_emission(props: {
	type_generateur: ReturnType<typeof generateur.set_type_generateur>;
	type_distribution: models.chauffage.systeme.TypeDistribution | null;
	type_emetteur: models.chauffage.emetteur.TypeEmetteur | null;
}): models.chauffage.systeme.TypeEmission {
	const query = props;
	const abaque = abaques.chauffage.emission;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.type_emission as models.chauffage.systeme.TypeEmission;
}
