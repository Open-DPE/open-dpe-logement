import { buildEnum } from "../utils.js";
import { ENERGIES_COMBUSTION, EnergieEnum } from "../common/common.js";
import type {
	Consommations,
	Energie,
	EnergieBois,
	EnergieCombustion,
	UUID,
} from "../common/common.js";

export function isChaudiereCombustion(
	generateur: Generateur,
): generateur is ChaudiereCombustion {
	return (
		generateur.type === TypeGenerateurEnum.chaudiere &&
		(ENERGIES_COMBUSTION as readonly Energie[]).includes(generateur.energie)
	);
}

export function isPoeleBoisBouilleur(
	generateur: Generateur,
): generateur is PoeleBoisBouilleur {
	return generateur.type === TypeGenerateurEnum.poele_bouilleur;
}

export function isChauffeEauGaz(
	generateur: Generateur,
): generateur is ChauffeEauGaz {
	return (
		generateur.type === TypeGenerateurEnum.chauffe_eau &&
		(generateur.energie === EnergieEnum.gaz_naturel ||
			generateur.energie === EnergieEnum.gpl)
	);
}

export function isChaudiereElectrique(
	generateur: Generateur,
): generateur is ChaudiereElectrique {
	return (
		generateur.type === TypeGenerateurEnum.chaudiere &&
		generateur.energie === EnergieEnum.electricite
	);
}

export function isChauffeEauElectrique(
	generateur: Generateur,
): generateur is ChauffeEauElectrique {
	return (
		generateur.type === TypeGenerateurEnum.chauffe_eau &&
		generateur.energie === EnergieEnum.electricite
	);
}

export function isChauffeEauThermodynamique(
	generateur: Generateur,
): generateur is ChauffeEauThermodynamique {
	return (
		generateur.type === TypeGenerateurEnum.cet_air_ambiant ||
		generateur.type === TypeGenerateurEnum.cet_air_exterieur ||
		generateur.type === TypeGenerateurEnum.cet_air_extrait
	);
}

export function isPacDoubleService(
	generateur: Generateur,
): generateur is PacDoubleService {
	return (
		generateur.type === TypeGenerateurEnum.pac_double_service &&
		null === generateur.bienergie
	);
}

export function isPacHybride(generateur: Generateur): generateur is PacHybride {
	return (
		generateur.type === TypeGenerateurEnum.pac_double_service &&
		null !== generateur.bienergie
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
	return null === generateur.type;
}

export function isGenerateurMultiBatiment(generateur: Generateur): boolean {
	return generateur.position.generateur_multi_batiment;
}

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur
 */
export type Generateur =
	| PoeleBoisBouilleur
	| ChaudiereCombustion
	| ChauffeEauGaz
	| ChaudiereElectrique
	| ChauffeEauElectrique
	| ChauffeEauThermodynamique
	| PacDoubleService
	| PacHybride
	| ReseauChaleur
	| GenerateurCollectifInconnu;

export type GenerateurWithData<T extends Generateur = Generateur> = T & {
	data: GenerateurData;
};

export type GenerateurData = {
	rdim: number;
	pn: number;
	pdim: number;
	pecs: number;
	paux: number;
	cop: number | null;
	rpn: number | null;
	qp0: number | null;
	pveilleuse: number | null;
	cr: number;
	qgw: number;
	qgen: number;
	consommations: Consommations;
};

export type Position = {
	position_chauffe_eau: PositionChauffeEau | null;
	generateur_collectif: boolean;
	generateur_multi_batiment: boolean;
	position_volume_chauffe: boolean;
	generateur_mixte_id: UUID | null;
	reseau_chaleur_id: string | null;
};

export type Signaletique = {
	pn: number | null;
	cop: number | null;
	label: Label | null;
	mode_combustion: ModeCombustion | null;
	presence_ventouse: boolean | null;
	pveilleuse: number | null;
	qp0: number | null;
	rpn: number | null;
};

export type Stockage = {
	volume: number;
	type: TypeStockage;
	position_volume_chauffe: boolean;
};

export type GenerateurProps = {
	id: UUID;
	description: string;
	type: TypeGenerateur | null;
	energie: EnergieEcs | null;
	bienergie: Bienergie | null;
	annee_installation: number | null;
	position: Position;
	stockage: Stockage | null;
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
		| typeof TypeGenerateurEnum.poele_bouilleur
		| typeof TypeGenerateurEnum.chauffe_eau;
	energie: EnergieCombustion;
	bienergie: null;
	position: {
		reseau_chaleur_id: null;
	};
	signaletique: {
		cop: null;
		label: null;
	};
}>;

export type ChaudiereCombustion = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chaudiere;
		position: {
			position_chauffe_eau: null;
		};
	}
