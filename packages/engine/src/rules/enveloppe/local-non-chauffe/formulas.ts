import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import * as baie from "./baie/formulas.js";
import * as paroi from "./paroi/formulas.js";
import type { calcule_aiu as calcule_aiu_paroi } from "../paroi/formulas.js";
import type { calcule_b_ets as calcule_b_ets } from "../paroi/formulas.js";
import type { calcule_sse as calcule_sse_baie } from "../baie/formulas.js";
import type { calcule_isolation_aiu as calcule_isolation_aiu_baie } from "../baie/formulas.js";
import type { calcule_isolation_aiu as calcule_isolation_aiu_mur } from "../mur/formulas.js";
import type { calcule_isolation_aiu as calcule_isolation_aiu_pb } from "../plancher-bas/formulas.js";
import type { calcule_isolation_aiu as calcule_isolation_aiu_ph } from "../plancher-haut/formulas.js";
import type { calcule_isolation_aiu as calcule_isolation_aiu_porte } from "../porte/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";

export { baie, paroi };

/**
 * @see calcule_blnc
 * @see calcule_bver
 * Coefficient de réduction des déperditions thermiques du local non chauffé
 */
export type b = number;

/**
 * @guard {@linkcode models.enveloppe.localNonChauffe.isAutreLocalNonChauffe}
 * @formule enveloppe.local_non_chauffe.b
 * @see abaques.enveloppe.localNonChauffe.b
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de réduction des déperditions thermiques du local non chauffé
 */
export function calcule_blnc(props: {
	aue: ReturnType<typeof calcule_aue>;
	aiu: ReturnType<typeof calcule_aiu>;
	isolation_aue: ReturnType<typeof calcule_isolation_aue>;
	isolation_aiu: ReturnType<typeof calcule_isolation_aiu>;
	uvue: ReturnType<typeof calcule_uvue>;
}): number {
	const { aue, aiu, isolation_aue, isolation_aiu, uvue } = props;
	const aiu_aue = aue ? aiu / aue : 0;
	const abaque = abaques.enveloppe.localNonChauffe.b;
	const query = { uvue, aiu_aue, isolation_aue, isolation_aiu };
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.b;
}

/**
 * @guard {@linkcode models.enveloppe.localNonChauffe.isEspaceTamponSolarise}
 * @formule enveloppe.local_non_chauffe.b
 * @see https://github.com/dpe-audit/dpe-logement/issues/45
 * @param props.parois : Liste des parois déperditives donnant sur l'espace tampon solarisé
 * @param props.parois[].surface : Surface de la paroi en m²
 * @returns Coefficient de réduction des déperditions thermiques de l'espace tampon solarisé
 */
export function calcule_bver(props: {
	parois: {
		surface: number;
		b: ReturnType<typeof calcule_b_ets>;
	}[];
}): number {
	const { parois } = props;
	const s = parois.reduce((acc, paroi) => acc + paroi.surface, 0);
	const w = parois.reduce((acc, paroi) => acc + paroi.surface * paroi.b, 0);
	return s > 0 ? w / s : 0;
}

/**
 * @guard {@linkcode models.enveloppe.localNonChauffe.isAutreLocalNonChauffe}
 * @formule enveloppe.local_non_chauffe.uvue
 * @see abaques.enveloppe.localNonChauffe.uvue
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique équivalent du local non chauffé en W/m².K
 */
export function calcule_uvue(props: {
	type_local_non_chauffe: models.enveloppe.localNonChauffe.TypeLncEnum;
}): number {
	const abaque = abaques.enveloppe.localNonChauffe.uvue;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.uvue;
}

/**
 * @formule enveloppe.local_non_chauffe.aue
 * @returns Surface des parois du local non chauffé donnant sur l'extérieur en m²
 */
export function calcule_aue(props: {
	baies: { aue: ReturnType<typeof baie.calcule_aue> }[];
	parois: { aue: ReturnType<typeof paroi.calcule_aue> }[];
}): number {
	const parois = [...props.baies, ...props.parois];
	return parois.reduce((s, { aue }) => s + aue, 0);
}

/**
 * @formule enveloppe.local_non_chauffe.isolation_aue
 * @returns État d'isolation des parois du local non chauffé donnant sur l'extérieur
 */
export function calcule_isolation_aue(props: {
	baies: {
		aue: ReturnType<typeof baie.calcule_aue>;
		isolation: ReturnType<typeof baie.set_isolation>;
	}[];
	parois: {
		aue: ReturnType<typeof paroi.calcule_aue>;
		isolation: ReturnType<typeof paroi.set_isolation>;
	}[];
}): boolean {
	const parois = [...props.baies, ...props.parois];
	const aue = parois.reduce((s, { aue }) => s + aue, 0);
	const aue_isole = parois.reduce(
		(s, { isolation, aue }) => (isolation ? s + aue : s),
		0,
	);
	return aue_isole > 0.5 * aue;
}

/**
 * @formule enveloppe.local_non_chauffe.aiu
 * @returns Surface des parois du local non chauffé donnant sur un espace chauffé en m²
 */
