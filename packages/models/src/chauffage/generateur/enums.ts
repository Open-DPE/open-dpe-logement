import * as z from "zod";
import { ENERGIES, EnergieEnum } from "../../common/enums.js";

export const TYPES_GENERATEUR = {
	chaudiere: "chaudiere",
	convecteur_bi_jonction: "convecteur_bi_jonction",
	convecteur_electrique: "convecteur_electrique",
	panneau_rayonnant_electrique: "panneau_rayonnant_electrique",
	plafond_rayonnant_electrique: "plafond_rayonnant_electrique",
	plancher_rayonnant_electrique: "plancher_rayonnant_electrique",
	radiateur_electrique: "radiateur_electrique",
	radiateur_electrique_accumulation: "radiateur_electrique_accumulation",
	generateur_air_chaud: "generateur_air_chaud",
	pac_air_air: "pac_air_air",
	pac_air_eau: "pac_air_eau",
	pac_eau_eau: "pac_eau_eau",
	pac_eau_glycolee_eau: "pac_eau_glycolee_eau",
	pac_geothermique: "pac_geothermique",
	cuisiniere: "cuisiniere",
	foyer_ferme: "foyer_ferme",
	insert: "insert",
	poele: "poele",
	poele_bouilleur: "poele_bouilleur",
	radiateur_gaz: "radiateur_gaz",
	reseau_chaleur: "reseau_chaleur",
} as const;

export const TypeGenerateurEnum = z.enum(TYPES_GENERATEUR);
export type TypeGenerateurEnum = z.infer<typeof TypeGenerateurEnum>;

export const POSITIONS_CHAUDIERE = {
	chaudiere_murale: "chaudiere_murale",
	chaudiere_sol: "chaudiere_sol",
} as const;

export const PositionChaudiereEnum = z.enum(POSITIONS_CHAUDIERE);
export type PositionChaudiereEnum = z.infer<typeof PositionChaudiereEnum>;

export const LABELS = {
	flamme_verte: "flamme_verte",
	nf_performance: "nf_performance",
} as const;

export const LabelEnum = z.enum(LABELS);
export type LabelEnum = z.infer<typeof LabelEnum>;

export const MODES_COMBUSTION = {
	standard: "standard",
	basse_temperature: "basse_temperature",
	condensation: "condensation",
} as const;

export const ModeCombustionEnum = z.enum(MODES_COMBUSTION);
export type ModeCombustionEnum = z.infer<typeof ModeCombustionEnum>;

export const CASCADES = [0, 1, 2] as const;
export const CascadeEnum = z.union([
	z.literal(0),
	z.literal(1),
	z.literal(2),
]);
export type CascadeEnum = z.infer<typeof CascadeEnum>;

export const EnergieChauffageEnum = EnergieEnum.extract([
	ENERGIES.electricite,
	ENERGIES.gaz_naturel,
	ENERGIES.gpl,
	ENERGIES.fioul,
	ENERGIES.charbon,
	ENERGIES.bois_buche,
	ENERGIES.bois_plaquette,
	ENERGIES.bois_granule,
	ENERGIES.reseau_chaleur,
]);
export type EnergieChauffageEnum = z.infer<typeof EnergieChauffageEnum>;

export const BienergieEnum = EnergieEnum.extract([
	ENERGIES.gaz_naturel,
	ENERGIES.gpl,
	ENERGIES.fioul,
	ENERGIES.bois_buche,
	ENERGIES.bois_plaquette,
	ENERGIES.bois_granule,
]);
export type BienergieEnum = z.infer<typeof BienergieEnum>;
