import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as baie from "#rules/enveloppe/baie/formulas.js";
import * as localNonChauffe from "#rules/enveloppe/local-non-chauffe/formulas.js";
import * as mur from "#rules/enveloppe/mur/formulas.js";
import * as niveau from "#rules/enveloppe/niveau/formulas.js";
import * as paroi from "#rules/enveloppe/paroi/formulas.js";
import * as plancherHaut from "#rules/enveloppe/plancher-haut/formulas.js";
import * as pontThermique from "#rules/enveloppe/pont-thermique/formulas.js";
import * as ventilation from "#rules/ventilation/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import { createParMois } from "#utils/helpers.js";

/**
 * @doctrine enveloppe.gv
 * @returns Déperditions thermiques totales de l'enveloppe en W/K
 */
export function calcule_gv(props: {
	dp: ReturnType<typeof calcule_dp>;
	pt: ReturnType<typeof pontThermique.calcule_pt>;
	dr: ReturnType<typeof calcule_dr>;
}): number {
	const { dp, pt, dr } = props;
	return dp + pt + dr;
}

/**
 * @doctrine enveloppe.ubat
 * @returns Coefficient de transmission thermique moyen en W/(K.m²)
 */
export function calcule_ubat(props: {
	dp: ReturnType<typeof calcule_dp>;
	pt: ReturnType<typeof calcule_pt>;
	sdep: ReturnType<typeof calcule_sdep>;
}): number {
	const { dp, pt, sdep } = props;
	return (dp + pt) / sdep;
}

/**
 * @doctrine enveloppe.dp
 * @doctrine enveloppe.dp_baies
 * @doctrine enveloppe.dp_portes
 * @doctrine enveloppe.dp_murs
 * @doctrine enveloppe.dp_planchers_hauts
 * @doctrine enveloppe.dp_planchers_bas
 * @returns Déperditions thermiques totales par les parois en W/K
 */
