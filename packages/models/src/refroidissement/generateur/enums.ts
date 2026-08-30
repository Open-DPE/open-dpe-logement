import * as z from "zod";
import { ENERGIES, EnergieEnum } from "../../common/enums.js";

export const TYPES_GENERATEUR = {
	pac_air_air: "pac_air_air",
	pac_air_eau: "pac_air_eau",
	pac_eau_eau: "pac_eau_eau",
	pac_eau_glycolee_eau: "pac_eau_glycolee_eau",
	pac_geothermique: "pac_geothermique",
	autre_systeme_thermodynamique: "autre_systeme_thermodynamique",
	autre: "autre",
	reseau_froid: "reseau_froid",
} as const;

export const TypeGenerateurEnum = z.enum(TYPES_GENERATEUR);
export const TypeGenerateurPacEnum = TypeGenerateurEnum.extract([
	TYPES_GENERATEUR.pac_air_air,
	TYPES_GENERATEUR.pac_air_eau,
	TYPES_GENERATEUR.pac_eau_eau,
	TYPES_GENERATEUR.pac_eau_glycolee_eau,
	TYPES_GENERATEUR.pac_geothermique,
	TYPES_GENERATEUR.autre_systeme_thermodynamique,
]);

export const EnergieRefroidissementEnum = EnergieEnum.extract([
	ENERGIES.electricite,
	ENERGIES.gaz_naturel,
	ENERGIES.gpl,
	ENERGIES.reseau_froid,
]);

export type TypeGenerateurEnum = z.infer<typeof TypeGenerateurEnum>;
export type TypeGenerateurPacEnum = z.infer<typeof TypeGenerateurPacEnum>;
export type EnergieRefroidissementEnum = z.infer<
	typeof EnergieRefroidissementEnum
>;
