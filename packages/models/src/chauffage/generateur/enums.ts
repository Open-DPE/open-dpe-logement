import * as z from "zod";
import { Energie } from "../../common/enums.js";

export const TypeGenerateur = z.enum({
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
});

export type TypeGenerateur = z.infer<typeof TypeGenerateur>;

export const PositionChaudiere = z.enum({
	chaudiere_murale: "chaudiere_murale",
	chaudiere_sol: "chaudiere_sol",
});

export type PositionChaudiere = z.infer<typeof PositionChaudiere>;

export const LabelGenerateur = z.enum({
	flamme_verte: "flamme_verte",
	nf_performance: "nf_performance",
});

export type LabelGenerateur = z.infer<typeof LabelGenerateur>;

export const ModeCombustion = z.enum({
	standard: "standard",
	basse_temperature: "basse_temperature",
	condensation: "condensation",
});

export type ModeCombustion = z.infer<typeof ModeCombustion>;

export const Cascade = z.union([z.literal(0), z.literal(1), z.literal(2)]);

export type Cascade = z.infer<typeof Cascade>;

export const EnergieChauffage = Energie.extract([
	"electricite",
	"gaz_naturel",
	"gpl",
	"fioul",
	"charbon",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
	"reseau_chaleur",
]);

export type EnergieChauffage = z.infer<typeof EnergieChauffage>;

export const Bienergie = Energie.extract([
	"gaz_naturel",
	"gpl",
	"fioul",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
]);

export type Bienergie = z.infer<typeof Bienergie>;
