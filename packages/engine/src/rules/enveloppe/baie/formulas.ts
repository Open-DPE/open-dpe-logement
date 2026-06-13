import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import type * as paroi from "../paroi/formulas.js";
import type * as climat from "../../climat/formulas.js";
import type * as localNonChauffe from "../local-non-chauffe/formulas.js";
import type * as masque from "../masque/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";
import { createParMois } from "../../helpers.js";
import { linearInterpolate } from "../../math.js";

export { calcule_c1 } from "../../climat/formulas.js";

/**
 * @formule enveloppe.baie.dp
 * @returns Déperditions thermiques de la paroi en W/K
 */
export function calcule_dp(props: {
	sdep: ReturnType<typeof paroi.calcule_sdep>;
	b: paroi.b;
	u: ReturnType<typeof calcule_u>;
	double_fenetre: boolean;
}): number {
	const { sdep, b, u, double_fenetre } = props;
	return double_fenetre ? (sdep * b * u) / 2 : sdep * b * u;
}

/**
 * @formule enveloppe.baie.isolation_aiu
 * @returns État d'isolation de la baie donnant sur un local non chauffé
 */
export function calcule_isolation_aiu(props: {
	type_vitrage: ReturnType<typeof set_type_vitrage>;
}): boolean {
	switch (props.type_vitrage) {
		case models.enveloppe.baie.TypeVitrageEnum.triple_vitrage:
		case models.enveloppe.baie.TypeVitrageEnum.triple_vitrage_fe:
			return true;
		default:
			return false;
	}
}

/**
 * @formule enveloppe.baie.u
 * @param props.ujn_saisi : Coefficient de transmission thermique de la baie avec fermeture saisi en W/(m².K)
 * @see abaques.enveloppe.baie.ujn
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique de la baie en W/(m².K)
 */
export function calcule_u(props: {
	ujn_saisi: number | null;
	uw: ReturnType<typeof calcule_uw>;
	deltar: ReturnType<typeof calcule_deltar>;
}): number {
	const { ujn_saisi, uw, ...query } = props;

	if (ujn_saisi) return ujn_saisi;
	if (props.deltar === 0) return uw;

	const abaque = abaques.enveloppe.baie.ujn;
	const matches = abaque.search(query, abaque.load());
	const match = matches.find((match) => match.uw === uw);

	if (match) return match.ujn;
	if (matches.length === 0) throw new ValeurForfaitaireError(query);

	const points = matches.map((match) => ({
		x: match.uw,
		y: match.ujn,
	}));
	return linearInterpolate(props.uw, points);
}

/**
 * @formule enveloppe.baie.deltar
 * @param props.type_fermeture : Type de fermeture de la baie
 * @see abaques.enveloppe.baie.deltar
 * @throws {ValeurForfaitaireError}
 * @returns Résistance thermique additionnelle de la baie en m².K/W
 */
export function calcule_deltar(props: {
	types_fermetures: models.enveloppe.baie.TypeFermeture[];
}): number {
	const types_fermetures = [...new Set(props.types_fermetures)];
	const abaque = abaques.enveloppe.baie.deltar;
	const values = types_fermetures.map((type_fermeture) => {
		const query = { type_fermeture };
		const match = abaque.search(query, abaque.load()).at(0);
		if (!match) throw new ValeurForfaitaireError(query);
		return match.deltar;
	});
	return values.length ? Math.max(...values) : 0;
}

/**
 * @formule enveloppe.baie.uw
 * @returns Coefficient de transmission thermique de la baie avec double fenêtre en W/(m².K)
 */
export function calcule_uw(props: {
	uw1: ReturnType<typeof calcule_uw0>;
	uw2: ReturnType<typeof calcule_uw0> | null;
}): number {
	const { uw1, uw2 } = props;
	if (uw2 === null) return uw1;
	return 1 / (1 / uw1 + 1 / uw2 + 0.07);
}

/**
 * @formule enveloppe.baie.uw0
 * @param props.uw_saisi : Coefficient de transmission thermique de la baie saisi en W/(m².K)
 * @param props.type_baie : Type de baie
 * @param props.presence_soubassement : Indique la présence d'un soubassement
 * @see abaques.enveloppe.baie.uw
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique de la baie  en W/(m².K)
 */
