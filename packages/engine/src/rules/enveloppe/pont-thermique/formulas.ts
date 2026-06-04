import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import { ValeurForfaitaireError } from "#utils/errors.js";

/**
 * @doctrine enveloppe.pont_thermique.pt
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

export type KptBaseProps<T extends object> = {
	kpt_saisi: number | null;
	type_liaison: models.enveloppe.pontThermique.TypeLiaison;
	isolation_mur: ReturnType<typeof set_isolation_mur>;
	type_isolation_mur: ReturnType<typeof set_type_isolation_mur> | null;
} & T;

export type KptPlancherBasMurProps = KptBaseProps<{
	type_liaison: typeof models.enveloppe.pontThermique.TypeLiaisonEnum.plancher_bas_mur;
	isolation_plancher: ReturnType<typeof set_isolation_plancher_bas>;
	type_isolation_plancher: ReturnType<
		typeof set_type_isolation_plancher_bas
	> | null;
}>;

export type KptPlancherHautMurProps = KptBaseProps<{
	type_liaison: typeof models.enveloppe.pontThermique.TypeLiaisonEnum.plancher_haut_mur;
	isolation_plancher: ReturnType<typeof set_isolation_plancher_haut>;
	type_isolation_plancher: ReturnType<
		typeof set_type_isolation_plancher_haut
	> | null;
}>;

export type KptPlancherIntermediaireMurProps = KptBaseProps<{
	type_liaison: typeof models.enveloppe.pontThermique.TypeLiaisonEnum.plancher_intermediaire_mur;
}>;

export type KptRefendMurProps = KptBaseProps<{
	type_liaison: typeof models.enveloppe.pontThermique.TypeLiaisonEnum.refend_mur;
}>;

export type KptOuvertureMurProps = KptBaseProps<{
	type_liaison:
		| typeof models.enveloppe.pontThermique.TypeLiaisonEnum.porte_mur
		| typeof models.enveloppe.pontThermique.TypeLiaisonEnum.baie_mur;
	type_pose_menuiserie: models.enveloppe.common.TypePose;
	presence_retour_isolation: ReturnType<typeof set_presence_retour_isolation>;
	largeur_dormant: ReturnType<typeof set_largeur_dormant>;
}>;

/**
 * @doctrine enveloppe.pont_thermique.kpt
 * @see abaques.enveloppe.pontThermique.kpt
 * @throws ValeurForfaitaireError
 * @returns Valeur du pont thermique en W/(m.K)
 */
export function calcule_kpt(
	props:
		| KptPlancherBasMurProps
		| KptPlancherHautMurProps
		| KptPlancherIntermediaireMurProps
		| KptRefendMurProps
		| KptOuvertureMurProps,
): number {
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
 * @return Type d'isolation du mur retenu
 */
export function set_type_isolation_mur(props: {
	type_isolation: models.enveloppe.common.TypeIsolation | null;
}): models.enveloppe.common.TypeIsolation {
	return props.type_isolation ?? models.enveloppe.common.TypeIsolationEnum.iti;
}

/**
 * @param props.type_isolation : Type d'isolation du plancher haut saisi
 * @return Type d'isolation du plancher haut retenu
 */
export function set_type_isolation_plancher_haut(props: {
	type_isolation: models.enveloppe.common.TypeIsolation | null;
}): models.enveloppe.common.TypeIsolation {
	return props.type_isolation ?? models.enveloppe.common.TypeIsolationEnum.ite;
}

/**
 * @param props.type_isolation : Type d'isolation du plancher bas saisi
 * @return Type d'isolation du plancher bas retenu
 */
export function set_type_isolation_plancher_bas(props: {
	type_isolation: models.enveloppe.common.TypeIsolation | null;
}): models.enveloppe.common.TypeIsolation {
	return props.type_isolation ?? models.enveloppe.common.TypeIsolationEnum.ite;
}

/**
 * @param props.largeur_dormant : Largeur du dormant saisie en mm
 * @return Largeur du dormant retenue en mm
 */
export function set_largeur_dormant(props: {
	largeur_dormant: number | null;
}): number {
	return props.largeur_dormant ?? 50;
}

/**
 * @param props.presence_retour_isolation : Présence d'un retour d'isolation au niveau de la menuiserie saisie
 * @return Présence d'un retour d'isolation au niveau de la menuiserie retenue
 */
export function set_presence_retour_isolation(props: {
	presence_retour_isolation: boolean | null;
}): boolean {
	return props.presence_retour_isolation ?? false;
}
