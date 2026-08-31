import { Energie } from "./enums.js";

export function isGaz(value: Energie): boolean {
	return value === Energie.enum.gaz_naturel || value === Energie.enum.gpl;
}

export function isBois(value: Energie): boolean {
	return (
		value === Energie.enum.bois_buche ||
		value === Energie.enum.bois_plaquette ||
		value === Energie.enum.bois_granule
	);
}
