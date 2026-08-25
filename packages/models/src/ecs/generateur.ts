import { buildEnum } from "../utils.js";
import { ENERGIES_COMBUSTION, EnergieEnum } from "../common/common.js";
import type {
	Consommations,
	Energie,
	EnergieBois,
	EnergieCombustion,
	UUID,
} from "../common/common.js";

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

export function isGenerateur(value: GenerateurBase): value is Generateur {
	return (
		isPoeleBoisBouilleur(value) ||
		isChaudiereCombustion(value) ||
		isChauffeEauGaz(value) ||
		isChaudiereElectrique(value) ||
		isChauffeEauElectrique(value) ||
		isChauffeEauThermodynamique(value) ||
		isPacDoubleService(value) ||
		isPacDoubleServiceHybride(value) ||
		isReseauChaleur(value) ||
		isGenerateurCollectifInconnu(value)
	);
}

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

export type GenerateurBase = {
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

type _Generateur<
	T extends {
		type?: GenerateurBase["type"];
		energie?: GenerateurBase["energie"];
		bienergie?: GenerateurBase["bienergie"];
		annee_installation?: GenerateurBase["annee_installation"];
		position?: {
			[K in keyof T["position"]]: K extends keyof GenerateurBase["position"]
				? GenerateurBase["position"][K]
				: never;
		};
		signaletique?: {
			[K in keyof T["signaletique"]]: K extends keyof GenerateurBase["signaletique"]
				? GenerateurBase["signaletique"][K]
				: never;
		};
	},
> = GenerateurBase & T;

export type GenerateurCombustion = _Generateur<{
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

export function isGenerateurCombustion(
	value: GenerateurBase,
): value is GenerateurCombustion {
	return (
		isChaudiereCombustion(value) ||
		isPoeleBoisBouilleur(value) ||
		isChauffeEauGaz(value)
	);
}

export type ChaudiereCombustion = _Generateur<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chaudiere;
		position: {
			position_chauffe_eau: null;
		};
	}
>;

export function isChaudiereCombustion(
	value: GenerateurBase,
): value is ChaudiereCombustion {
	return (
		value.type === TypeGenerateurEnum.chaudiere &&
		value.energie !== null &&
		(ENERGIES_COMBUSTION as readonly Energie[]).includes(value.energie)
	);
}
export type PoeleBoisBouilleur = _Generateur<
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

export function isPoeleBoisBouilleur(
	value: GenerateurBase,
): value is PoeleBoisBouilleur {
	return value.type === TypeGenerateurEnum.poele_bouilleur;
}

export type ChauffeEauGaz = _Generateur<
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
				| typeof ModeCombustionEnum.condensation
				| null;
		};
	}
>;

