import { buildEnum } from "../utils";

export type NonEmptyArray<T> = [T, ...T[]];

export function toNonEmptyArray<T>(arr: T[]): NonEmptyArray<T> {
	if (arr.length === 0) throw new Error("Array is empty");
	return arr as NonEmptyArray<T>;
}

export type PositiveNumber = number & { readonly _brand: "positive" };

export function toPositive(n: number): PositiveNumber {
	if (n <= 0) throw new Error(`${n} n'est pas positif`);
	return n as PositiveNumber;
}

export type NonNegativeNumber = number & { readonly _brand: "nonNegative" };

export function toNonNegative(n: number): NonNegativeNumber {
	if (n < 0) throw new Error(`${n} n'est pas non négatif`);
	return n as NonNegativeNumber;
}

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/id
 */
export type UUID = string & { readonly __brand: "UUID" };

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/mois
 */
export const MOIS = [
	"01",
	"02",
	"03",
	"04",
	"05",
	"06",
	"07",
	"08",
	"09",
	"10",
	"11",
	"12",
] as const;
export type Mois = (typeof MOIS)[number];
export const MoisEnum = buildEnum(MOIS);

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/moisItem
 */
export type ParMois<T> = {
	[K in Mois]: T;
};

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/scenario
 */
export const SCENARIOS = ["conventionnel", "depensier"] as const;
export type Scenario = (typeof SCENARIOS)[number];
export const ScenarioEnum = buildEnum(SCENARIOS);

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/orientation
 */
export const ORIENTATIONS = [
	"nord",
	"sud",
	"est",
	"ouest",
	"nord_est",
	"sud_est",
	"nord_ouest",
	"sud_ouest",
] as const;
export type Orientation = (typeof ORIENTATIONS)[number];
export const OrientationEnum = buildEnum(ORIENTATIONS);

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/orientation_cardinale
 */
export const ORIENTATIONS_CARDINALES = [
	OrientationEnum.nord,
	OrientationEnum.sud,
	OrientationEnum.est,
	OrientationEnum.ouest,
] as const satisfies readonly Orientation[];
export type OrientationCardinale = (typeof ORIENTATIONS_CARDINALES)[number];
export const OrientationCardinaleEnum = buildEnum(ORIENTATIONS_CARDINALES);

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/usage
 */
export const USAGES = [
	"chauffage",
	"ecs",
	"refroidissement",
	"eclairage",
	"auxiliaire",
] as const;
export type Usage = (typeof USAGES)[number];
export const UsageEnum = buildEnum(USAGES);

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/energie
 */
export const ENERGIES = [
	"electricite",
	"electricite_renouvelable",
	"gaz_naturel",
	"gpl",
	"fioul",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
	"charbon",
	"reseau_chaleur",
	"reseau_froid",
] as const;
export type Energie = (typeof ENERGIES)[number];
export const EnergieEnum = buildEnum(ENERGIES);

export const ENERGIES_BOIS: readonly Energie[] = [
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
] as const satisfies readonly Energie[];
export type EnergieBois = Extract<
	Energie,
	| typeof EnergieEnum.bois_buche
	| typeof EnergieEnum.bois_plaquette
	| typeof EnergieEnum.bois_granule
>;
export const EnergieBoisEnum = buildEnum(ENERGIES_BOIS);

export const ENERGIES_COMBUSTION: readonly Energie[] = [
	"gaz_naturel",
	"gpl",
	"fioul",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
	"charbon",
] as const satisfies readonly Energie[];

export type EnergieCombustion = Exclude<
	Energie,
	| typeof EnergieEnum.electricite
	| typeof EnergieEnum.electricite_renouvelable
	| typeof EnergieEnum.reseau_chaleur
	| typeof EnergieEnum.reseau_froid
>;
export const EnergieCombustionEnum = buildEnum(ENERGIES_COMBUSTION);

/**
 * @see https://schemas.open-dpe.fr/common/primitives#/$defs/type_pertes
 */
export const TYPES_PERTES = ["generation", "stockage", "distribution"] as const;
export type TypePertes = (typeof TYPES_PERTES)[number];
export const TypePerteEnum = buildEnum(TYPES_PERTES);

export const ETIQUETTES = ["A", "B", "C", "D", "E", "F", "G"] as const;
export type Etiquette = (typeof ETIQUETTES)[number];
export const EtiquetteEnum = buildEnum(ETIQUETTES);

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/adresse
 */
export type Adresse = {
	ban_id: string | null;
	nom: string;
	code_postal: string;
	code_insee: string;
	commune: string;
};

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/consommationsItem
 */
export type Consommation = {
	usage: Usage;
	energie: Energie;
	cef: number;
	cep: number;
	eges: number;
};

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/consommations
 */
export type Consommations = Consommation[];

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/pertesItem
 */
export type Perte = {
	usage: Usage;
	type: TypePertes;
	pertes: number;
	pertes_recuperables: number;
};

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/pertes
 */
export type Pertes = Perte[];
