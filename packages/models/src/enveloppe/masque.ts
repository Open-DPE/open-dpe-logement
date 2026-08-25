import type { UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/masque
 */
export type Masque = MasqueProche | MasqueLointain;

export type MasqueBase = {
	id: UUID;
	description: string;
	type: TypeMasque;
	hauteur: number | null;
	profondeur: number | null;
	secteur: Secteur | null;
};

type _Masque<
	T extends {
		type: TypeMasque;
		hauteur: number | null;
		profondeur: number | null;
		secteur: Secteur | null;
	},
> = MasqueBase & T;

export type MasqueProche =
	| MasqueProcheParoiLaterale
	| MasqueProcheFondBalconOuLoggias
	| MasqueProcheBalconOuAuvent;

export function isMasqueProche(value: MasqueBase): value is MasqueProche {
	return (
		isMasqueProcheParoiLaterale(value) ||
		isMasqueProcheFondBalconOuLoggias(value) ||
		isMasqueProcheBalconOuAuvent(value)
	);
}

export type MasqueProcheParoiLaterale = _Masque<{
	type:
		| typeof TypeMasqueEnum.paroi_laterale_sans_obstacle_au_sud
		| typeof TypeMasqueEnum.paroi_laterale_avec_obstacle_au_sud;
	hauteur: null;
	profondeur: null;
	secteur: null;
}>;

export function isMasqueProcheParoiLaterale(
	value: MasqueBase,
): value is MasqueProcheParoiLaterale {
	return (
		value.type === TypeMasqueEnum.paroi_laterale_sans_obstacle_au_sud ||
		value.type === TypeMasqueEnum.paroi_laterale_avec_obstacle_au_sud
	);
}

export type MasqueProcheFondBalconOuLoggias = _Masque<{
	type:
		| typeof TypeMasqueEnum.fond_balcon
		| typeof TypeMasqueEnum.fond_et_flanc_loggias;
	profondeur: number;
	hauteur: null;
	secteur: null;
}>;

export function isMasqueProcheFondBalconOuLoggias(
	value: MasqueBase,
): value is MasqueProcheFondBalconOuLoggias {
	return (
		value.type === TypeMasqueEnum.fond_balcon ||
		value.type === TypeMasqueEnum.fond_et_flanc_loggias
	);
}

export type MasqueProcheBalconOuAuvent = _Masque<{
	type: typeof TypeMasqueEnum.balcon_ou_auvent;
	profondeur: number;
	hauteur: null;
	secteur: null;
}>;

export function isMasqueProcheBalconOuAuvent(
	value: MasqueBase,
): value is MasqueProcheBalconOuAuvent {
	return value.type === TypeMasqueEnum.balcon_ou_auvent;
}

export type MasqueLointain = MasqueLointainHomogene | MasqueLointainNonHomogene;

export function isMasqueLointain(value: MasqueBase): value is MasqueLointain {
	return isMasqueLointainHomogene(value) || isMasqueLointainNonHomogene(value);
}

export type MasqueLointainHomogene = _Masque<{
	type: typeof TypeMasqueEnum.homogene;
	hauteur: number;
	profondeur: null;
	secteur: null;
}>;

export function isMasqueLointainHomogene(
	value: MasqueBase,
): value is MasqueLointainHomogene {
	return value.type === TypeMasqueEnum.homogene;
}

export type MasqueLointainNonHomogene = _Masque<{
	type: typeof TypeMasqueEnum.non_homogene;
	hauteur: number;
	secteur: Secteur;
	profondeur: null;
}>;

export function isMasqueLointainNonHomogene(
	value: MasqueBase,
): value is MasqueLointainNonHomogene {
	return value.type === TypeMasqueEnum.non_homogene;
}

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
