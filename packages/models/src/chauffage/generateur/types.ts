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
	LABELS,
	BienergieEnum,
	EnergieChauffageEnum,
	LabelEnum,
	ModeCombustionEnum,
	MODES_COMBUSTION,
	PositionChaudiereEnum,
	TypeGenerateurEnum,
	CascadeEnum,
} from "./enums.js";

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-base#/$defs/position
 */
export const Position = z.object({
	position_chaudiere: PositionChaudiereEnum.nullable(),
	cascade: CascadeEnum.nullable(),
	generateur_collectif: z.boolean(),
	generateur_multi_batiment: z.boolean(),
	position_volume_chauffe: z.boolean(),
	generateur_mixte_id: id.nullable(),
	reseau_chaleur_id: z.string().nullable(),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-base#/$defs/signaletique
 */
export const Signaletique = z.object({
	pn: nombre_positif.nullable(),
	label: LabelEnum.nullable(),
	scop: nombre_positif.nullable(),
	mode_combustion: ModeCombustionEnum.nullable(),
	presence_ventouse: z.boolean().nullable(),
	presence_regulation: z.boolean().nullable(),
	pveilleuse: nombre.nullable(),
	qp0: nombre_positif.nullable(),
	rpn: nombre_positif.nullable(),
	rpint: nombre_positif.nullable(),
	tfonc30: nombre_positif.nullable(),
	tfonc100: nombre_positif.nullable(),
});

export const GenerateurData = z.object({
	consommations: Consommations,
	rdim: z.number(),
	pn: z.number(),
	pdim: z.number(),
	pch: z.number(),
	paux: z.number(),
	rpint: z.number().nullable(),
	rpn: z.number().nullable(),
	qp0: z.number().nullable(),
	pveilleuse: z.number().nullable(),
	scop: z.number().nullable(),
	tfonc30: z.number().nullable(),
	tfonc100: z.number().nullable(),
	qgen_rec: z.number(),
	qgen: z.number(),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-base
 */
export const GenerateurBase = z.object({
	id,
	description,
	annee_installation,
	type: TypeGenerateurEnum.nullable(),
	energie: EnergieChauffageEnum.nullable(),
	bienergie: BienergieEnum.nullable(),
	position: Position,
	signaletique: Signaletique,
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-combustion
 *
 * Comme pour `ecs/generateur`, les branches concrètes doivent chaîner leurs
 * surcharges de `position`/`signaletique` à partir de `PositionCombustion`/
 * `SignaletiqueCombustion` (et non de `Position`/`Signaletique` bruts) pour ne
 * pas perdre les `non_applicable` posés à ce niveau (`reseau_chaleur_id`, `scop`).
 */
export const PositionCombustion = Position.extend({
	reseau_chaleur_id: non_applicable,
});

export const SignaletiqueCombustion = Signaletique.extend({
	scop: non_applicable,
});

export const GenerateurCombustion = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.chaudiere,
		TYPES_GENERATEUR.generateur_air_chaud,
		TYPES_GENERATEUR.cuisiniere,
		TYPES_GENERATEUR.foyer_ferme,
		TYPES_GENERATEUR.insert,
		TYPES_GENERATEUR.poele,
		TYPES_GENERATEUR.poele_bouilleur,
		TYPES_GENERATEUR.radiateur_gaz,
	]),
	energie: EnergieChauffageEnum.extract([
		ENERGIES.gaz_naturel,
		ENERGIES.gpl,
		ENERGIES.fioul,
		ENERGIES.charbon,
		ENERGIES.bois_buche,
		ENERGIES.bois_plaquette,
		ENERGIES.bois_granule,
	]),
	bienergie: non_applicable,
	position: PositionCombustion,
	signaletique: SignaletiqueCombustion,
});

export const ChaudiereCombustion = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.chaudiere]),
	signaletique: SignaletiqueCombustion.extend({
		label: non_applicable,
	}),
});

