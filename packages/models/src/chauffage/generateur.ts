import { validate } from "@open-dpe-logement/schemas/chauffage/generateur";
import type { Consommations, Energie, UUID } from "../common/common.js";
import { EnergieEnum, isEnergieCombustion } from "../common/common.js";
import { buildEnum } from "../utils.js";

export function isGenerateur(data: unknown): data is Generateur {
	return validate(data).isValid;
}

export function isChaudiereCombustion(
	generateur: Generateur,
): generateur is ChaudiereCombustion {
	return (
		generateur.type === TypeGenerateurEnum.chaudiere &&
		null !== generateur.energie &&
		isEnergieCombustion(generateur.energie)
	);
}

export function isPoeleBouilleur(
	generateur: Generateur,
): generateur is PoeleBouilleur {
	return generateur.type === TypeGenerateurEnum.poele_bouilleur;
}

export function isPoeleInsert(
	generateur: Generateur,
): generateur is PoeleInsert {
	return (
		generateur.type === TypeGenerateurEnum.cuisiniere ||
		generateur.type === TypeGenerateurEnum.insert ||
		generateur.type === TypeGenerateurEnum.foyer_ferme ||
		generateur.type === TypeGenerateurEnum.poele
	);
}

export function isGenerateurAirChaudCombustion(
	generateur: Generateur,
): generateur is GenerateurAirChaudCombustion {
	return (
		generateur.type === TypeGenerateurEnum.generateur_air_chaud &&
		null !== generateur.energie &&
		isEnergieCombustion(generateur.energie)
	);
}

export function isRadiateurGaz(
	generateur: Generateur,
): generateur is RadiateurGaz {
	return generateur.type === TypeGenerateurEnum.radiateur_gaz;
}

export function isChaudiereElectrique(
	generateur: Generateur,
): generateur is ChaudiereElectrique {
	return (
		generateur.type === TypeGenerateurEnum.chaudiere &&
		generateur.energie === EnergieChauffageEnum.electricite
	);
}

export function isEmetteurElectrique(
	generateur: Generateur,
): generateur is EmetteurElectrique {
	return (
		(generateur.type === TypeGenerateurEnum.convecteur_bi_jonction ||
			generateur.type === TypeGenerateurEnum.convecteur_electrique ||
			generateur.type === TypeGenerateurEnum.generateur_air_chaud ||
			generateur.type === TypeGenerateurEnum.panneau_rayonnant_electrique ||
			generateur.type === TypeGenerateurEnum.plafond_rayonnant_electrique ||
			generateur.type === TypeGenerateurEnum.plancher_rayonnant_electrique ||
			generateur.type === TypeGenerateurEnum.radiateur_electrique ||
			generateur.type ===
				TypeGenerateurEnum.radiateur_electrique_accumulation) &&
		generateur.energie === EnergieChauffageEnum.electricite
	);
}

export function isPAC(generateur: Generateur): generateur is PAC {
	return (
		(generateur.type === TypeGenerateurEnum.pac_air_air ||
			generateur.type === TypeGenerateurEnum.pac_air_eau ||
			generateur.type === TypeGenerateurEnum.pac_eau_eau ||
			generateur.type === TypeGenerateurEnum.pac_eau_glycolee_eau ||
			generateur.type === TypeGenerateurEnum.pac_geothermique) &&
		generateur.bienergie === null
	);
}

export function isPACHybride(generateur: Generateur): generateur is PACHybride {
	return (
		(generateur.type === TypeGenerateurEnum.pac_air_eau ||
			generateur.type === TypeGenerateurEnum.pac_eau_eau ||
			generateur.type === TypeGenerateurEnum.pac_eau_glycolee_eau ||
			generateur.type === TypeGenerateurEnum.pac_geothermique) &&
		generateur.bienergie !== null
	);
}

export function isReseauChaleur(
	generateur: Generateur,
): generateur is ReseauChaleur {
	return generateur.type === TypeGenerateurEnum.reseau_chaleur;
}

export function isGenerateurCollectifInconnu(
	generateur: Generateur,
): generateur is GenerateurCollectifInconnu {
	return generateur.type === null;
}

export function isGenerateurMultiBatiment(generateur: Generateur): boolean {
	return generateur.position.generateur_multi_batiment;
}

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur
 */
export type Generateur =
	| ChaudiereCombustion
	| PoeleBouilleur
	| PoeleInsert
	| GenerateurAirChaudCombustion
	| RadiateurGaz
	| ChaudiereElectrique
	| EmetteurElectrique
	| PAC
	| PACHybride
	| ReseauChaleur
	| GenerateurCollectifInconnu;

