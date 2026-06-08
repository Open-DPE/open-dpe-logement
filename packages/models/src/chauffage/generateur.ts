import type { Consommations, Energie, UUID } from "#/common/common";
import { buildEnum, createGuard } from "#/utils";

export const isGenerateur = createGuard<Generateur>("/chauffage/generateur");

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur
 */
export type Generateur =
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

export type GenerateurBase = {
	id: UUID;
	description: string;
	type: TypeGenerateur | null;
	energie: EnergieChauffage | null;
	bienergie: Bienergie | null;
	annee_installation: number | null;
	position: Position;
	signaletique: Signaletique;
};

export type GenerateurGeneric<
	T extends {
		type?: TypeGenerateur | null;
		energie?: EnergieChauffage | null;
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
} & T;

export type Position = {
	cascade: Cascade | null;
	position_chaudiere: PositionChaudiere | null;
	generateur_collectif: boolean;
	generateur_multi_batiment: boolean;
	position_volume_chauffe: boolean;
	generateur_mixte_id: string | null;
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

export type GenerateurCombustion = GenerateurGeneric<{
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

export type ChaudiereCombustion = GenerateurGeneric<
	GenerateurCombustion & {
		type: typeof TypeGenerateurEnum.chaudiere;
		signaletique: {
			label: null;
		};
	}
>;

export type PoeleBouilleur = GenerateurGeneric<
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

export type PoeleInsert = GenerateurGeneric<
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

export type GenerateurAirChaudCombustion = GenerateurGeneric<
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

export type RadiateurGaz = GenerateurGeneric<
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

export type GenerateurElectrique = GenerateurGeneric<{
	type:
		| typeof TypeGenerateurEnum.chaudiere
		| typeof TypeGenerateurEnum.generateur_air_chaud
		| typeof TypeGenerateurEnum.convecteur_bi_jonction
		| typeof TypeGenerateurEnum.convecteur_electrique
		| typeof TypeGenerateurEnum.panneau_rayonnant_electrique
		| typeof TypeGenerateurEnum.plafond_rayonnant_electrique
		| typeof TypeGenerateurEnum.plancher_rayonnant_electrique
		| typeof TypeGenerateurEnum.radiateur_electrique
		| typeof TypeGenerateurEnum.radiateur_electrique_accumulation;
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

export type ChaudiereElectrique = GenerateurGeneric<
	GenerateurElectrique & {
		type:
			| typeof TypeGenerateurEnum.chaudiere
			| typeof TypeGenerateurEnum.generateur_air_chaud;
		signaletique: {
			label: null;
		};
	}
>;

export type EmetteurElectrique = GenerateurGeneric<
	GenerateurElectrique & {
		type: Exclude<
			GenerateurElectrique["type"],
			typeof TypeGenerateurEnum.chaudiere
		>;
	}
>;

export type GenerateurThermodynamique = GenerateurGeneric<{
	type:
		| typeof TypeGenerateurEnum.pac_air_air
		| typeof TypeGenerateurEnum.pac_air_eau
		| typeof TypeGenerateurEnum.pac_eau_eau
		| typeof TypeGenerateurEnum.pac_eau_glycolee_eau
		| typeof TypeGenerateurEnum.pac_geothermique;
	energie: typeof EnergieChauffageEnum.electricite;
	position: {
		cascade: null;
		reseau_chaleur_id: null;
	};
}>;

export type PAC = GenerateurGeneric<
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

export type PACHybride = GenerateurGeneric<
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

export type ReseauChaleur = GenerateurGeneric<{
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

export type GenerateurCollectifInconnu = GenerateurGeneric<{
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

export const ENERGIES_CHAUFFAGE = [
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
export type EnergieChauffage = (typeof ENERGIES_CHAUFFAGE)[number];
export const EnergieChauffageEnum = buildEnum(ENERGIES_CHAUFFAGE);

export const BIENERGIES = [
	"gaz_naturel",
	"gpl",
	"fioul",
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