/**
 * Point de vigilance schéma : comme pour `ecs`, la branche « Poêle bouilleur »
 * restreint `energie` à `[bois_buche, bois_plaquette, bois_granule]` — `charbon`
 * n'y figure pas (seule la branche « Chaudière » sans restriction l'autorise).
 */
export const PoeleBoisBouilleur = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.poele_bouilleur]),
	energie: EnergieChauffageEnum.extract([
		ENERGIES.bois_buche,
		ENERGIES.bois_plaquette,
		ENERGIES.bois_granule,
	]),
	signaletique: SignaletiqueCombustion.extend({
		label: non_applicable,
	}),
});

export const PoeleOuInsert = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.cuisiniere,
		TYPES_GENERATEUR.foyer_ferme,
		TYPES_GENERATEUR.insert,
		TYPES_GENERATEUR.poele,
	]),
	position: PositionCombustion.extend({
		cascade: non_applicable,
		position_chaudiere: non_applicable,
		generateur_collectif: z.literal(false),
		generateur_multi_batiment: z.literal(false),
		position_volume_chauffe: z.literal(true),
		generateur_mixte_id: non_applicable,
	}),
	signaletique: SignaletiqueCombustion.extend({
		label: LabelEnum.extract([LABELS.flamme_verte]).nullable(),
		mode_combustion: non_applicable,
		presence_regulation: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
		rpint: non_applicable,
		tfonc30: non_applicable,
		tfonc100: non_applicable,
	}),
});

export const GenerateurAirChaudCombustion = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.generateur_air_chaud]),
	signaletique: SignaletiqueCombustion.extend({
		mode_combustion: ModeCombustionEnum.extract([
			MODES_COMBUSTION.standard,
			MODES_COMBUSTION.condensation,
		]).nullable(),
		label: non_applicable,
		tfonc30: non_applicable,
		tfonc100: non_applicable,
	}),
});

/**
 * Point de vigilance : contrairement à `PoeleOuInsert`, cette branche ne force
 * pas `rpn` à `non_applicable` (absent de son `required` de surcharge) — un
 * radiateur à gaz a donc un `rpn` réel, à la différence d'un poêle/insert.
 */
export const RadiateurGaz = GenerateurCombustion.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.radiateur_gaz]),
	energie: EnergieChauffageEnum.extract([ENERGIES.gaz_naturel, ENERGIES.gpl]),
	position: PositionCombustion.extend({
		cascade: non_applicable,
		position_chaudiere: non_applicable,
		generateur_collectif: z.literal(false),
		generateur_multi_batiment: z.literal(false),
		position_volume_chauffe: z.literal(true),
		generateur_mixte_id: non_applicable,
	}),
	signaletique: SignaletiqueCombustion.extend({
		label: LabelEnum.extract([LABELS.flamme_verte]).nullable(),
		mode_combustion: non_applicable,
		presence_regulation: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpint: non_applicable,
		tfonc30: non_applicable,
		tfonc100: non_applicable,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-electrique
 */
export const PositionElectrique = Position.extend({
	cascade: non_applicable,
	reseau_chaleur_id: non_applicable,
});

export const SignaletiqueElectrique = Signaletique.extend({
	scop: non_applicable,
	mode_combustion: non_applicable,
	presence_ventouse: non_applicable,
	presence_regulation: non_applicable,
	pveilleuse: non_applicable,
	qp0: non_applicable,
	rpn: non_applicable,
	rpint: non_applicable,
	tfonc30: non_applicable,
	tfonc100: non_applicable,
});

export const GenerateurElectrique = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.chaudiere,
		TYPES_GENERATEUR.generateur_air_chaud,
		TYPES_GENERATEUR.convecteur_bi_jonction,
		TYPES_GENERATEUR.convecteur_electrique,
		TYPES_GENERATEUR.panneau_rayonnant_electrique,
		TYPES_GENERATEUR.plafond_rayonnant_electrique,
		TYPES_GENERATEUR.plancher_rayonnant_electrique,
		TYPES_GENERATEUR.radiateur_electrique,
		TYPES_GENERATEUR.radiateur_electrique_accumulation,
	]),
	energie: EnergieChauffageEnum.extract([ENERGIES.electricite]),
	bienergie: non_applicable,
	position: PositionElectrique,
	signaletique: SignaletiqueElectrique,
});