export type GenerateurWithData<T extends Generateur = Generateur> = T & {
	data: GenerateurData;
};

export type GenerateurData = {
	rdim: number;
	pn: number;
	pdim: number;
	pch: number;
	paux: number;
	scop: number | null;
	rpn: number | null;
	rpint: number | null;
	qp0: number | null;
	pveilleuse: number | null;
	tfonc30: number | null;
	tfonc100: number | null;
	qgen_rec: number;
	qgen: number;
	consommations: Consommations;
};

export type Position = {
	cascade: Cascade | null;
	position_chaudiere: PositionChaudiere | null;
	generateur_collectif: boolean;
	generateur_multi_batiment: boolean;
	position_volume_chauffe: boolean;
	generateur_mixte_id: UUID | null;
	reseau_chaleur_id: string | null;
};

export type Signaletique = {
	pn: number | null;
	label: Label | null;
	scop: number | null;
	mode_combustion: ModeCombustion | null;
	presence_ventouse: boolean | null;
	presence_regulation: boolean | null;
	pveilleuse: number | null;
	qp0: number | null;
	rpn: number | null;
	rpint: number | null;
	tfonc30: number | null;
	tfonc100: number | null;
};

export type GenerateurProps = {
	id: UUID;
	description: string;
	type: TypeGenerateur | null;
	energie: EnergieChauffage | null;
	bienergie: Bienergie | null;
	annee_installation: number | null;
	position: Position;
	signaletique: Signaletique;
};

export type GenerateurType<
	T extends {
		type?: GenerateurProps["type"];
		energie?: GenerateurProps["energie"];
		bienergie?: GenerateurProps["bienergie"];
		annee_installation?: GenerateurProps["annee_installation"];
		position?: {
			[K in keyof T["position"]]: K extends keyof GenerateurProps["position"]
				? GenerateurProps["position"][K]
				: never;
		};
		signaletique?: {
			[K in keyof T["signaletique"]]: K extends keyof GenerateurProps["signaletique"]
				? GenerateurProps["signaletique"][K]
				: never;
		};
	},
> = GenerateurProps & T;

export type GenerateurCombustion = GenerateurType<{
	type:
		| typeof TypeGenerateurEnum.chaudiere
		| typeof TypeGenerateurEnum.cuisiniere
		| typeof TypeGenerateurEnum.foyer_ferme
		| typeof TypeGenerateurEnum.insert
		| typeof TypeGenerateurEnum.poele
		| typeof TypeGenerateurEnum.poele_bouilleur
		| typeof TypeGenerateurEnum.radiateur_gaz
		| typeof TypeGenerateurEnum.generateur_air_chaud;
	energie: Exclude<
		EnergieChauffage,
		| typeof EnergieChauffageEnum.electricite
		| typeof EnergieChauffageEnum.reseau_chaleur
	>;
	bienergie: null;
	position: {
		reseau_chaleur_id: null;
	};
	signaletique: {
		scop: null;
	};
}>;

export type ChaudiereCombustion = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chaudiere;
		signaletique: {
			label: null;
		};
	}
>;

export type PoeleBouilleur = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.poele_bouilleur;
		energie:
			| typeof EnergieChauffageEnum.bois_buche
			| typeof EnergieChauffageEnum.bois_plaquette
			| typeof EnergieChauffageEnum.bois_granule;
		signaletique: {
			label: null;
		};
	}
>;

export type PoeleInsert = GenerateurType<
	GenerateurCombustion & {
		type:
			| typeof TypeGenerateurEnum.cuisiniere
			| typeof TypeGenerateurEnum.insert
			| typeof TypeGenerateurEnum.foyer_ferme
			| typeof TypeGenerateurEnum.poele;
		position: {
			cascade: null;
			position_chaudiere: null;
			generateur_collectif: false;
			generateur_multi_batiment: false;
			position_volume_chauffe: true;
			generateur_mixte_id: null;
		};
		signaletique: {
			label: typeof LabelEnum.flamme_verte | null;
		} & {
			[K in Exclude<keyof Signaletique, "pn" | "label">]: null;
		};
	}
>;

export type GenerateurAirChaudCombustion = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.generateur_air_chaud;
		signaletique: {
			label: null;
			mode_combustion:
				| typeof ModeCombustionEnum.standard
				| typeof ModeCombustionEnum.condensation
				| null;
		};
	}
>;

