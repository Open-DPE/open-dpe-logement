import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import { ValeurForfaitaireError } from "../../errors.js";

/**
 * @formule enveloppe.pont_thermique.pt
 * @param props.type_liaison : Type de liaison
 * @param props.l : Longueur du pont thermique en m
 * @param props.pont_thermique_partiel : Indique si le pont thermique est partiel ou total
 * @returns Valeur du pont thermique en W/(m.K)
 */
export function calcule_pt(props: {
	type_liaison: models.enveloppe.pontThermique.TypeLiaison;
	kpt: ReturnType<typeof calcule_kpt>;
	l: number;
	pont_thermique_partiel: boolean;
}): number {
	const { type_liaison, kpt, l, pont_thermique_partiel } = props;
	const c = pont_thermique_partiel ? 0.5 : 1;

	const enums = models.enveloppe.pontThermique.TypeLiaisonEnum;

	switch (type_liaison) {
		case enums.refend_mur:
			return c * l * kpt;
		case enums.plancher_intermediaire_mur:
			return c * l * kpt;
		default:
			return l * kpt;
	}
}

/**
 * @formule enveloppe.pont_thermique.kpt
 * @see abaques.enveloppe.pontThermique.kpt
 * @throws ValeurForfaitaireError
 * @returns Valeur du pont thermique en W/(m.K)
 */
export function calcule_kpt(props: {
	kpt_saisi: number | null;
	type_liaison: models.enveloppe.pontThermique.TypeLiaison;
	isolation_mur: boolean;
	type_isolation_mur: ReturnType<typeof set_type_isolation_mur> | null;
	isolation_plancher: ReturnType<
		typeof set_isolation_plancher_bas | typeof set_isolation_plancher_haut
	> | null;
	type_isolation_plancher: ReturnType<
		| typeof set_type_isolation_plancher_bas
		| typeof set_type_isolation_plancher_haut
	> | null;
	type_pose_menuiserie: models.enveloppe.common.TypePose | null;
	presence_retour_isolation: ReturnType<
		typeof set_presence_retour_isolation
	> | null;
	largeur_dormant: ReturnType<typeof set_largeur_dormant> | null;
}): number {
	const { kpt_saisi } = props;
	if (kpt_saisi) return kpt_saisi;
	const abaque = abaques.enveloppe.pontThermique.kpt;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.kpt;
}

/**
 * @param props.isolation : État d'isolation du mur saisi
 * @param props.annee_construction : Année de construction
 * @returns État d'isolation du mur retenu
 */
export function set_isolation_mur(props: {
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	const { isolation, annee_construction } = props;
	if (isolation !== null) return isolation;
	return annee_construction >= 1975;
}

/**
 * @param props.isolation : État d'isolation du plancher haut saisi
 * @param props.annee_construction : Année de construction
 * @returns État d'isolation du plancher haut retenu
 */
export function set_isolation_plancher_haut(props: {
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	const { isolation, annee_construction } = props;
	if (isolation !== null) return isolation;
	return annee_construction >= 1975;
}

/**
 * @param props.isolation : État d'isolation du plancher bas saisi
 * @param props.annee_construction : Année de construction
 * @returns État d'isolation du plancher bas retenu
 */
export function set_isolation_plancher_bas(props: {
	mitoyennete: models.enveloppe.common.Mitoyennete;
	isolation: boolean | null;
	annee_construction: number;
}): boolean {
	const { mitoyennete, isolation, annee_construction } = props;

	if (isolation !== null) return isolation;

	return mitoyennete === models.enveloppe.common.MitoyenneteEnum.terre_plein
		? annee_construction >= 2001
		: annee_construction >= 1975;
}

/**
 * @param props.type_isolation : Type d'isolation du mur saisi
 * @returns Type d'isolation du mur retenu
 */
export function set_type_isolation_mur(props: {
	type_isolation: models.enveloppe.common.TypeIsolation | null;
}): models.enveloppe.common.TypeIsolation {
	return props.type_isolation ?? models.enveloppe.common.TypeIsolationEnum.iti;
}

/**
 * @param props.type_isolation : Type d'isolation du plancher haut saisi
 * @returns Type d'isolation du plancher haut retenu
 */
export function set_type_isolation_plancher_haut(props: {
	type_isolation: models.enveloppe.common.TypeIsolation | null;
}): models.enveloppe.common.TypeIsolation {
	return props.type_isolation ?? models.enveloppe.common.TypeIsolationEnum.ite;
}

/**
 * @param props.type_isolation : Type d'isolation du plancher bas saisi
 * @returns Type d'isolation du plancher bas retenu
 */
export function set_type_isolation_plancher_bas(props: {
	type_isolation: models.enveloppe.common.TypeIsolation | null;
}): models.enveloppe.common.TypeIsolation {
	return props.type_isolation ?? models.enveloppe.common.TypeIsolationEnum.ite;
}

/**
 * @param props.largeur_dormant : Largeur du dormant saisie en mm
 * @returns Largeur du dormant retenue en mm
 */
export function set_largeur_dormant(props: {
	largeur_dormant: number | null;
}): number {
	return props.largeur_dormant ?? 50;
}

/**
 * @param props.presence_retour_isolation : Présence d'un retour d'isolation au niveau de la menuiserie saisie
 * @returns Présence d'un retour d'isolation au niveau de la menuiserie retenue
 */
export function set_presence_retour_isolation(props: {
	presence_retour_isolation: boolean | null;
}): boolean {
	return props.presence_retour_isolation ?? false;
}