/**
 * Point de vigilance schéma : `generateur_air_chaud` figure à la fois dans le
 * `type` de cette branche (« Chaudière électrique ») et dans celui de
 * `EmetteurElectrique` ci-dessous — chevauchement potentiel du `oneOf` du
 * schéma pour cette valeur de `type` (voir commentaire sur `EmetteurElectrique`).
 */
export const ChaudiereElectrique = GenerateurElectrique.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.chaudiere,
		TYPES_GENERATEUR.generateur_air_chaud,
	]),
	signaletique: SignaletiqueElectrique.extend({
		label: non_applicable,
	}),
});

/**
 * Point de vigilance schéma : `type` inclut `generateur_air_chaud`, déjà
 * couvert par `ChaudiereElectrique` — un document `type: generateur_air_chaud`
 * peut satisfaire les deux branches selon `position`/`signaletique.label`
 * (`non_applicable` accepte aussi `null`, qui appartient également à l'énum
 * `[nf_performance, null]` de cette branche). `ChaudiereElectrique` est placée
 * avant dans `Generateur` ci-dessous pour trancher côté « générateur » plutôt
 * que « émetteur » en cas d'ambiguïté — à confirmer/corriger côté schéma.
 */
export const EmetteurElectrique = GenerateurElectrique.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.generateur_air_chaud,
		TYPES_GENERATEUR.convecteur_bi_jonction,
		TYPES_GENERATEUR.convecteur_electrique,
		TYPES_GENERATEUR.panneau_rayonnant_electrique,
		TYPES_GENERATEUR.plafond_rayonnant_electrique,
		TYPES_GENERATEUR.plancher_rayonnant_electrique,
		TYPES_GENERATEUR.radiateur_electrique,
		TYPES_GENERATEUR.radiateur_electrique_accumulation,
	]),
	position: PositionElectrique.extend({
		position_chaudiere: non_applicable,
		generateur_collectif: z.literal(false),
		generateur_multi_batiment: z.literal(false),
		position_volume_chauffe: z.literal(true),
		generateur_mixte_id: non_applicable,
	}),
	signaletique: SignaletiqueElectrique.extend({
		label: LabelEnum.extract([LABELS.nf_performance]).nullable(),
	}),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-thermodynamique
 */
export const PositionThermodynamique = Position.extend({
	reseau_chaleur_id: non_applicable,
});

export const GenerateurThermodynamique = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.pac_air_air,
		TYPES_GENERATEUR.pac_air_eau,
		TYPES_GENERATEUR.pac_eau_eau,
		TYPES_GENERATEUR.pac_eau_glycolee_eau,
		TYPES_GENERATEUR.pac_geothermique,
	]),
	energie: EnergieChauffageEnum.extract([ENERGIES.electricite]),
	position: PositionThermodynamique,
});

export const PacClassique = GenerateurThermodynamique.extend({
	bienergie: non_applicable,
	position: PositionThermodynamique.extend({
		cascade: non_applicable,
		position_chaudiere: non_applicable,
	}),
	signaletique: Signaletique.extend({
		label: non_applicable,
		mode_combustion: non_applicable,
		presence_ventouse: non_applicable,
		presence_regulation: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
		rpint: non_applicable,
		tfonc30: non_applicable,
		tfonc100: non_applicable,
	}),
});

/**
 * `pac_air_air` exclu (seule `PacClassique` l'autorise — pas d'appoint
 * combustion possible pour une PAC air/air). Hérite `position` de
 * `GenerateurThermodynamique` (`cascade`/`position_chaudiere` restent
 * nullables, à la différence de `PacClassique`) et `signaletique` de base sauf
 * `label`, cohérent avec une PAC hybride qui garde un vrai `scop`/`mode_combustion`
 * /`qp0`/... côté appoint combustion.
 */