export type RadiateurGaz = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.radiateur_gaz;
		energie:
			| typeof EnergieChauffageEnum.gaz_naturel
			| typeof EnergieChauffageEnum.gpl;
		position: {
			cascade: null;
			position_chaudiere: null;
			generateur_collectif: false;
			generateur_multi_batiment: false;
			position_volume_chauffe: true;
			generateur_mixte_id: null;
		};
		signaletique: {
			label: typeof LabelEnum.flamme_verte | null;
		} & {
			[K in Exclude<keyof Signaletique, "pn" | "label" | "rpn">]: null;
		};
	}
>;

export type GenerateurElectrique = GenerateurType<{
	type: TypeGenerateurElectrique;
	energie: typeof EnergieChauffageEnum.electricite;
	bienergie: null;
	position: {
		cascade: null;
		reseau_chaleur_id: null;
	};
	signaletique: {
		[K in Exclude<keyof Signaletique, "pn" | "label">]: null;
	};
}>;

export type ChaudiereElectrique = GenerateurType<
	GenerateurElectrique & {
		type:
			| typeof TypeGenerateurEnum.chaudiere
			| typeof TypeGenerateurEnum.generateur_air_chaud;
		signaletique: {
			label: null;
		};
	}
>;

export type EmetteurElectrique = GenerateurType<
	GenerateurElectrique & {
		type: Exclude<
			GenerateurElectrique["type"],
			typeof TypeGenerateurEnum.chaudiere
		>;
	}
>;

export type GenerateurThermodynamique = GenerateurType<{
	type: TypeGenerateurThermodynamique;
	position: {
		cascade: null;
		reseau_chaleur_id: null;
	};
}>;

export type PAC = GenerateurType<
	GenerateurThermodynamique & {
		bienergie: null;
		position: {
			position_chaudiere: null;
		};
		signaletique: {
			[K in Exclude<keyof Signaletique, "pn" | "scop">]: null;
		};
	}
>;

const base: Generateur = {
	id: "uuid()",
	description: "Pompe à chaleur air/eau",
	type: "pac_air_eau",
	energie: "electricite",
	bienergie: null,
	annee_installation: null,
	position: {
		cascade: null,
		position_chaudiere: null,
		generateur_collectif: false,
		generateur_multi_batiment: false,
		position_volume_chauffe: true,
		generateur_mixte_id: null,
		reseau_chaleur_id: null,
	},
	signaletique: {
		scop: 3.5,
		pn: null,
		label: null,
		mode_combustion: null,
		presence_ventouse: null,
		presence_regulation: null,
		pveilleuse: null,
		qp0: null,
		rpn: null,
		rpint: null,
		tfonc30: null,
		tfonc100: null,
	},
};

export type PACHybride = GenerateurType<
	GenerateurThermodynamique & {
		type:
			| typeof TypeGenerateurEnum.pac_air_eau
			| typeof TypeGenerateurEnum.pac_eau_eau
			| typeof TypeGenerateurEnum.pac_eau_glycolee_eau
			| typeof TypeGenerateurEnum.pac_geothermique;
		bienergie: Bienergie;
		signaletique: {
			label: null;
		};
	}
>;

export type ReseauChaleur = GenerateurType<{
	type: typeof TypeGenerateurEnum.reseau_chaleur;
	energie: typeof EnergieChauffageEnum.reseau_chaleur;
	bienergie: null;
	position: {
		cascade: null;
		position_chaudiere: null;
		generateur_collectif: true;
		generateur_multi_batiment: true;
		position_volume_chauffe: false;
		generateur_mixte_id: null;
	};
	signaletique: {
		[P in keyof Signaletique]: null;
	};
}>;

export type GenerateurCollectifInconnu = GenerateurType<{
	type: null;
	energie: null;
	bienergie: null;
	position: {
		cascade: null;
		position_chaudiere: null;
		generateur_collectif: true;
		position_volume_chauffe: false;
		generateur_mixte_id: null;
		reseau_chaleur_id: null;
	};
	signaletique: {
		[P in keyof Signaletique]: null;
	};
}>;

export const TYPES_GENERATEUR = [
	"chaudiere",
	"convecteur_bi_jonction",
	"convecteur_electrique",
	"cuisiniere",
	"foyer_ferme",
	"insert",
	"generateur_air_chaud",
	"pac_air_air",
	"pac_air_eau",
	"pac_eau_eau",
	"pac_eau_glycolee_eau",
	"pac_geothermique",
	"panneau_rayonnant_electrique",
	"plafond_rayonnant_electrique",
	"plancher_rayonnant_electrique",
	"poele",
	"poele_bouilleur",
	"radiateur_electrique",
	"radiateur_electrique_accumulation",
	"radiateur_gaz",
	"reseau_chaleur",
] as const;
export type TypeGenerateur = (typeof TYPES_GENERATEUR)[number];
export const TypeGenerateurEnum = buildEnum(TYPES_GENERATEUR);

