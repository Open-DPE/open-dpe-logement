import { ENERGIES, EnergieEnum } from "./enums.js";

export function isGaz(value: EnergieEnum): boolean {
	return value === ENERGIES.gaz_naturel || value === ENERGIES.gpl;
}

export function isBois(value: EnergieEnum): boolean {
	return (
		value === ENERGIES.bois_buche ||
		value === ENERGIES.bois_plaquette ||
		value === ENERGIES.bois_granule
	);
}
