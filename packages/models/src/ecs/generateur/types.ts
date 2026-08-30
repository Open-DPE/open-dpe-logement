import * as z from "zod";

import { ENERGIES } from "../../common/enums.js";

import {
	id,
	description,
	annee_installation,
	non_applicable,
	nombre,
	nombre_positif,
	Consommations,
} from "../../common/types.js";

import {
	TYPES_GENERATEUR,
	BienergieEnum,
	EnergieEcsEnum,
	LabelEnum,
	ModeCombustionEnum,
	PositionChauffeEauEnum,
	TypeGenerateurEnum,
	TypeStockageEnum,
	MODES_COMBUSTION,
} from "./enums.js";

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-base#/$defs/position
 * Les 6 propriétés sont dans `properties` mais seules `generateur_collectif`,
 * `generateur_multi_batiment`, `position_volume_chauffe` sont dans le `required`
 * du schéma — modélisées ici toujours présentes par cohérence avec la doctrine.
 */
export const Position = z.object({
	position_chauffe_eau: PositionChauffeEauEnum.nullable(),
	generateur_collectif: z.boolean(),
	generateur_multi_batiment: z.boolean(),
	position_volume_chauffe: z.boolean(),
	generateur_mixte_id: id.nullable(),
	reseau_chaleur_id: z.string().nullable(),
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-base#/$defs/stockage
 * `volume` est un entier (`type: [integer, "null"]`) — branche « présence » :
 * `not: {const: 0}` combiné au `minimum: 0` de la propriété de base équivaut à
 * `volume > 0`, sans exclure `null` (le mot-clé `not`/`minimum` ne contraint pas
 * les instances non numériques) : `volume` reste donc nullable même en présence
 * de stockage dans le texte actuel du schéma.
 */
export const SansStockage = z.object({
	volume: z.literal(0),
	type: non_applicable,
	position_volume_chauffe: non_applicable,
});

export const AvecStockage = z.object({
	volume: nombre_positif.int().nullable(),
	type: TypeStockageEnum,
	position_volume_chauffe: z.boolean(),
});

export const Stockage = z.union([SansStockage, AvecStockage]);

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-base#/$defs/signaletique
 */
export const Signaletique = z.object({
	pn: nombre_positif.nullable(),
	cop: nombre_positif.nullable(),
	label: LabelEnum.nullable(),
	mode_combustion: ModeCombustionEnum.nullable(),
	presence_ventouse: z.boolean().nullable(),
	pveilleuse: nombre.nullable(),
	qp0: nombre_positif.nullable(),
	rpn: nombre_positif.nullable(),
});

export const GenerateurData = z.object({
	rdim: z.number(),
	pn: z.number(),
	pdim: z.number(),
	pecs: z.number(),
	paux: z.number(),
	cop: z.number().nullable(),
	rpn: z.number().nullable(),
	qp0: z.number().nullable(),
	pveilleuse: z.number().nullable(),
	cr: z.number(),
	qgw: z.number(),
	qgen: z.number(),
	consommations: Consommations,
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-base
 */
export const GenerateurBase = z.object({
	id,
	description,
	annee_installation,
	type: TypeGenerateurEnum.nullable(),
	energie: EnergieEcsEnum.nullable(),
	bienergie: BienergieEnum.nullable(),
	position: Position,
	stockage: Stockage,
	signaletique: Signaletique,
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-combustion
 *
 * Les branches concrètes (`ChaudiereCombustion`, `PoeleBoisBouilleur`,
 * `ChauffeEauGaz`) doivent chaîner leurs propres surcharges de `position`/
 * `signaletique` à partir de `PositionCombustion`/`SignaletiqueCombustion` —
 * et non à partir de `Position`/`Signaletique` bruts — pour ne pas perdre les
 * contraintes `non_applicable` posées à ce niveau (`reseau_chaleur_id`, `cop`,
 * `label`), qui s'appliquent par `allOf` à toutes les branches filles du schéma.
 */
export const PositionCombustion = Position.extend({
	reseau_chaleur_id: non_applicable,
});

export const SignaletiqueCombustion = Signaletique.extend({
	cop: non_applicable,
	label: non_applicable,
});

export const GenerateurCombustion = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.chaudiere,
		TYPES_GENERATEUR.poele_bouilleur,
		TYPES_GENERATEUR.chauffe_eau,
	]),
	energie: EnergieEcsEnum.extract([
		ENERGIES.gaz_naturel,
		ENERGIES.gpl,
		ENERGIES.fioul,
		ENERGIES.bois_buche,
		ENERGIES.bois_plaquette,
		ENERGIES.bois_granule,
		ENERGIES.charbon,
	]),
	bienergie: non_applicable,
	position: PositionCombustion,
	signaletique: SignaletiqueCombustion,
});

export const ChaudiereCombustion = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.chaudiere]),
	position: PositionCombustion.extend({
		position_chauffe_eau: non_applicable,
	}),
});