export const TYPES_GENERATEUR_THERMODYNAMIQUE = [
	TypeGenerateurEnum.pac_air_air,
	TypeGenerateurEnum.pac_air_eau,
	TypeGenerateurEnum.pac_eau_eau,
	TypeGenerateurEnum.pac_eau_glycolee_eau,
	TypeGenerateurEnum.pac_geothermique,
] as const satisfies readonly TypeGenerateur[];

export type TypeGenerateurThermodynamique =
	(typeof TYPES_GENERATEUR_THERMODYNAMIQUE)[number];

export function isTypeGenerateurThermodynamique(
	type: TypeGenerateur | null,
): boolean {
	return (
		type !== null &&
		(TYPES_GENERATEUR_THERMODYNAMIQUE as readonly TypeGenerateur[]).includes(
			type,
		)
	);
}

export const TYPES_GENERATEUR_COMBUSTION = [
	TypeGenerateurEnum.chaudiere,
	TypeGenerateurEnum.cuisiniere,
	TypeGenerateurEnum.foyer_ferme,
	TypeGenerateurEnum.insert,
	TypeGenerateurEnum.poele,
	TypeGenerateurEnum.poele_bouilleur,
	TypeGenerateurEnum.radiateur_gaz,
	TypeGenerateurEnum.generateur_air_chaud,
] as const satisfies readonly TypeGenerateur[];
export type TypeGenerateurCombustion =
	(typeof TYPES_GENERATEUR_COMBUSTION)[number];

export function isTypeGenerateurCombustion(
	type: TypeGenerateur | null,
): boolean {
	return (
		type !== null &&
		(TYPES_GENERATEUR_COMBUSTION as readonly TypeGenerateur[]).includes(type)
	);
}

export const TYPES_GENERATEUR_ELECTRIQUE = [
	TypeGenerateurEnum.chaudiere,
	TypeGenerateurEnum.generateur_air_chaud,
	TypeGenerateurEnum.convecteur_bi_jonction,
	TypeGenerateurEnum.convecteur_electrique,
	TypeGenerateurEnum.panneau_rayonnant_electrique,
	TypeGenerateurEnum.plafond_rayonnant_electrique,
	TypeGenerateurEnum.plancher_rayonnant_electrique,
	TypeGenerateurEnum.radiateur_electrique,
	TypeGenerateurEnum.radiateur_electrique_accumulation,
] as const satisfies readonly TypeGenerateur[];
export type TypeGenerateurElectrique =
	(typeof TYPES_GENERATEUR_ELECTRIQUE)[number];

export function isTypeGenerateurElectrique(
	type: TypeGenerateur | null,
): boolean {
	return (
		type !== null &&
		(TYPES_GENERATEUR_ELECTRIQUE as readonly TypeGenerateur[]).includes(type)
	);
}

export const ENERGIES_CHAUFFAGE = [
	EnergieEnum.electricite,
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
	EnergieEnum.fioul,
	EnergieEnum.charbon,
	EnergieEnum.bois_buche,
	EnergieEnum.bois_plaquette,
	EnergieEnum.bois_granule,
	EnergieEnum.reseau_chaleur,
] as const satisfies readonly Energie[];
export type EnergieChauffage = (typeof ENERGIES_CHAUFFAGE)[number];
export const EnergieChauffageEnum = buildEnum(ENERGIES_CHAUFFAGE);

export const BIENERGIES = [
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
	EnergieEnum.fioul,
] as const satisfies readonly EnergieChauffage[];
export type Bienergie = (typeof BIENERGIES)[number];
export const BienergieEnum = buildEnum(BIENERGIES);

export const POSITIONS_CHAUDIERE = [
	"chaudiere_murale",
	"chaudiere_sol",
] as const;
export type PositionChaudiere = (typeof POSITIONS_CHAUDIERE)[number];
export const PositionChaudiereEnum = buildEnum(POSITIONS_CHAUDIERE);

export const LABELS = ["flamme_verte", "nf_performance"] as const;
export type Label = (typeof LABELS)[number];
export const LabelEnum = buildEnum(LABELS);

export const MODES_COMBUSTION = [
	"standard",
	"basse_temperature",
	"condensation",
] as const;
export type ModeCombustion = (typeof MODES_COMBUSTION)[number];
export const ModeCombustionEnum = buildEnum(MODES_COMBUSTION);

export type Cascade = 0 | 1 | 2;
