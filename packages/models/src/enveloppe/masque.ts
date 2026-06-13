import type { UUID } from "../common/common.js";
import { buildEnum, createGuard } from "../utils.js";

export const isMasque = createGuard<Masque>("/enveloppe/masque");

export function isMasqueProche(masque: Masque): masque is MasqueProche {
	return TYPES_MASQUES_PROCHES.includes(masque.type);
}

export function isMasqueLointain(masque: Masque): masque is MasqueLointain {
	return !TYPES_MASQUES_PROCHES.includes(masque.type);
}

export function isMasqueLointainHomogene(
	masque: Masque,
): masque is MasqueLointainHomogene {
	return masque.type === TypeMasqueEnum.homogene;
}

export function isMasqueLointainNonHomogene(
	masque: Masque,
): masque is MasqueLointainNonHomogene {
	return masque.type === TypeMasqueEnum.non_homogene;
}

/**
 * @see https://schemas.open-dpe.fr/enveloppe/masque
 */
export type Masque = MasqueProche | MasqueLointain;

type MasqueG<T extends object> = {
	id: UUID;
	description: string;
	type: TypeMasque;
	hauteur: number | null;
	profondeur: number | null;
	secteur: Secteur | null;
} & T;

export type MasqueProche =
	| MasqueProcheParoiLaterale
	| MasqueProcheFondBalconOuLoggias
	| MasqueProcheBalconOuAuvent;

export type MasqueProcheParoiLaterale = MasqueG<{
	type:
		| typeof TypeMasqueEnum.paroi_laterale_sans_obstacle_au_sud
		| typeof TypeMasqueEnum.paroi_laterale_avec_obstacle_au_sud;
}>;

export type MasqueProcheFondBalconOuLoggias = MasqueG<{
	type:
		| typeof TypeMasqueEnum.fond_balcon
		| typeof TypeMasqueEnum.fond_et_flanc_loggias;
	profondeur: number;
}>;

export type MasqueProcheBalconOuAuvent = MasqueG<{
	type: typeof TypeMasqueEnum.balcon_ou_auvent;
	profondeur: number;
}>;

export type MasqueLointain = MasqueLointainHomogene | MasqueLointainNonHomogene;

export type MasqueLointainHomogene = MasqueG<{
	type: typeof TypeMasqueEnum.homogene;
	hauteur: number;
}>;

export type MasqueLointainNonHomogene = MasqueG<{
	type: typeof TypeMasqueEnum.non_homogene;
	hauteur: number;
	secteur: Secteur;
}>;

export const TYPES_MASQUES = [
	"homogene",
	"non_homogene",
	"fond_balcon",
	"fond_et_flanc_loggias",
	"balcon_ou_auvent",
	"paroi_laterale_sans_obstacle_au_sud",
	"paroi_laterale_avec_obstacle_au_sud",
] as const;
export type TypeMasque = (typeof TYPES_MASQUES)[number];
export const TypeMasqueEnum = buildEnum(TYPES_MASQUES);

export const TYPES_MASQUES_PROCHES: TypeMasque[] = [
	"fond_balcon",
	"fond_et_flanc_loggias",
	"balcon_ou_auvent",
	"paroi_laterale_sans_obstacle_au_sud",
	"paroi_laterale_avec_obstacle_au_sud",
] as const;
export type TypeMasqueProche = (typeof TYPES_MASQUES_PROCHES)[number];
export const TypeMasqueProcheEnum = buildEnum(TYPES_MASQUES_PROCHES);

export const SECTEURS = [
	"lateral",
	"lateral_sud",
	"central",
	"central_sud",
] as const;
export type Secteur = (typeof SECTEURS)[number];
export const SecteurEnum = buildEnum(SECTEURS);