/**
 * Point de vigilance schéma : contrairement à la branche « Chaudière à
 * combustion » (qui hérite les 7 énergies de combustion sans restriction), la
 * branche « Poêle à bois bouilleur » restreint `energie` à
 * `[bois_buche, bois_plaquette, bois_granule]` — `charbon` n'y figure pas.
 */
export const PoeleBoisBouilleur = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.poele_bouilleur]),
	energie: EnergieEcsEnum.extract([
		ENERGIES.bois_buche,
		ENERGIES.bois_plaquette,
		ENERGIES.bois_granule,
	]),
	position: PositionCombustion.extend({
		position_chauffe_eau: non_applicable,
		generateur_collectif: z.literal(false),
		generateur_multi_batiment: z.literal(false),
	}),
});

export const ChauffeEauGaz = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.chauffe_eau]),
	energie: EnergieEcsEnum.extract([ENERGIES.gaz_naturel, ENERGIES.gpl]),
	position: PositionCombustion.extend({
		generateur_collectif: z.literal(false),
		generateur_multi_batiment: z.literal(false),
		generateur_mixte_id: non_applicable,
	}),
	signaletique: SignaletiqueCombustion.extend({
		mode_combustion: ModeCombustionEnum.exclude([
			MODES_COMBUSTION.basse_temperature,
		]).nullable(),
	}),
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-electrique
 */
export const PositionElectrique = Position.extend({
	reseau_chaleur_id: non_applicable,
});

export const SignaletiqueElectrique = Signaletique.extend({
	cop: non_applicable,
	mode_combustion: non_applicable,
	presence_ventouse: non_applicable,
	pveilleuse: non_applicable,
	qp0: non_applicable,
	rpn: non_applicable,
});

export const GenerateurElectrique = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.chauffe_eau,
		TYPES_GENERATEUR.chaudiere,
	]),
	energie: EnergieEcsEnum.extract([ENERGIES.electricite]),
	bienergie: non_applicable,
	position: PositionElectrique,
	signaletique: SignaletiqueElectrique,
});

export const ChaudiereElectrique = GenerateurElectrique.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.chaudiere]),
	position: PositionElectrique.extend({
		position_chauffe_eau: non_applicable,
	}),
	signaletique: SignaletiqueElectrique.extend({
		label: non_applicable,
	}),
});

export const ChauffeEauElectrique = GenerateurElectrique.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.chauffe_eau]),
	position: PositionElectrique.extend({
		generateur_collectif: z.literal(false),
		generateur_multi_batiment: z.literal(false),
		generateur_mixte_id: non_applicable,
		position_chauffe_eau: PositionChauffeEauEnum,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-thermodynamique
 */
export const PositionThermodynamique = Position.extend({
	position_chauffe_eau: non_applicable,
	reseau_chaleur_id: non_applicable,
});

export const SignaletiqueThermodynamique = Signaletique.extend({
	label: non_applicable,
});

export const GenerateurThermodynamique = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.cet_air_ambiant,
		TYPES_GENERATEUR.cet_air_exterieur,
		TYPES_GENERATEUR.cet_air_extrait,
		TYPES_GENERATEUR.pac_air_eau,
		TYPES_GENERATEUR.pac_eau_eau,
		TYPES_GENERATEUR.pac_eau_glycolee_eau,
		TYPES_GENERATEUR.pac_geothermique,
	]),
	energie: EnergieEcsEnum.extract([ENERGIES.electricite]),
	position: PositionThermodynamique,
	signaletique: SignaletiqueThermodynamique,
});

export const ChauffeEauThermodynamique = GenerateurThermodynamique.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.cet_air_ambiant,
		TYPES_GENERATEUR.cet_air_exterieur,
		TYPES_GENERATEUR.cet_air_extrait,
	]),
	bienergie: non_applicable,
	position: PositionThermodynamique.extend({
		generateur_mixte_id: non_applicable,
		generateur_multi_batiment: z.literal(false),
	}),
	signaletique: SignaletiqueThermodynamique.extend({
		mode_combustion: non_applicable,
		presence_ventouse: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
	}),
});