export function calcule_uw0(props: {
	uw_saisi: number | null;
	type_baie: models.enveloppe.baie.TypeBaie;
	presence_soubassement: boolean | null;
	materiau: ReturnType<typeof set_materiau>;
	presence_rupteur_pont_thermique: ReturnType<
		typeof set_presence_rupteur_pont_thermique
	>;
	ug: ReturnType<typeof calcule_ug>;
}): number {
	const { uw_saisi, ug, ...query } = props;
	if (uw_saisi) return uw_saisi;

	const abaque = abaques.enveloppe.baie.uw;
	const matches = abaque.search(query, abaque.load());
	const match = matches.find((match) => match.ug === ug);
	if (match) return match.uw;
	if (matches.length === 0) throw new ValeurForfaitaireError(query);

	// Ug est injecté dans les points d'abaque pour permettre l'interpolation linéaire
	const points = matches.map((match) => ({
		x: match.ug ?? props.ug,
		y: match.uw,
	}));
	return linearInterpolate(props.ug, points);
}

/**
 * @formule enveloppe.baie.ug
 * @param props.ug_saisi : Coefficient de transmission thermique du vitrage saisi en W/(m².K)
 * @param props.type_baie : Type de baie
 * @param props.inclinaison_vitrage : Inclinaison du vitrage de la baie en degrés
 * @see abaques.enveloppe.baie.ug
 * @throws {ValeurForfaitaireError}
 * @returns Coefficient de transmission thermique du vitrage de la baie en W/(m².K)
 */
export function calcule_ug(props: {
	ug_saisi: number | null;
	type_baie: models.enveloppe.baie.TypeBaie;
	type_vitrage: ReturnType<typeof set_type_vitrage>;
	type_survitrage: ReturnType<typeof set_type_survitrage> | null;
	nature_lame_air: ReturnType<typeof set_nature_lame_air> | null;
	epaisseur_lame_air: ReturnType<typeof set_epaisseur_lame_air> | null;
	inclinaison_vitrage: number | null;
}): number {
	const { ug_saisi, ...query } = props;
	if (ug_saisi) return ug_saisi;
	const abaque = abaques.enveloppe.baie.ug;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.ug;
}

/**
 * @formule enveloppe.baie.sse
 * @param props.surface : Surface de la baie en m²
 * @returns Surface sud équivalente de la baie en m²/mois
 */
export function calcule_sse(props: {
	surface: number;
	mitoyennete: models.enveloppe.common.Mitoyennete;
	double_fenetre: boolean;
	sw: ReturnType<typeof calcule_sw>;
	fe: ReturnType<typeof calcule_fe>;
	t: ReturnType<typeof localNonChauffe.calcule_t> | null;
	c1: ReturnType<typeof climat.calcule_c1>;
}): models.common.ParMois<number> {
	const { surface, sw, fe, c1 } = props;
	const t = props.t === null ? 1 : props.t;

	switch (props.mitoyennete) {
		case models.enveloppe.common.MitoyenneteEnum.exterieur:
		case models.enveloppe.common.MitoyenneteEnum.local_non_chauffe: {
			return createParMois((mois: models.common.Mois) => {
				const sse = surface * sw * fe * c1[mois] * t;
				return props.double_fenetre ? sse / 2 : sse;
			});
		}

		default:
			return createParMois(() => 0);
	}
}

/**
 * @formule enveloppe.baie.sw
 * @returns Proportion d'énergie solaire incidente transmise par la baie
 */
export function calcule_sw(props: {
	sw1: ReturnType<typeof calcule_sw0>;
	sw2: ReturnType<typeof calcule_sw> | null;
}): number {
	const { sw1, sw2 } = props;
	if (sw2 === null) return sw1;
	return sw1 * sw2;
}

/**
 * @formule enveloppe.baie.sw0
 * @param props.sw_saisi : Proportion d'énergie solaire incidente transmise par la baie saisie
 * @param props.type_baie : Type de baie
 * @param props.presence_soubassement : Indique la présence d'un soubassement
 * @param props.type_pose : Type de pose de la baie
 * @see abaques.enveloppe.baie.sw
 * @throws {ValeurForfaitaireError}
 * @returns Proportion d'énergie solaire incidente transmise par la baie
 */
export function calcule_sw0(props: {
	sw_saisi: number | null;
	type_baie: models.enveloppe.baie.TypeBaie;
	presence_soubassement: boolean | null;
	materiau: ReturnType<typeof set_materiau>;
	type_vitrage: ReturnType<typeof set_type_vitrage>;
	type_pose: models.enveloppe.common.TypePose | null;
	type_survitrage: ReturnType<typeof set_type_survitrage> | null;
}): number {
	const { sw_saisi, ...query } = props;
	if (sw_saisi) return sw_saisi;
	const abaque = abaques.enveloppe.baie.sw;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.sw;
}

