import { SCHEMA_KEYS } from "@open-dpe-logement/schemas";
import type { Consommations, Energie, UUID } from "#/common/common";
import { buildEnum, createGuard } from "#/utils";

export const isGenerateur = createGuard<Generateur>(
	SCHEMA_KEYS["refroidissement/generateur"],
);

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

type GenerateurBase = {
	id: UUID;
	description: string;
	type: TypeGenerateur;
	energie: EnergieRefroidissement;
	annee_installation: number | null;
	seer: number | null;
	reseau_froid_id: string | null;
};

export type GenerateurPAC = GenerateurBase & {
	type: TYPE_GENERATEUR_PAC;
	energie: typeof EnergieRefroidissementEnum.electricite;
	reseau_froid_id: null;
};

export type GenerateurClimatiseur = GenerateurBase & {
	type: typeof TypeGenerateurEnum.autre;
	energie: Exclude<
		EnergieRefroidissement,
		typeof EnergieRefroidissementEnum.reseau_froid
	>;
	reseau_froid_id: null;
};

export type GenerateurReseauFroid = GenerateurBase & {
	type: typeof TypeGenerateurEnum.reseau_froid;
	energie: typeof EnergieRefroidissementEnum.reseau_froid;
};

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
	"pac_air_air",
	"pac_air_eau",
	"pac_eau_eau",
	"pac_eau_glycolee_eau",
	"pac_geothermique",
	"autre_systeme_thermodynamique",
] as const satisfies readonly TypeGenerateur[];
type TYPE_GENERATEUR_PAC = (typeof TYPES_GENERATEUR_PAC)[number];

export const ENERGIES_REFROIDISSEMENT: readonly Energie[] = [
	"electricite",
	"gaz_naturel",
	"gpl",
	"reseau_froid",
] as const satisfies readonly Energie[];
export type EnergieRefroidissement = (typeof ENERGIES_REFROIDISSEMENT)[number];
export const EnergieRefroidissementEnum = buildEnum(ENERGIES_REFROIDISSEMENT);