export function calcule_dp(props: {
	dp: ReturnType<typeof paroi.calcule_dp>[];
}): number {
	return props.dp.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine enveloppe.dr
 * @returns Déperditions thermiques totales par renouvellement d'air en W/K
 */
export function calcule_dr(props: {
	hperm: ReturnType<typeof calcule_hperm>;
	hvent: ReturnType<typeof ventilation.calcule_hvent>;
}): number {
	const { hperm, hvent } = props;
	return hperm + hvent;
}

/**
 * @doctrine enveloppe.pt
 * @return Déperditions thermiques par les ponts thermiques en W/K
 */
export function calcule_pt(props: {
	pt: ReturnType<typeof pontThermique.calcule_pt>[];
}): number {
	return props.pt.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine enveloppe.sdep
 * @doctrine enveloppe.sdep_baies
 * @doctrine enveloppe.sdep_portes
 * @doctrine enveloppe.sdep_murs
 * @doctrine enveloppe.sdep_planchers_hauts
 * @doctrine enveloppe.sdep_planchers_bas
 * @return Surface déperditive des baies en m²
 */
export function calcule_sdep(props: {
	sdep: ReturnType<typeof paroi.calcule_sdep>[];
}): number {
	return props.sdep.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine enveloppe.inertie
 * @param props.niveaux[].sh : Surface habitable du niveau
 * @returns Inertie de l'enveloppe
 */
export function calcule_inertie(props: {
	niveaux: models.common.NonEmptyArray<{
		inertie: ReturnType<typeof niveau.calcule_inertie>;
		sh: number;
	}>;
}): models.enveloppe.common.Inertie {
	const { niveaux } = props;
	// Surface totale par inertie
	const surfaceParInertie = new Map<models.enveloppe.common.Inertie, number>();
	for (const niveau of niveaux) {
		const current = surfaceParInertie.get(niveau.inertie) ?? 0;
		surfaceParInertie.set(niveau.inertie, current + niveau.sh);
	}

	// Inerties majoritaires (surface strictement supérieure à toutes les autres)
	const maxSurface = Math.max(...surfaceParInertie.values());
	const inertiesMajoritaires: models.enveloppe.common.Inertie[] = [
		...surfaceParInertie.entries(),
	]
		.filter(([, surface]) => surface === maxSurface)
		.map(([inertie]) => inertie);

	// Une seule inertie majoritaire
	if (inertiesMajoritaires.length === 1)
		return inertiesMajoritaires[0] as models.enveloppe.common.Inertie;

	// Plusieurs inerties majoritaires
	if (
		!inertiesMajoritaires.includes(models.enveloppe.common.InertieEnum.legere)
	)
		return models.enveloppe.common.InertieEnum.lourde;

	return models.enveloppe.common.InertieEnum.moyenne;
}

/**
 * @doctrine enveloppe.hperm
 * @returns Déperditions thermiques par renouvellement d'air due au vent en W/K
 */
export function calcule_hperm(props: {
	qvinf: ReturnType<typeof calcule_qvinf>;
}): number {
	const { qvinf } = props;
	return 0.34 * qvinf;
}

/**
 * @doctrine enveloppe.qvinf
 * @returns Débit d'air dû aux infiltrations liées au vent en m3/h
 */
export function calcule_qvinf(props: {
	exposition: models.enveloppe.Exposition;
	sh: ReturnType<typeof batiment.calcule_sh>;
	hsp: ReturnType<typeof batiment.calcule_hsp>;
	qvarep_conv: ReturnType<typeof ventilation.calcule_qvarep_conv>;
	qvasouf_conv: ReturnType<typeof ventilation.calcule_qvasouf_conv>;
	n50: ReturnType<typeof calcule_n50>;
}): number {
	const { exposition, sh, hsp, qvarep_conv, qvasouf_conv, n50 } = props;

	const e = exposition === models.enveloppe.ExpositionEnum.simple ? 0.02 : 0.07;
	const f = exposition === models.enveloppe.ExpositionEnum.simple ? 20 : 15;

	return (
		(hsp * sh * e) /
		(1 + (f / e) * ((qvasouf_conv - qvarep_conv) / (hsp * n50)) ** 2)
	);
}

/**
 * @doctrine enveloppe.n50
 * @returns Renouvellement d'air sous 50 Pascals en h-1
 */
export function calcule_n50(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	hsp: ReturnType<typeof batiment.calcule_hsp>;
	q4pa: ReturnType<typeof calcule_q4pa>;
}): number {
	const { sh, hsp, q4pa } = props;
	return q4pa / ((4 / 50) ** (2 / 3) * hsp * sh);
}

/**
 * @doctrine enveloppe.q4pa
 * @returns Perméabilité de la zone sous 4Pa en m3/h
 */
export function calcule_q4pa(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	q4paenv: ReturnType<typeof calcule_q4paenv>;
	smea_conv: ReturnType<typeof ventilation.calcule_smea_conv>;
}): number {
	const { sh, q4paenv, smea_conv } = props;
	return 0.45 * smea_conv * sh + q4paenv;
}

/**
 * @doctrine enveloppe.q4paenv
 * @returns Perméabilité de l'enveloppe en m3/h
 */
export function calcule_q4paenv(props: {
	sdep: ReturnType<typeof paroi.calcule_sdep>;
	sdep_planchers_bas: ReturnType<typeof paroi.calcule_sdep>;
	q4paconv: ReturnType<typeof calcule_q4paconv>;
}): number {
	const sdep = props.sdep - props.sdep_planchers_bas;
	return props.q4paconv * sdep;
}

/**
 * @doctrine enveloppe.q4paconv
 * @param props.annee_construction : Année de construction du bâtiment
 * @see abaques.enveloppe.permeabilite.q4paconv
 * @throws {ValeurForfaitaireError}
 * @returns Perméabilité de l'enveloppe sous 4Pa en m3/(h.m²)
 */
export function calcule_q4paconv(props: {
	type_batiment: models.batiment.TypeBatiment;
	annee_construction: number;
	isolation_murs_plafonds: ReturnType<typeof calcule_isolation_murs_plafonds>;
	presence_joints: ReturnType<typeof calcule_presence_joints>;
}): number {
	const abaque = abaques.enveloppe.permeabilite.q4paconv;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.q4paconv;
}

/**
 * @doctrine enveloppe.isolation_murs_plafonds
 * @returns Isolation majoritaire des murs et des plafonds
 */
export function calcule_isolation_murs_plafonds(props: {
	murs: { surface: number; isolation: ReturnType<typeof mur.set_isolation> }[];
	planchers_hauts: {
		surface: number;
		isolation: ReturnType<typeof plancherHaut.set_isolation>;
	}[];
}): boolean {
	const parois = [...props.murs, ...props.planchers_hauts];
	const s = parois.reduce((acc, { surface }) => acc + surface, 0);
	const w = parois
		.filter(({ isolation }) => isolation)
		.reduce((acc, { surface }) => acc + surface, 0);
	return w > s / 2;
}

/**
 * @doctrine enveloppe.presence_joints
 * @param props.ouvertures : Liste des ouvertures
 * @param props.ouvertures[].surface : Surface de l'ouverture en m²
 * @param props.ouvertures[].presence_joint : Présence de joints au niveau de l'ouverture
 * @returns Présence majoritaire de joints au niveau des ouvertures (plus de 50% de la surface totale des ouvertures)
 */
export function calcule_presence_joints(props: {
	ouvertures: { surface: number; presence_joint: boolean | null }[];
}): boolean {
	const { ouvertures } = props;
	const s = ouvertures.reduce((acc, i) => acc + i.surface, 0);
	const w = ouvertures.reduce(
		(acc, i) => acc + (i.presence_joint ? i.surface : 0),
		0,
	);
	return s === 0 ? false : w / s > 0.5;
}

/**
 * @doctrine enveloppe.isolation_planchers_hauts
 * @return État d'isolation majoritaire des planchers hauts (plus de 50% de la surface totale des planchers hauts)
 */
export function calcule_isolation_planchers_hauts(props: {
	planchers_hauts: {
		surface: number;
		mitoyennete: models.enveloppe.common.Mitoyennete;
		isolation: ReturnType<typeof plancherHaut.set_isolation>;
	}[];
}): boolean | null {
	const planchers_hauts = props.planchers_hauts.filter(
		({ mitoyennete }) =>
			mitoyennete === models.enveloppe.common.MitoyenneteEnum.exterieur,
	);
	if (planchers_hauts.length === 0) return null;
	const s = planchers_hauts.reduce((acc, i) => acc + i.surface, 0);
	const w = planchers_hauts.reduce(
		(acc, i) => acc + (i.isolation ? i.surface : 0),
		0,
	);
	return s === 0 ? null : w / s > 0.5;
}

/**
 * @doctrine enveloppe.presence_protection_solaire
 * @return Présence majoritaire de protections solaires au niveau des baies (plus de 50% de la surface totale des baies)
 */
export function calcule_presence_protection_solaire(props: {
	baies: {
		surface: number;
		orientation: models.enveloppe.common.Orientation;
		mitoyennete: models.enveloppe.common.Mitoyennete;
		type_fermeture: models.enveloppe.baie.TypeFermeture;
	}[];
}): boolean | null {
	const baies = props.baies.filter(
		({ mitoyennete, orientation }) =>
			mitoyennete === models.enveloppe.common.MitoyenneteEnum.exterieur &&
			orientation !== models.common.OrientationEnum.nord,
	);
	if (baies.length === 0) return null;
	const s = baies.reduce((acc, i) => acc + i.surface, 0);
	const w = baies.reduce(
		(acc, i) =>
			acc +
			(i.type_fermeture !==
			models.enveloppe.baie.TypeFermetureEnum.sans_fermeture
				? i.surface
				: 0),
		0,
	);
	return s === 0 ? null : w / s > 0.5;
}

/**
 * @doctrine enveloppe.logement_traversant
 * @return Logement traversant
 */
export function calcule_logement_traversant(props: {
	baies: {
		surface: number;
		orientation: models.enveloppe.common.Orientation;
		mitoyennete: models.enveloppe.common.Mitoyennete;
	}[];
}): boolean {
	const baies = props.baies.filter(
		({ mitoyennete, orientation }) =>
			mitoyennete === models.enveloppe.common.MitoyenneteEnum.exterieur &&
			orientation !== models.enveloppe.common.OrientationHorizontale,
	);
	// 1. On détermine la surface totale des baies pour chaque orientation
	// 2. Pour chaque orientation, on vérifie que les surfaces correspondantes sont inférieures à 75% de la surface totale des baies
	const surfaceParOrientation = new Map<
		models.enveloppe.common.Orientation,
		number
	>();
	for (const baie of baies) {
		const current = surfaceParOrientation.get(baie.orientation) ?? 0;
		surfaceParOrientation.set(baie.orientation, current + baie.surface);
	}
	const surfaceTotale = baies.reduce((acc, baie) => acc + baie.surface, 0);
	for (const surface of surfaceParOrientation.values()) {
		if (surface > 0.75 * surfaceTotale) return false;
	}
	return true;
}

/**
 * @doctrine enveloppe.sse
 * @returns Surface sud équivalente de l'enveloppe en m²
 */
export function calcule_sse(props: {
	sse: ReturnType<typeof baie.calcule_sse>[];
	sse_ets: ReturnType<typeof localNonChauffe.calcule_sse>[];
}): models.common.ParMois<number> {
	return createParMois((mois: models.common.Mois) => {
		const sse = props.sse.reduce((acc, sse) => acc + sse[mois], 0);
		const sse_ets = props.sse_ets.reduce((acc, sse) => acc + sse[mois], 0);
		return sse + sse_ets;
	});
}

/**
 * @doctrine enveloppe.parois_anciennes
 * @param props.murs - Liste des murs de l'enveloppe
 * @param props.murs[].surface - Surface du mur en m²
 * @param props.murs[].materiaux_anciens - Indique si les matériaux du mur sont anciens ou non (non par défaut)
 * @returns Présence majoritaire de murs anciens (plus de 50% de la surface totale des murs)
 */
export function calcule_parois_anciennes(props: {
	murs: { surface: number; materiaux_anciens: boolean | null }[];
}): boolean {
	const s = props.murs.reduce((acc, mur) => acc + mur.surface, 0);
	const w = props.murs
		.filter(({ materiaux_anciens }) => materiaux_anciens)
		.reduce((acc, { surface }) => acc + surface, 0);
	return s === 0 ? false : w / s > 0.5;
}
