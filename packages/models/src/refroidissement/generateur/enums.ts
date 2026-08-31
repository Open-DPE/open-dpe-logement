import * as z from "zod";
import { Energie } from "../../common/enums.js";

export const TypeGenerateur = z.enum({
	pac_air_air: "pac_air_air",
	pac_air_eau: "pac_air_eau",
	pac_eau_eau: "pac_eau_eau",
	pac_eau_glycolee_eau: "pac_eau_glycolee_eau",
	pac_geothermique: "pac_geothermique",
	autre_systeme_thermodynamique: "autre_systeme_thermodynamique",
	autre: "autre",
	reseau_froid: "reseau_froid",
});

export type TypeGenerateur = z.infer<typeof TypeGenerateur>;

export const TypeGenerateurPac = TypeGenerateur.extract([
	"pac_air_air",
	"pac_air_eau",
	"pac_eau_eau",
	"pac_eau_glycolee_eau",
	"pac_geothermique",
	"autre_systeme_thermodynamique",
]);

export type TypeGenerateurPac = z.infer<typeof TypeGenerateurPac>;

export const EnergieRefroidissement = Energie.extract([
	"electricite",
	"gaz_naturel",
	"gpl",
	"reseau_froid",
]);

export type EnergieRefroidissement = z.infer<typeof EnergieRefroidissement>;