export function isChauffeEauGaz(value: GenerateurBase): value is ChauffeEauGaz {
	return (
		value.type === TypeGenerateurEnum.chauffe_eau &&
		(value.energie === EnergieEnum.gaz_naturel ||
			value.energie === EnergieEnum.gpl)
	);
}
export type GenerateurElectrique = _Generateur<{
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

export function isGenerateurElectrique(
	value: GenerateurBase,
): value is GenerateurElectrique {
	return isChaudiereElectrique(value) || isChauffeEauElectrique(value);
}

export type ChaudiereElectrique = _Generateur<
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

export function isChaudiereElectrique(
	value: GenerateurBase,
): value is ChaudiereElectrique {
	return (
		value.type === TypeGenerateurEnum.chaudiere &&
		value.energie === EnergieEnum.electricite
	);
}

export type ChauffeEauElectrique = _Generateur<
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

export function isChauffeEauElectrique(
	value: GenerateurBase,
): value is ChauffeEauElectrique {
	return (
		value.type === TypeGenerateurEnum.chauffe_eau &&
		value.energie === EnergieEnum.electricite
	);
}

export type GenerateurThermodynamique = _Generateur<{
	type:
		| typeof TypeGenerateurEnum.cet_air_ambiant
		| typeof TypeGenerateurEnum.cet_air_exterieur
		| typeof TypeGenerateurEnum.cet_air_extrait
		| typeof TypeGenerateurEnum.pac_air_eau
		| typeof TypeGenerateurEnum.pac_eau_eau
		| typeof TypeGenerateurEnum.pac_eau_glycolee_eau
		| typeof TypeGenerateurEnum.pac_geothermique;
	energie: typeof EnergieEnum.electricite;
	position: {
		position_chauffe_eau: null;
		reseau_chaleur_id: null;
	};
	signaletique: {
		label: null;
	};
}>;

export function isGenerateurThermodynamique(
	value: GenerateurBase,
): value is GenerateurThermodynamique {
	return isChauffeEauThermodynamique(value) || isPacDoubleService(value);
}

export type ChauffeEauThermodynamique = _Generateur<
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

export function isChauffeEauThermodynamique(
	value: GenerateurBase,
): value is ChauffeEauThermodynamique {
	return (
		value.type === TypeGenerateurEnum.cet_air_ambiant ||
		value.type === TypeGenerateurEnum.cet_air_exterieur ||
		value.type === TypeGenerateurEnum.cet_air_extrait
	);
}

export type PacDoubleService = _Generateur<
	GenerateurThermodynamique & {
		type:
			| typeof TypeGenerateurEnum.pac_air_eau
			| typeof TypeGenerateurEnum.pac_eau_eau
			| typeof TypeGenerateurEnum.pac_eau_glycolee_eau
			| typeof TypeGenerateurEnum.pac_geothermique;
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

export function isPacDoubleService(
	value: GenerateurBase,
): value is PacDoubleService {
	return (
		(value.type === TypeGenerateurEnum.pac_air_eau ||
			value.type === TypeGenerateurEnum.pac_eau_eau ||
			value.type === TypeGenerateurEnum.pac_eau_glycolee_eau ||
			value.type === TypeGenerateurEnum.pac_geothermique) &&
		null === value.bienergie
	);
}

export type PacHybride = _Generateur<
	GenerateurThermodynamique & {
		type:
			| typeof TypeGenerateurEnum.pac_air_eau
			| typeof TypeGenerateurEnum.pac_eau_eau
			| typeof TypeGenerateurEnum.pac_eau_glycolee_eau
			| typeof TypeGenerateurEnum.pac_geothermique;
		bienergie: Bienergie;
	}
>;

export function isPacDoubleServiceHybride(
	value: GenerateurBase,
): value is PacHybride {
	return (
		(value.type === TypeGenerateurEnum.pac_air_eau ||
			value.type === TypeGenerateurEnum.pac_eau_eau ||
			value.type === TypeGenerateurEnum.pac_eau_glycolee_eau ||
			value.type === TypeGenerateurEnum.pac_geothermique) &&
		null !== value.bienergie
	);
}

export type ReseauChaleur = _Generateur<{
	type: typeof TypeGenerateurEnum.reseau_chaleur;
	energie: typeof EnergieEnum.reseau_chaleur;
	bienergie: null;
	position: {
		generateur_collectif: true;
		generateur_multi_batiment: true;
		position_volume_chauffe: false;
		generateur_mixte_id: null;
		position_chauffe_eau: null;
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

export function isReseauChaleur(value: GenerateurBase): value is ReseauChaleur {
	return value.type === TypeGenerateurEnum.reseau_chaleur;
}

export type GenerateurCollectifInconnu = _Generateur<{
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

export function isGenerateurCollectifInconnu(
	value: GenerateurBase,
): value is GenerateurCollectifInconnu {
	return null === value.type;
}

export function isGenerateurMultiBatiment(value: GenerateurBase): boolean {
	return value.position.generateur_multi_batiment;
}

export const TYPES_GENERATEUR = [
	"chauffe_eau",
	"chaudiere",
	"cet_air_ambiant",
	"cet_air_exterieur",
	"cet_air_extrait",
	"pac_air_eau",
	"pac_eau_eau",
	"pac_eau_glycolee_eau",
	"pac_geothermique",
	"poele_bouilleur",
	"reseau_chaleur",
] as const;
export type TypeGenerateur = (typeof TYPES_GENERATEUR)[number];
export const TypeGenerateurEnum = buildEnum(TYPES_GENERATEUR);

export const TYPES_PAC = [
	TypeGenerateurEnum.cet_air_ambiant,
	TypeGenerateurEnum.cet_air_exterieur,
	TypeGenerateurEnum.cet_air_extrait,
	TypeGenerateurEnum.pac_air_eau,
	TypeGenerateurEnum.pac_eau_eau,
	TypeGenerateurEnum.pac_eau_glycolee_eau,
	TypeGenerateurEnum.pac_geothermique,
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
	EnergieEnum.bois_buche,
	EnergieEnum.bois_plaquette,
	EnergieEnum.bois_granule,
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
