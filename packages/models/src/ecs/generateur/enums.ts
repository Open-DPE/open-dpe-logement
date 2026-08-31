import * as z from "zod";
import { Energie } from "../../common/enums.js";

export const TypeGenerateur = z.enum({
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
});

export type TypeGenerateur = z.infer<typeof TypeGenerateur>;

export const TypeGenerateurPac = TypeGenerateur.extract([
	"cet_air_ambiant",
	"cet_air_exterieur",
	"cet_air_extrait",
	"pac_air_eau",
	"pac_eau_eau",
	"pac_eau_glycolee_eau",
	"pac_geothermique",
]);

export type TypeGenerateurPac = z.infer<typeof TypeGenerateurPac>;

export const PositionChauffeEau = z.enum({
	chauffe_eau_vertical: "chauffe_eau_vertical",
	chauffe_eau_horizontal: "chauffe_eau_horizontal",
});

export type PositionChauffeEau = z.infer<typeof PositionChauffeEau>;

export const LabelGenerateur = z.enum({
	ne_performance_a: "ne_performance_a",
	ne_performance_b: "ne_performance_b",
	ne_performance_c: "ne_performance_c",
});

export type LabelGenerateur = z.infer<typeof LabelGenerateur>;

export const ModeCombustion = z.enum({
	standard: "standard",
	basse_temperature: "basse_temperature",
	condensation: "condensation",
});

export type ModeCombustion = z.infer<typeof ModeCombustion>;

export const TypeStockage = z.enum({
	integre: "integre",
	independant: "independant",
});

export type TypeStockage = z.infer<typeof TypeStockage>;

export const EnergieEcs = Energie.extract([
	"electricite",
	"gaz_naturel",
	"gpl",
	"fioul",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
	"charbon",
	"reseau_chaleur",
]);

export type EnergieEcs = z.infer<typeof EnergieEcs>;

export const Bienergie = Energie.extract([
	"gaz_naturel",
	"gpl",
	"fioul",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
]);

export type Bienergie = z.infer<typeof Bienergie>;