export const PacHybride = GenerateurThermodynamique.extend({
	type: TypeGenerateurEnum.extract([
		TYPES_GENERATEUR.pac_air_eau,
		TYPES_GENERATEUR.pac_eau_eau,
		TYPES_GENERATEUR.pac_eau_glycolee_eau,
		TYPES_GENERATEUR.pac_geothermique,
	]),
	bienergie: BienergieEnum,
	signaletique: Signaletique.extend({
		label: non_applicable,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/reseau-chaleur
 */
export const ReseauChaleur = GenerateurBase.extend({
	type: TypeGenerateurEnum.extract([TYPES_GENERATEUR.reseau_chaleur]),
	energie: EnergieChauffageEnum.extract([ENERGIES.reseau_chaleur]),
	bienergie: non_applicable,
	position: Position.extend({
		cascade: non_applicable,
		position_chaudiere: non_applicable,
		generateur_collectif: z.literal(true),
		generateur_multi_batiment: z.literal(true),
		position_volume_chauffe: z.literal(false),
		generateur_mixte_id: non_applicable,
	}),
	signaletique: Signaletique.extend({
		pn: non_applicable,
		label: non_applicable,
		scop: non_applicable,
		mode_combustion: non_applicable,
		presence_regulation: non_applicable,
		presence_ventouse: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
		rpint: non_applicable,
		tfonc30: non_applicable,
		tfonc100: non_applicable,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur-inconnu
 */
export const GenerateurCollectifInconnu = GenerateurBase.extend({
	type: z.literal(null),
	energie: z.literal(null),
	bienergie: non_applicable,
	position: Position.extend({
		cascade: non_applicable,
		position_chaudiere: non_applicable,
		generateur_collectif: z.literal(true),
		position_volume_chauffe: z.literal(false),
		generateur_mixte_id: non_applicable,
		reseau_chaleur_id: non_applicable,
	}),
	signaletique: Signaletique.extend({
		pn: non_applicable,
		label: non_applicable,
		scop: non_applicable,
		mode_combustion: non_applicable,
		presence_regulation: non_applicable,
		presence_ventouse: non_applicable,
		pveilleuse: non_applicable,
		qp0: non_applicable,
		rpn: non_applicable,
		rpint: non_applicable,
		tfonc30: non_applicable,
		tfonc100: non_applicable,
	}),
});

/**
 * @see https://schemas.open-dpe.fr/chauffage/generateur
 */
export const Generateur = z.union([
	ChaudiereCombustion,
	PoeleBoisBouilleur,
	PoeleOuInsert,
	GenerateurAirChaudCombustion,
	RadiateurGaz,
	ChaudiereElectrique,
	EmetteurElectrique,
	PacClassique,
	PacHybride,
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
export type Signaletique = z.infer<typeof Signaletique>;
export type GenerateurBase = z.infer<typeof GenerateurBase>;
export type GenerateurCombustion = z.infer<typeof GenerateurCombustion>;
export type ChaudiereCombustion = z.infer<typeof ChaudiereCombustion>;
export type PoeleBoisBouilleur = z.infer<typeof PoeleBoisBouilleur>;
export type PoeleOuInsert = z.infer<typeof PoeleOuInsert>;
export type GenerateurAirChaudCombustion = z.infer<
	typeof GenerateurAirChaudCombustion
>;
export type RadiateurGaz = z.infer<typeof RadiateurGaz>;
export type GenerateurElectrique = z.infer<typeof GenerateurElectrique>;
export type ChaudiereElectrique = z.infer<typeof ChaudiereElectrique>;
export type EmetteurElectrique = z.infer<typeof EmetteurElectrique>;
export type GenerateurThermodynamique = z.infer<
	typeof GenerateurThermodynamique
>;
export type PacClassique = z.infer<typeof PacClassique>;
export type PacHybride = z.infer<typeof PacHybride>;
export type ReseauChaleur = z.infer<typeof ReseauChaleur>;
export type GenerateurCollectifInconnu = z.infer<
	typeof GenerateurCollectifInconnu
>;
