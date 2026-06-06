import { SCHEMA_KEYS } from "@open-dpe-logement/schemas";
import { buildEnum, createGuard } from "#/utils";
import type {
	Consommations,
	Energie,
	EnergieBois,
	EnergieCombustion,
	UUID,
} from "#/common/common";

export const isGenerateur = createGuard<Generateur>(SCHEMA_KEYS["ecs/generateur"]);

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
	| ReseauChaleur
	| GenerateurCollectifInconnu;

export type GenerateurWithData<T extends Generateur = Generateur> = T & {
	data: GenerateurData;
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

export type GenerateurGeneric<
	T extends {
		type?: TypeGenerateur | null;
		energie?: EnergieEcs | null;
		bienergie?: Bienergie | null;
		annee_installation?: number | null;
		position?: Partial<Position>;
		signaletique?: Partial<Signaletique>;
	},
> = Omit<GenerateurBase & T, "position" | "signaletique"> & {
	position: Omit<Position, keyof NonNullable<T["position"]>> &
		NonNullable<T["position"]>;
	signaletique: Omit<Signaletique, keyof NonNullable<T["signaletique"]>> &
		NonNullable<T["signaletique"]>;
};

export type Position = {
	position_chauffe_eau: PositionChauffeEau | null;
	generateur_collectif: boolean;
	generateur_multi_batiment: boolean;
	position_volume_chauffe: boolean;
	generateur_mixte_id: string | null;
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

export type Stockage = {
	volume: number;
	type: TypeStockage;
	position_volume_chauffe: boolean;
};

export type GenerateurCombustion = {
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
};

export type ChaudiereCombustion = GenerateurGeneric<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chaudiere;
		position: {
			position_chauffe_eau: null;
		};
	}
>;

export type PoeleBoisBouilleur = GenerateurGeneric<
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

export type ChauffeEauGaz = GenerateurGeneric<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chauffe_eau;
		energie: typeof EnergieEcsEnum.gaz_naturel | typeof EnergieEcsEnum.gpl;
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

export type GenerateurElectrique = {
	type:
		| typeof TypeGenerateurEnum.chauffe_eau
		| typeof TypeGenerateurEnum.chaudiere;
	energie: typeof EnergieEcsEnum.electricite;
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
};

export type ChaudiereElectrique = GenerateurGeneric<
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

export type ChauffeEauElectrique = GenerateurGeneric<
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

export type GenerateurThermodynamique = {
	type:
		| typeof TypeGenerateurEnum.cet_air_ambiant
		| typeof TypeGenerateurEnum.cet_air_exterieur
		| typeof TypeGenerateurEnum.cet_air_extrait
		| typeof TypeGenerateurEnum.pac_double_service;
	energie: typeof EnergieEcsEnum.electricite;
	position: {
		position_chauffe_eau: null;
		reseau_chaleur_id: null;
	};
	signaletique: {
		label: null;
	};
};

export type ChauffeEauThermodynamique = GenerateurGeneric<
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

export type PacDoubleService = GenerateurGeneric<
	GenerateurThermodynamique & {
		type: typeof TypeGenerateurEnum.pac_double_service;
		bienergie: Bienergie | null;
		position: {
			generateur_mixte_id: null;
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

export type ReseauChaleur = GenerateurGeneric<{
	type: typeof TypeGenerateurEnum.reseau_chaleur;
	energie: typeof EnergieEcsEnum.reseau_chaleur;
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

export type GenerateurCollectifInconnu = GenerateurGeneric<{
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

export const TYPES_PAC: readonly TypeGenerateur[] = [
	TypeGenerateurEnum.cet_air_ambiant,
	TypeGenerateurEnum.cet_air_exterieur,
	TypeGenerateurEnum.cet_air_extrait,
	TypeGenerateurEnum.pac_double_service,
] as const satisfies readonly TypeGenerateur[];
export type TypePac = (typeof TYPES_PAC)[number];
export const TypePacEnum = buildEnum(TYPES_PAC);

export const ENERGIES_ECS = [
	"electricite",
	"gaz_naturel",
	"gpl",
	"fioul",
	"charbon",
	"bois_buche",
	"bois_plaquette",
	"bois_granule",
	"reseau_chaleur",
] as const satisfies readonly Energie[];
export type EnergieEcs = (typeof ENERGIES_ECS)[number];
export const EnergieEcsEnum = buildEnum(ENERGIES_ECS);

export const BIENERGIES = [
	"gaz_naturel",
	"gpl",
	"fioul",
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