>;

export type PoeleBoisBouilleur = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.poele_bouilleur;
		energie: EnergieBois;
		position: {
			position_chauffe_eau: null;
			generateur_collectif: false;
			generateur_multi_batiment: false;
		};
	}
>;

export type ChauffeEauGaz = GenerateurType<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chauffe_eau;
		energie: typeof EnergieEnum.gaz_naturel | typeof EnergieEnum.gpl;
		position: {
			generateur_collectif: false;
			generateur_multi_batiment: false;
			generateur_mixte_id: null;
		};
		signaletique: {
			mode_combustion:
				| typeof ModeCombustionEnum.standard
				| typeof ModeCombustionEnum.condensation;
		};
	}
>;

export type GenerateurElectrique = GenerateurType<{
	type:
		| typeof TypeGenerateurEnum.chauffe_eau
		| typeof TypeGenerateurEnum.chaudiere;
	energie: typeof EnergieEnum.electricite;
	bienergie: null;
	position: {
		reseau_chaleur_id: null;
	};
	signaletique: {
		cop: null;
		mode_combustion: null;
		presence_ventouse: null;
		pveilleuse: null;
		qp0: null;
		rpn: null;
	};
}>;

export type ChaudiereElectrique = GenerateurType<
	GenerateurElectrique & {
		type: typeof TypeGenerateurEnum.chaudiere;
		position: {
			position_chauffe_eau: null;
		};
		signaletique: {
			label: null;
		};
	}
>;

export type ChauffeEauElectrique = GenerateurType<
	GenerateurElectrique & {
		type: typeof TypeGenerateurEnum.chauffe_eau;
		position: {
			position_chauffe_eau: PositionChauffeEau;
			generateur_collectif: false;
			generateur_multi_batiment: false;
			generateur_mixte_id: null;
		};
	}
>;

export type GenerateurThermodynamique = GenerateurType<{
	type:
		| typeof TypeGenerateurEnum.cet_air_ambiant
		| typeof TypeGenerateurEnum.cet_air_exterieur
		| typeof TypeGenerateurEnum.cet_air_extrait
		| typeof TypeGenerateurEnum.pac_double_service;
	energie: typeof EnergieEnum.electricite;
	position: {
		position_chauffe_eau: null;
		reseau_chaleur_id: null;
	};
	signaletique: {
		label: null;
	};
}>;

export type ChauffeEauThermodynamique = GenerateurType<
	GenerateurThermodynamique & {
		type:
			| typeof TypeGenerateurEnum.cet_air_ambiant
			| typeof TypeGenerateurEnum.cet_air_exterieur
			| typeof TypeGenerateurEnum.cet_air_extrait;
		bienergie: null;
		position: {
			generateur_mixte_id: null;
			generateur_multi_batiment: false;
		};
		signaletique: {
			mode_combustion: null;
			presence_ventouse: null;
			pveilleuse: null;
			qp0: null;
			rpn: null;
		};
	}
>;

export type PacDoubleService = GenerateurType<
	GenerateurThermodynamique & {
		type: typeof TypeGenerateurEnum.pac_double_service;
		bienergie: null;
		signaletique: {
			mode_combustion: null;
			presence_ventouse: null;
			pveilleuse: null;
			qp0: null;
			rpn: null;
		};
	}
>;