/**
 * @formule enveloppe.baie.fe
 * @param props.fe1 : {@linkcode masque.calcule_fe1}
 * @param props.fe2 : {@linkcode masque.calcule_fe2}
 * @returns Facteur d'ensoleillement de la baie dû à la présence de masques
 */
export function calcule_fe(props: {
	fe1: ReturnType<typeof calcule_fe1>;
	fe2: ReturnType<typeof calcule_fe2>;
}): number {
	const { fe1, fe2 } = props;
	return fe1 * fe2;
}

/**
 * @formule enveloppe.baie.fe1
 * @returns Facteur d'ensoleillement dû aux masques proches
 */
export function calcule_fe1(props: {
	fe1: ReturnType<typeof masque.calcule_fe1>[];
}): number {
	return props.fe1.length === 0 ? 1 : Math.min(...props.fe1);
}

/**
 * @formule enveloppe.baie.fe2
 * @returns Facteur d'ensoleillement dû aux masques lointains
 */
export function calcule_fe2(props: {
	fe2: ReturnType<typeof masque.calcule_fe2>[];
	omb: ReturnType<typeof calcule_omb>;
}): number {
	const fe2Min = props.fe2.length === 0 ? 1 : Math.min(...props.fe2);
	return Math.min(fe2Min, 1 - props.omb / 100);
}

/**
 * @formule enveloppe.baie.omb
 * @returns Coefficient d'ombrage dû aux masques lointains non homogènes
 */
export function calcule_omb(props: {
	omb: ReturnType<typeof masque.calcule_omb>[];
}): number {
	const omb = props.omb.reduce((sum, value) => sum + value, 0);
	return Math.min(omb, 100);
}

/**
 * @param props.type_vitrage : Type de vitrage saisi
 * @returns Type de vitrage retenu
 */
export function set_type_vitrage(props: {
	type_vitrage: models.enveloppe.baie.TypeVitrage | null;
}): models.enveloppe.baie.TypeVitrage {
	const { type_vitrage } = props;
	return type_vitrage === null
		? models.enveloppe.baie.TypeVitrageEnum.simple_vitrage
		: type_vitrage;
}

/**
 * @param props.type_survitrage : Type de survitrage saisi
 * @returns Type de survitrage retenu
 */
export function set_type_survitrage(props: {
	type_survitrage: models.enveloppe.baie.TypeSurvitrage | null;
}): models.enveloppe.baie.TypeSurvitrage {
	return (
		props.type_survitrage ??
		models.enveloppe.baie.TypeSurvitrageEnum.survitrage_simple
	);
}

/**
 * @param props.materiau : Matériau saisi
 * @returns Matériau retenu
 */
export function set_materiau(props: {
	materiau: models.enveloppe.baie.Materiau | null;
}): models.enveloppe.baie.Materiau {
	return props.materiau ?? models.enveloppe.baie.MateriauEnum.pvc;
}

/**
 * @param props.nature_lame_air : Nature de la lame d'air saisie
 * @returns Nature de la lame d'air retenue
 */
export function set_nature_lame_air(props: {
	nature_lame_air: models.enveloppe.baie.NatureLame | null;
}): models.enveloppe.baie.NatureLame {
	return props.nature_lame_air ?? models.enveloppe.baie.NatureLameEnum.air;
}

/**
 * @param props.epaisseur_lame_air : Épaisseur de la lame d'air saisie en mm
 * @returns Épaisseur de la lame d'air retenue en mm
 */
export function set_epaisseur_lame_air(props: {
	epaisseur_lame_air: number | null;
}): number {
	return props.epaisseur_lame_air ?? 6;
}

/**
 * @param props.presence_rupteur_pont_thermique : Présence d'un rupteur de pont thermique saisie
 * @returns Présence d'un rupteur de pont thermique retenue
 */
export function set_presence_rupteur_pont_thermique(props: {
	presence_rupteur_pont_thermique: boolean | null;
}): boolean {
	return props.presence_rupteur_pont_thermique ?? false;
}

/**
 * @returns État d'isolation de la baie
 */
export function set_isolation(props: {
	type_vitrage: ReturnType<typeof set_type_vitrage>;
}): boolean {
	switch (props.type_vitrage) {
		case models.enveloppe.baie.TypeVitrageEnum.triple_vitrage:
		case models.enveloppe.baie.TypeVitrageEnum.triple_vitrage_fe:
			return true;
		default:
			return false;
	}
}
