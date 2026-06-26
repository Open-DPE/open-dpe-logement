import type { Consommations, Energie, UUID } from "../common/common.js";
import { EnergieEnum } from "../common/common.js";
import { buildEnum } from "../utils.js";

/**
 * @see https://schemas.open-dpe.fr/refroidissement/generateur
 */
export type Generateur =
	| GenerateurPAC
	| GenerateurClimatiseur
	| GenerateurReseauFroid;

export type GenerateurWithData<T extends Generateur = Generateur> = T & {
	data: GenerateurData;
};

type GenerateurType<
	T extends {
		type: TypeGenerateur;
		energie: EnergieRefroidissement;
		reseau_froid_id?: string | null;
	},
> = {
	id: UUID;
	description: string;
	type: TypeGenerateur;
	energie: EnergieRefroidissement;
	annee_installation: number | null;
	seer: number | null;
	reseau_froid_id: string | null;
} & T;

export type GenerateurPAC = GenerateurType<{
	type: TypeGenerateurPac;
	energie: typeof EnergieRefroidissementEnum.electricite;
	reseau_froid_id: null;
}>;

export type GenerateurClimatiseur = GenerateurType<{
	type: typeof TypeGenerateurEnum.autre;
	energie: Exclude<
		EnergieRefroidissement,
		typeof EnergieRefroidissementEnum.reseau_froid
	>;
	reseau_froid_id: null;
}>;

export type GenerateurReseauFroid = GenerateurType<{
	type: typeof TypeGenerateurEnum.reseau_froid;
	energie: typeof EnergieRefroidissementEnum.reseau_froid;
	reseau_froid_id: string | null;
}>;

export type GenerateurData = {
	rdim: number;
	eer: number;
	consommations: Consommations;
};

export const TYPES_GENERATEUR = [
	"pac_air_air",
	"pac_air_eau",
	"pac_eau_eau",
	"pac_eau_glycolee_eau",
	"pac_geothermique",
	"autre_systeme_thermodynamique",
	"autre",
	"reseau_froid",
] as const;
export type TypeGenerateur = (typeof TYPES_GENERATEUR)[number];
export const TypeGenerateurEnum = buildEnum(TYPES_GENERATEUR);

const TYPES_GENERATEUR_PAC = [
	TypeGenerateurEnum.pac_air_air,
	TypeGenerateurEnum.pac_air_eau,
	TypeGenerateurEnum.pac_eau_eau,
	TypeGenerateurEnum.pac_eau_glycolee_eau,
	TypeGenerateurEnum.pac_geothermique,
	TypeGenerateurEnum.autre_systeme_thermodynamique,
] as const satisfies readonly TypeGenerateur[];
type TypeGenerateurPac = (typeof TYPES_GENERATEUR_PAC)[number];

export const ENERGIES_REFROIDISSEMENT = [
	EnergieEnum.electricite,
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
	EnergieEnum.reseau_froid,
] as const satisfies readonly Energie[];
export type EnergieRefroidissement = (typeof ENERGIES_REFROIDISSEMENT)[number];
export const EnergieRefroidissementEnum = buildEnum(ENERGIES_REFROIDISSEMENT);