export type PacHybride = GenerateurType<
	GenerateurThermodynamique & {
		type: typeof TypeGenerateurEnum.pac_double_service;
		bienergie: Bienergie;
	}
>;

export type ReseauChaleur = GenerateurType<{
	type: typeof TypeGenerateurEnum.reseau_chaleur;
	energie: typeof EnergieEnum.reseau_chaleur;
	bienergie: null;
	position: {
		generateur_collectif: true;
		generateur_multi_batiment: true;
		position_volume_chauffe: false;
		generateur_mixte_id: null;
	};
	signaletique: {
		pn: null;
		cop: null;
		label: null;
		mode_combustion: null;
		presence_ventouse: null;
		pveilleuse: null;
		qp0: null;
		rpn: null;
	};
}>;

export type GenerateurCollectifInconnu = GenerateurType<{
	type: null;
	energie: null;
	bienergie: null;
	position: {
		generateur_collectif: true;
		position_volume_chauffe: false;
		position_chauffe_eau: null;
		generateur_mixte_id: null;
		reseau_chaleur_id: null;
	};
	signaletique: {
		pn: null;
		cop: null;
		label: null;
		mode_combustion: null;
		presence_ventouse: null;
		pveilleuse: null;
		qp0: null;
		rpn: null;
	};
}>;

export const TYPES_GENERATEUR = [
	"chauffe_eau",
	"chaudiere",
	"cet_air_ambiant",
	"cet_air_exterieur",
	"cet_air_extrait",
	"pac_double_service",
	"poele_bouilleur",
	"reseau_chaleur",
] as const;
export type TypeGenerateur = (typeof TYPES_GENERATEUR)[number];
export const TypeGenerateurEnum = buildEnum(TYPES_GENERATEUR);

export const TYPES_PAC = [
	TypeGenerateurEnum.cet_air_ambiant,
	TypeGenerateurEnum.cet_air_exterieur,
	TypeGenerateurEnum.cet_air_extrait,
	TypeGenerateurEnum.pac_double_service,
] as const satisfies readonly TypeGenerateur[];
export type TypePac = (typeof TYPES_PAC)[number];
export const TypePacEnum = buildEnum(TYPES_PAC);

export const ENERGIES_ECS = [
	EnergieEnum.electricite,
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
	EnergieEnum.fioul,
	EnergieEnum.bois_buche,
	EnergieEnum.bois_plaquette,
	EnergieEnum.bois_granule,
	EnergieEnum.charbon,
	EnergieEnum.reseau_chaleur,
] as const satisfies readonly Energie[];
export type EnergieEcs = (typeof ENERGIES_ECS)[number];
export const EnergieEcsEnum = buildEnum(ENERGIES_ECS);

export const BIENERGIES = [
	EnergieEnum.gaz_naturel,
	EnergieEnum.gpl,
	EnergieEnum.fioul,
] as const satisfies readonly EnergieEcs[];
export type Bienergie = (typeof BIENERGIES)[number];
export const BienergieEnum = buildEnum(BIENERGIES);

export const POSITIONS_CHAUFFE_EAU = [
	"chauffe_eau_vertical",
	"chauffe_eau_horizontal",
] as const;
export type PositionChauffeEau = (typeof POSITIONS_CHAUFFE_EAU)[number];
export const PositionChauffeEauEnum = buildEnum(POSITIONS_CHAUFFE_EAU);

export const LABELS = [
	"ne_performance_a",
	"ne_performance_b",
	"ne_performance_c",
] as const;
export type Label = (typeof LABELS)[number];
export const LabelEnum = buildEnum(LABELS);

export const MODES_COMBUSTION = [
	"standard",
	"basse_temperature",
	"condensation",
] as const;
export type ModeCombustion = (typeof MODES_COMBUSTION)[number];
export const ModeCombustionEnum = buildEnum(MODES_COMBUSTION);

export const TYPES_STOCKAGE = ["integre", "independant"] as const;
export type TypeStockage = (typeof TYPES_STOCKAGE)[number];
export const TypeStockageEnum = buildEnum(TYPES_STOCKAGE);
