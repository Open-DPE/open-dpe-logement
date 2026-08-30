import { TYPES_MASQUE } from "./enums.js";
import {
	MasqueBase,
	Masque,
	MasqueLointain,
	MasqueProche,
	MasqueLointainHomogene,
	MasqueLointainNonHomogene,
	MasqueProcheParoiLaterale,
	MasqueProcheFondBalconOuLoggias,
	MasqueProcheBalconOuAuvent,
} from "./types.js";

export function isMasque(value: MasqueBase): value is Masque {
	return isMasqueLointain(value) || isMasqueProche(value);
}

export function isMasqueLointain(value: MasqueBase): value is MasqueLointain {
	return (
		isMasqueLointainHomogene(value) || isMasqueLointainNonHomogene(value)
	);
}

export function isMasqueProche(value: MasqueBase): value is MasqueProche {
	return (
		isMasqueProcheParoiLaterale(value) ||
		isMasqueProcheFondBalconOuLoggias(value) ||
		isMasqueProcheBalconOuAuvent(value)
	);
}

export function isMasqueLointainHomogene(
	value: MasqueBase,
): value is MasqueLointainHomogene {
	return value.type === TYPES_MASQUE.homogene;
}

export function isMasqueLointainNonHomogene(
	value: MasqueBase,
): value is MasqueLointainNonHomogene {
	return value.type === TYPES_MASQUE.non_homogene;
}

export function isMasqueProcheParoiLaterale(
	value: MasqueBase,
): value is MasqueProcheParoiLaterale {
	return (
		value.type === TYPES_MASQUE.paroi_laterale_sans_obstacle_au_sud ||
		value.type === TYPES_MASQUE.paroi_laterale_avec_obstacle_au_sud
	);
}

export function isMasqueProcheFondBalconOuLoggias(
	value: MasqueBase,
): value is MasqueProcheFondBalconOuLoggias {
	return (
		value.type === TYPES_MASQUE.fond_balcon ||
		value.type === TYPES_MASQUE.fond_et_flanc_loggias
	);
}

export function isMasqueProcheBalconOuAuvent(
	value: MasqueBase,
): value is MasqueProcheBalconOuAuvent {
	return value.type === TYPES_MASQUE.balcon_ou_auvent;
}
