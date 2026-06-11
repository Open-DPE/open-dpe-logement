import { buildEnum } from "../utils";

export type NonEmptyArray<T> = [T, ...T[]];

export function toNonEmptyArray<T>(arr: T[]): NonEmptyArray<T> {
	if (arr.length === 0) throw new Error("Array is empty");
	return arr as NonEmptyArray<T>;
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
 * Données mensuelles aggrégées sur l'année
 */
export function reduceParMois(values: ParMois<number>): number {
	return Object.values(values).reduce((acc: number, v: number) => acc + v, 0);
}

/**
 * Fusionne plusieurs valeurs mensuelles
 */
export function mergeParMois(values: ParMois<number>[]): ParMois<number> {
	const result: ParMois<number> = {} as ParMois<number>;
	for (const mois of MOIS) {
		result[mois] = values.reduce((acc, v) => acc + v[mois], 0);
	}
	return result;
}

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
	"electricite_renouvelable",
	"electricite",
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

export const ENERGIES_GAZ: readonly Energie[] = [
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
] as const satisfies readonly Energie[];
export type EnergieGaz = (typeof ENERGIES_GAZ)[number];
export const EnergieGazEnum = buildEnum(ENERGIES_GAZ);

export function isEnergieGaz(energie: Energie): energie is EnergieGaz {
	return ENERGIES_GAZ.includes(energie);
}

export const ENERGIES_BOIS: readonly Energie[] = [
	EnergieEnum.bois_buche,
	EnergieEnum.bois_plaquette,
	EnergieEnum.bois_granule,
] as const satisfies readonly Energie[];
export type EnergieBois = (typeof ENERGIES_BOIS)[number];
export const EnergieBoisEnum = buildEnum(ENERGIES_BOIS);

export function isEnergieBois(energie: Energie): energie is EnergieBois {
	return ENERGIES_BOIS.includes(energie);
}

export const ENERGIES_COMBUSTION: readonly Energie[] = [
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
	EnergieEnum.fioul,
	EnergieEnum.bois_buche,
	EnergieEnum.bois_plaquette,
	EnergieEnum.bois_granule,
	EnergieEnum.charbon,
] as const satisfies readonly Energie[];

export type EnergieCombustion = Energie;

export function isEnergieCombustion(
	energie: Energie,
): energie is EnergieCombustion {
	return ENERGIES_COMBUSTION.includes(energie);
}

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

export type ParMois<T> = {
	[K in Mois]: T;
};

export type ParUsage<T> = {
	[K in Usage]?: T;
};

export type ParEnergie<T> = {
	[K in Energie]?: T;
};

/**
 * @see https://schemas.open-dpe.fr/common/components#/$defs/consommations
 */
export type Consommations = {
	[U in Usage]?: {
		[E in Energie]?: Consommation;
	};
};

export type ConsommationParEnergie = ParEnergie<Consommation>;
export type ConsommationParUsage = ParUsage<Consommation>;

export type Consommation = {
	cef: number;
	cep: number;
	eges: number;
};

const zeroConsommation: Consommation = { cef: 0, cep: 0, eges: 0 };

function addConsommation(a: Consommation, b: Consommation): Consommation {
	return {
		cef: a.cef + b.cef,
		cep: a.cep + b.cep,
		eges: a.eges + b.eges,
	};
}

/**
 * @return Consommations par usage et par énergie aggrégées
 */
export function reduceConsommations(values: Consommations): Consommation {
	let result = zeroConsommation;
	for (const parEnergie of Object.values(values)) {
		for (const valeurs of Object.values(parEnergie)) {
			result = addConsommation(result, valeurs);
		}
	}
	return result;
}

/**
 * @return Consommations par usage et par énergie aggrégées par énergie
 */
export function reduceConsommationsParEnergie(
	values: Consommations,
): ConsommationParEnergie {
	const result: ConsommationParEnergie = {};

	for (const parEnergie of Object.values(values)) {
		for (const [energie, valeurs] of Object.entries(parEnergie) as [
			Energie,
			Consommation,
		][]) {
			result[energie] = addConsommation(
				result[energie] ?? zeroConsommation,
				valeurs,
			);
		}
	}

	return result;
}

/**
 * @return Consommations par usage et par énergie aggrégées par usage
 */
export function reduceConsommationsParUsage(
	values: Consommations,
): ConsommationParUsage {
	const result: ConsommationParUsage = {};

	for (const [usage, parEnergie] of Object.entries(values) as [
		Usage,
		ConsommationParEnergie,
	][]) {
		for (const valeurs of Object.values(parEnergie) as Consommation[]) {
			result[usage] = addConsommation(
				result[usage] ?? zeroConsommation,
				valeurs,
			);
		}
	}

	return result;
}

/**
 * Fusionne plusieurs consommations par usage et par énergie
 */
export function mergeConsommations(...values: Consommations[]): Consommations {
	const result: Consommations = {};

	for (const consommations of values) {
		for (const [usage, parEnergie] of Object.entries(consommations) as [
			Usage,
			ConsommationParEnergie,
		][]) {
			result[usage] ??= {};
			for (const [energie, valeurs] of Object.entries(parEnergie) as [
				Energie,
				Consommation,
			][]) {
				result[usage]![energie] = addConsommation(
					result[usage]![energie] ?? zeroConsommation,
					valeurs,
				);
			}
		}
	}

	return result;
}
