import * as z from "zod";

export const ORIENTATIONS = {
	nord: "nord",
	sud: "sud",
	est: "est",
	ouest: "ouest",
	nord_est: "nord_est",
	sud_est: "sud_est",
	nord_ouest: "nord_ouest",
	sud_ouest: "sud_ouest",
} as const;
export const OrientationEnum = z.enum(ORIENTATIONS);
export type OrientationEnum = z.infer<typeof OrientationEnum>;

export const ORIENTATIONS_CARDINALES = {
	nord: ORIENTATIONS.nord,
	sud: ORIENTATIONS.sud,
	est: ORIENTATIONS.est,
	ouest: ORIENTATIONS.ouest,
} as const;
export const OrientationCardinaleEnum = z.enum(ORIENTATIONS_CARDINALES);
export type OrientationCardinaleEnum = z.infer<typeof OrientationCardinaleEnum>;

export const USAGES = {
	chauffage: "chauffage",
	ecs: "ecs",
	refroidissement: "refroidissement",
	eclairage: "eclairage",
	auxiliaire: "auxiliaire",
} as const;
export const UsageEnum = z.enum(USAGES);
export type UsageEnum = z.infer<typeof UsageEnum>;

export const SCENARIOS = {
	conventionnel: "conventionnel",
	depensier: "depensier",
} as const;
export const ScenarioEnum = z.enum(SCENARIOS);
export type ScenarioEnum = z.infer<typeof ScenarioEnum>;

export const MOIS = {
	Janvier: "01",
	Février: "02",
	Mars: "03",
	Avril: "04",
	Mai: "05",
	Juin: "06",
	Juillet: "07",
	Août: "08",
	Septembre: "09",
	Octobre: "10",
	Novembre: "11",
	Décembre: "12",
} as const;

export const MoisEnum = z.enum(MOIS);
export type MoisEnum = z.infer<typeof MoisEnum>;

export const ENERGIES = {
	electricite_renouvelable: "electricite_renouvelable",
	electricite: "electricite",
	gaz_naturel: "gaz_naturel",
	gpl: "gpl",
	fioul: "fioul",
	bois_buche: "bois_buche",
	bois_plaquette: "bois_plaquette",
	bois_granule: "bois_granule",
	charbon: "charbon",
	reseau_chaleur: "reseau_chaleur",
	reseau_froid: "reseau_froid",
} as const;
export const EnergieEnum = z.enum(ENERGIES);
export type EnergieEnum = z.infer<typeof EnergieEnum>;
