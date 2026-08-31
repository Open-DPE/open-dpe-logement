import * as z from "zod";

export const Orientation = z.enum({
	nord: "nord",
	sud: "sud",
	est: "est",
	ouest: "ouest",
	nord_est: "nord_est",
	sud_est: "sud_est",
	nord_ouest: "nord_ouest",
	sud_ouest: "sud_ouest",
});

export type Orientation = z.infer<typeof Orientation>;

export const OrientationCardinale = Orientation.extract([
	"nord",
	"sud",
	"est",
	"ouest",
]);

export type OrientationCardinale = z.infer<typeof OrientationCardinale>;

export const Usage = z.enum({
	chauffage: "chauffage",
	ecs: "ecs",
	refroidissement: "refroidissement",
	eclairage: "eclairage",
	auxiliaire: "auxiliaire",
});

export type Usage = z.infer<typeof Usage>;

export const Scenario = z.enum({
	conventionnel: "conventionnel",
	depensier: "depensier",
});

export type Scenario = z.infer<typeof Scenario>;

export const Mois = z.enum({
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
});

export type Mois = z.infer<typeof Mois>;

export const Energie = z.enum({
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
});

export type Energie = z.infer<typeof Energie>;
