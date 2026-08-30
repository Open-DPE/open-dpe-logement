import * as z from "zod";
import { ENERGIES, EnergieEnum } from "../../common/enums.js";

export const TYPES_GENERATEUR = {
	chauffe_eau: "chauffe_eau",
	chaudiere: "chaudiere",
	cet_air_ambiant: "cet_air_ambiant",
	cet_air_exterieur: "cet_air_exterieur",
	cet_air_extrait: "cet_air_extrait",
	pac_air_eau: "pac_air_eau",
	pac_eau_eau: "pac_eau_eau",
	pac_eau_glycolee_eau: "pac_eau_glycolee_eau",
	pac_geothermique: "pac_geothermique",
	poele_bouilleur: "poele_bouilleur",
	reseau_chaleur: "reseau_chaleur",
} as const;

export const POSITIONS_CHAUFFE_EAU = {
	chauffe_eau_vertical: "chauffe_eau_vertical",
	chauffe_eau_horizontal: "chauffe_eau_horizontal",
} as const;

export const LABELS = {
	ne_performance_a: "ne_performance_a",
	ne_performance_b: "ne_performance_b",
	ne_performance_c: "ne_performance_c",
} as const;

export const MODES_COMBUSTION = {
	standard: "standard",
	basse_temperature: "basse_temperature",
	condensation: "condensation",
} as const;

export const TYPES_STOCKAGE = {
	integre: "integre",
	independant: "independant",
} as const;

export const TypeGenerateurEnum = z.enum(TYPES_GENERATEUR);

export const PositionChauffeEauEnum = z.enum(POSITIONS_CHAUFFE_EAU);

export const LabelEnum = z.enum(LABELS);

export const ModeCombustionEnum = z.enum(MODES_COMBUSTION);

export const TypeStockageEnum = z.enum(TYPES_STOCKAGE);

export const TypeGenerateurPacEnum = TypeGenerateurEnum.extract([
	TYPES_GENERATEUR.cet_air_ambiant,
	TYPES_GENERATEUR.cet_air_exterieur,
	TYPES_GENERATEUR.cet_air_extrait,
	TYPES_GENERATEUR.pac_air_eau,
	TYPES_GENERATEUR.pac_eau_eau,
	TYPES_GENERATEUR.pac_eau_glycolee_eau,
	TYPES_GENERATEUR.pac_geothermique,
]);

export const EnergieEcsEnum = EnergieEnum.extract([
	ENERGIES.electricite,
	ENERGIES.gaz_naturel,
	ENERGIES.gpl,
	ENERGIES.fioul,
	ENERGIES.bois_buche,
	ENERGIES.bois_plaquette,
	ENERGIES.bois_granule,
	ENERGIES.charbon,
	ENERGIES.reseau_chaleur,
]);

export const BienergieEnum = EnergieEnum.extract([
	ENERGIES.gaz_naturel,
	ENERGIES.gpl,
	ENERGIES.fioul,
	ENERGIES.bois_buche,
	ENERGIES.bois_plaquette,
	ENERGIES.bois_granule,
]);

export type TypeGenerateurEnum = z.infer<typeof TypeGenerateurEnum>;
export type TypeGenerateurPacEnum = z.infer<typeof TypeGenerateurPacEnum>;
export type EnergieEcsEnum = z.infer<typeof EnergieEcsEnum>;
export type BienergieEnum = z.infer<typeof BienergieEnum>;
export type PositionChauffeEauEnum = z.infer<typeof PositionChauffeEauEnum>;
export type LabelEnum = z.infer<typeof LabelEnum>;
export type ModeCombustionEnum = z.infer<typeof ModeCombustionEnum>;
export type TypeStockageEnum = z.infer<typeof TypeStockageEnum>;