export function calcule_aiu(props: {
	parois_mitoyennes: Array<{
		aiu: ReturnType<typeof calcule_aiu_paroi>;
	}>;
	baies: Array<{
		aiu: ReturnType<typeof baie.calcule_aiu>;
	}>;
	parois: Array<{
		aiu: ReturnType<typeof paroi.calcule_aiu>;
	}>;
}): number {
	const parois = [...props.baies, ...props.parois, ...props.parois_mitoyennes];
	return parois.reduce((s, { aiu }) => s + aiu, 0);
}

/**
 * @formule enveloppe.local_non_chauffe.isolation_aiu
 * @returns État d'isolation des parois du local non chauffé donnant sur un espace chauffé
 */
export function calcule_isolation_aiu(props: {
	parois_mitoyennes: Array<{
		aiu: ReturnType<typeof calcule_aiu_paroi>;
		isolation:
			| ReturnType<typeof calcule_isolation_aiu_mur>
			| ReturnType<typeof calcule_isolation_aiu_ph>
			| ReturnType<typeof calcule_isolation_aiu_pb>
			| ReturnType<typeof calcule_isolation_aiu_baie>
			| ReturnType<typeof calcule_isolation_aiu_porte>;
	}>;
	baies: Array<{
		aiu: ReturnType<typeof baie.calcule_aiu>;
		isolation: ReturnType<typeof baie.set_isolation>;
	}>;
	parois: Array<{
		aiu: ReturnType<typeof paroi.calcule_aiu>;
		isolation: ReturnType<typeof paroi.set_isolation>;
	}>;
}): boolean {
	const parois = [...props.baies, ...props.parois, ...props.parois_mitoyennes];
	const aiu = parois.reduce((s, { aiu }) => s + aiu, 0);
	const aiu_isole = parois.reduce(
		(s, { isolation, aiu }) => (isolation ? s + aiu : s),
		0,
	);
	return aiu_isole > 0.5 * aiu;
}

/**
 * @formule enveloppe.local_non_chauffe.sse
 * @see https://github.com/dpe-audit/dpe-logement/discussions/48
 * @returns Surface sud équivalente de l'espace tampon solarisé en m²/mois
 */
export function calcule_sse(props: {
	baies: { sst: ReturnType<typeof baie.calcule_sst> }[];
	sse: ReturnType<typeof calcule_sse_baie>[];
	b: b;
}): models.common.ParMois<number> {
	const sst = models.common.mergeParMois(props.baies.map((baie) => baie.sst));
	return models.common.createParMois((mois) => {
		const sse = props.sse.reduce((acc, sse) => acc + sse[mois], 0);
		return (sst[mois] - sse) * props.b;
	});
}

/**
 * @formule enveloppe.local_non_chauffe.t
 * @param props.baies : Liste des baies du local non chauffé
 * @param props.baies[].surface : Surface de la baie en m²
 * @returns Coefficient de transparence moyen du local non chauffé
 */
export function calcule_t(props: {
	type_local_non_chauffe: models.enveloppe.localNonChauffe.TypeLncEnum;
	baies: {
		mitoyennete: models.enveloppe.common.MitoyenneteEnum;
		surface: number;
		t: ReturnType<typeof baie.calcule_t>;
	}[];
}): number {
	if (
		props.type_local_non_chauffe !==
		models.enveloppe.localNonChauffe.TYPES_LNC.espace_tampon_solarise
	)
		return 0;

	const baies = props.baies.filter(
		({ mitoyennete }) =>
			mitoyennete === models.enveloppe.common.MITOYENNETES.exterieur,
	);
	const s = baies.reduce((acc, baie) => acc + baie.surface, 0);
	const w = baies.reduce((acc, baie) => acc + baie.surface * baie.t, 0);
	return s > 0 ? w / s : 0;
}

/**
 * @formule enveloppe.local_non_chauffe.orientations
 * @param props.baies : Liste des baies de l'espace tampon solarisé
 * @returns Orientations majoritaires du local non chauffé
 */
export function calcule_orientations(props: {
	baies: {
		mitoyennete: models.enveloppe.common.MitoyenneteEnum;
		surface: number;
		orientation: models.enveloppe.common.OrientationParoiEnum;
	}[];
}): models.common.OrientationCardinaleEnum[] {
	const baies = props.baies.filter(
		({ mitoyennete }) =>
			mitoyennete === models.enveloppe.common.MITOYENNETES.exterieur,
	);

	const parOrientation = new Map<
		models.common.OrientationCardinaleEnum,
		number
	>();
	for (const baie of baies) {
		if (baie.orientation === models.enveloppe.common.OrientationHorizontale)
			continue;

		const current = parOrientation.get(baie.orientation) ?? 0;
		parOrientation.set(baie.orientation, current + baie.surface);
	}

	if (parOrientation.size === 0) return [];
	const maxAue = Math.max(...parOrientation.values());
	return [...parOrientation.entries()]
		.filter(([, aue]) => aue === maxAue)
		.map(([orientation]) => orientation);
}
