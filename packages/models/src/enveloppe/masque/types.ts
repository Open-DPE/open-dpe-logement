import * as z from "zod";
import { id, description, nombre_positif, non_applicable } from "../../common/types.js";
import { TYPES_MASQUE, TypeMasqueEnum, SecteurEnum } from "./enums.js";

const hauteurConnue = nombre_positif.lt(90);
const profondeurConnue = nombre_positif;

export const MasqueBase = z.object({
	id,
	description,
	type: TypeMasqueEnum,
	hauteur: hauteurConnue.nullable().default(null),
	profondeur: profondeurConnue.nullable().default(null),
	secteur: SecteurEnum.nullable().default(null),
});

export const MasqueLointainHomogene = MasqueBase.extend({
	type: TypeMasqueEnum.extract([TYPES_MASQUE.homogene]),
	hauteur: hauteurConnue,
	profondeur: non_applicable,
	secteur: non_applicable,
});

export const MasqueLointainNonHomogene = MasqueBase.extend({
	type: TypeMasqueEnum.extract([TYPES_MASQUE.non_homogene]),
	hauteur: hauteurConnue,
	secteur: SecteurEnum,
	profondeur: non_applicable,
});

export const MasqueProcheParoiLaterale = MasqueBase.extend({
	type: TypeMasqueEnum.extract([
		TYPES_MASQUE.paroi_laterale_sans_obstacle_au_sud,
		TYPES_MASQUE.paroi_laterale_avec_obstacle_au_sud,
	]),
	hauteur: non_applicable,
	profondeur: non_applicable,
	secteur: non_applicable,
});

export const MasqueProcheFondBalconOuLoggias = MasqueBase.extend({
	type: TypeMasqueEnum.extract([
		TYPES_MASQUE.fond_balcon,
		TYPES_MASQUE.fond_et_flanc_loggias,
	]),
	profondeur: profondeurConnue,
	hauteur: non_applicable,
	secteur: non_applicable,
});

export const MasqueProcheBalconOuAuvent = MasqueBase.extend({
	type: TypeMasqueEnum.extract([TYPES_MASQUE.balcon_ou_auvent]),
	profondeur: profondeurConnue,
	hauteur: non_applicable,
	secteur: non_applicable,
});

export const MasqueLointain = z.union([
	MasqueLointainHomogene,
	MasqueLointainNonHomogene,
]);

export const MasqueProche = z.union([
	MasqueProcheParoiLaterale,
	MasqueProcheFondBalconOuLoggias,
	MasqueProcheBalconOuAuvent,
]);

export const Masque = z.union([MasqueLointain, MasqueProche]);

export type Masque = z.infer<typeof Masque>;
export type MasqueBase = z.infer<typeof MasqueBase>;
export type MasqueLointain = z.infer<typeof MasqueLointain>;
export type MasqueProche = z.infer<typeof MasqueProche>;
export type MasqueLointainHomogene = z.infer<typeof MasqueLointainHomogene>;
export type MasqueLointainNonHomogene = z.infer<
	typeof MasqueLointainNonHomogene
>;
export type MasqueProcheParoiLaterale = z.infer<
	typeof MasqueProcheParoiLaterale
>;
export type MasqueProcheFondBalconOuLoggias = z.infer<
	typeof MasqueProcheFondBalconOuLoggias
>;
export type MasqueProcheBalconOuAuvent = z.infer<
	typeof MasqueProcheBalconOuAuvent
>;