export const PacDoubleService = GenerateurThermodynamique.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.pac_air_eau,
		TYPES_GENERATEUR.pac_eau_eau,
		TYPES_GENERATEUR.pac_eau_glycolee_eau,
		TYPES_GENERATEUR.pac_geothermique,
	]),
	bienergie: non_applicable,
	signaletique: SignaletiqueThermodynamique.extend({
		mode_combustion: non_applicable,
		presence_ventouse: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
	}),
});

/**
 * Pas de surcharge position/signaletique : hérite de `GenerateurThermodynamique`
 * (`label: non_applicable` seul override de signaletique — cohérent avec une PAC
 * hybride qui peut réellement avoir un `mode_combustion`/`qp0`/... via son appoint
 * combustion `bienergie`).
 */
export const PacDoubleServiceHybride = GenerateurThermodynamique.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.pac_air_eau,
		TYPES_GENERATEUR.pac_eau_eau,
		TYPES_GENERATEUR.pac_eau_glycolee_eau,
		TYPES_GENERATEUR.pac_geothermique,
	]),
	bienergie: BienergieEnum,
});

/**
 * @see https://schemas.open-dpe.fr/ecs/reseau-chaleur
 */
export const ReseauChaleur = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.reseau_chaleur]),
	energie: EnergieEcsEnum.extract([ENERGIES.reseau_chaleur]),
	bienergie: non_applicable,
	position: Position.extend({
		generateur_collectif: z.literal(true),
		generateur_multi_batiment: z.literal(true),
		position_volume_chauffe: z.literal(false),
		generateur_mixte_id: non_applicable,
		position_chauffe_eau: non_applicable,
	}),
	signaletique: Signaletique.extend({
		pn: non_applicable,
		cop: non_applicable,
		label: non_applicable,
		mode_combustion: non_applicable,
		presence_ventouse: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur-inconnu
 */
export const GenerateurCollectifInconnu = GenerateurBase.extend({
	type: z.literal(null),
	energie: z.literal(null),
	bienergie: z.literal(null),
	position: Position.extend({
		generateur_collectif: z.literal(true),
		position_volume_chauffe: z.literal(false),
		position_chauffe_eau: non_applicable,
		generateur_mixte_id: non_applicable,
		reseau_chaleur_id: non_applicable,
	}),
	signaletique: Signaletique.extend({
		pn: non_applicable,
		cop: non_applicable,
		label: non_applicable,
		mode_combustion: non_applicable,
		presence_ventouse: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/ecs/generateur
 */
export const Generateur = z.union([
	ChaudiereCombustion,
	PoeleBoisBouilleur,
	ChauffeEauGaz,
	ChaudiereElectrique,
	ChauffeEauElectrique,
	ChauffeEauThermodynamique,
	PacDoubleService,
	PacDoubleServiceHybride,
	ReseauChaleur,
	GenerateurCollectifInconnu,
]);

export const GenerateurWithData = z.intersection(
	Generateur,
	z.object({
		data: GenerateurData,
	}),
);

export type Generateur = z.infer<typeof Generateur>;
export type GenerateurWithData = z.infer<typeof GenerateurWithData>;
export type GenerateurData = z.infer<typeof GenerateurData>;
export type Position = z.infer<typeof Position>;
export type Stockage = z.infer<typeof Stockage>;
export type SansStockage = z.infer<typeof SansStockage>;
export type AvecStockage = z.infer<typeof AvecStockage>;
export type Signaletique = z.infer<typeof Signaletique>;
export type GenerateurBase = z.infer<typeof GenerateurBase>;
export type GenerateurCombustion = z.infer<typeof GenerateurCombustion>;
export type ChaudiereCombustion = z.infer<typeof ChaudiereCombustion>;
export type PoeleBoisBouilleur = z.infer<typeof PoeleBoisBouilleur>;
export type ChauffeEauGaz = z.infer<typeof ChauffeEauGaz>;
export type GenerateurElectrique = z.infer<typeof GenerateurElectrique>;
export type ChaudiereElectrique = z.infer<typeof ChaudiereElectrique>;
export type ChauffeEauElectrique = z.infer<typeof ChauffeEauElectrique>;
export type GenerateurThermodynamique = z.infer<
	typeof GenerateurThermodynamique
>;
export type ChauffeEauThermodynamique = z.infer<
	typeof ChauffeEauThermodynamique
>;
export type PacDoubleService = z.infer<typeof PacDoubleService>;
export type PacDoubleServiceHybride = z.infer<typeof PacDoubleServiceHybride>;
export type ReseauChaleur = z.infer<typeof ReseauChaleur>;
export type GenerateurCollectifInconnu = z.infer<
	typeof GenerateurCollectifInconnu
>;
