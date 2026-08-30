import * as z from "zod";
import {
	id,
	description,
	inclinaison,
	nombre_positif,
	non_applicable,
} from "../../common/types.js";
import {
	MITOYENNETES,
	MitoyenneteEnum,
	OrientationParoiEnum,
	TypePoseEnum,
} from "../common/enums.js";
import { Masque } from "../masque/types.js";
import {
	TYPES_BAIE,
	TypeBaieEnum,
	TYPES_FERMETURE,
	TypeFermetureEnum,
	TYPES_VITRAGE,
	TypeVitrageEnum,
	NatureLameEnum,
	TypeSurvitrageEnum,
	MateriauEnum,
} from "./enums.js";

/**
 * Position de la baie — croise le patron paroi (`mitoyennete`) et le patron
 * propre à la baie (`orientation`/`inclinaison`), cf. `/enveloppe/baie#/$defs/position`
 * (allOf `/enveloppe/paroi#/$defs/position`).
 * Simplification assumée (déjà présente dans l'implémentation historique) : les
 * branches « Nord ou Sud » et « Est ou Ouest » du schéma, structurellement
 * identiques hormis le sous-ensemble d'orientations autorisées, sont fusionnées
 * en une seule branche « Verticale » — même ensemble de documents validés.
 * La restriction fine du `secteur` des `masques` selon l'orientation n'est pas
 * modélisée (déjà hors périmètre de l'implémentation historique).
 */
export const PositionBase = z.object({
	surface: nombre_positif,
	mitoyennete: MitoyenneteEnum,
	local_non_chauffe_id: id.nullable().default(null),
	paroi_id: id.nullable().default(null),
	baie_id: id.nullable().default(null),
	type_pose: TypePoseEnum.nullable().default(null),
	inclinaison,
	orientation: OrientationParoiEnum,
	masques: z.array(Masque),
});

export const PositionMitoyenneteLocalNonChauffe = PositionBase.extend({
	mitoyennete: MitoyenneteEnum.extract([MITOYENNETES.local_non_chauffe]),
	local_non_chauffe_id: id,
});

export const PositionMitoyenneteAutres = PositionBase.extend({
	mitoyennete: MitoyenneteEnum.exclude([MITOYENNETES.local_non_chauffe]),
	local_non_chauffe_id: non_applicable,
});

export const PositionVerticale = PositionBase.extend({
	inclinaison: inclinaison.min(1),
	orientation: z.enum(["nord", "sud", "est", "ouest"]),
});

export const PositionHorizontale = PositionBase.extend({
	inclinaison: z.literal(0),
	orientation: z.literal("horizontale"),
});

export const PositionMitoyennete = z.union([
	PositionMitoyenneteLocalNonChauffe,
	PositionMitoyenneteAutres,
]);

export const PositionOrientation = z.union([
	PositionVerticale,
	PositionHorizontale,
]);

export const Position = z.intersection(PositionMitoyennete, PositionOrientation);

export type Position = z.infer<typeof Position>;
export type PositionBase = z.infer<typeof PositionBase>;
export type PositionMitoyenneteLocalNonChauffe = z.infer<
	typeof PositionMitoyenneteLocalNonChauffe
>;
export type PositionMitoyenneteAutres = z.infer<typeof PositionMitoyenneteAutres>;
export type PositionVerticale = z.infer<typeof PositionVerticale>;
export type PositionHorizontale = z.infer<typeof PositionHorizontale>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/baie#/$defs/menuiserie
 */
export const Menuiserie = z.object({
	materiau: MateriauEnum.nullable().default(null),
	largeur_dormant: nombre_positif.nullable().default(null),
	presence_soubassement: z.boolean(),
	presence_joint: z.boolean().nullable().default(null),
	presence_retour_isolation: z.boolean().nullable().default(null),
	presence_rupteur_pont_thermique: z.boolean().nullable().default(null),
});

export type Menuiserie = z.infer<typeof Menuiserie>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/baie#/$defs/vitrage
 * 5 variantes concrètes pour 3 branches réelles du schéma : la branche « Autres »
 * (type ∈ {brique_verre, polycarbonate, null}) est éclatée en 3 pour permettre à
 * `Baie` de sélectionner précisément `brique_verre`/`polycarbonate` (même ensemble
 * de documents validés que le schéma).
 */
export const VitrageBase = z.object({
	type: TypeVitrageEnum.nullable().default(null),
	nature_lame: NatureLameEnum.nullable().default(null),
	epaisseur_lame: nombre_positif.nullable().default(null),
});

export const VitrageSimple = VitrageBase.extend({
	type: TypeVitrageEnum.extract([TYPES_VITRAGE.simple_vitrage]),
	nature_lame: non_applicable,
	epaisseur_lame: non_applicable,
});

export const VitrageComplexe = VitrageBase.extend({
	type: TypeVitrageEnum.extract([
		TYPES_VITRAGE.double_vitrage,
		TYPES_VITRAGE.double_vitrage_fe,
		TYPES_VITRAGE.triple_vitrage,
		TYPES_VITRAGE.triple_vitrage_fe,
	]),
});

export const VitrageBriqueVerre = VitrageBase.extend({
	type: TypeVitrageEnum.extract([TYPES_VITRAGE.brique_verre]),
	nature_lame: non_applicable,
	epaisseur_lame: non_applicable,
});

export const VitragePolycarbonate = VitrageBase.extend({
	type: TypeVitrageEnum.extract([TYPES_VITRAGE.polycarbonate]),
	nature_lame: non_applicable,
	epaisseur_lame: non_applicable,
});

export const VitrageInconnu = VitrageBase.extend({
	type: non_applicable,
	nature_lame: non_applicable,
	epaisseur_lame: non_applicable,
});

/** Sous-ensemble de `Vitrage` utilisable par une fenêtre/porte-fenêtre. */
export const VitrageFenetre = z.union([
	VitrageSimple,
	VitrageComplexe,
	VitrageInconnu,
]);

export const Vitrage = z.union([
	VitrageSimple,
	VitrageComplexe,
	VitrageBriqueVerre,
	VitragePolycarbonate,
	VitrageInconnu,
]);

export type Vitrage = z.infer<typeof Vitrage>;
export type VitrageBase = z.infer<typeof VitrageBase>;
export type VitrageSimple = z.infer<typeof VitrageSimple>;
export type VitrageComplexe = z.infer<typeof VitrageComplexe>;
export type VitrageBriqueVerre = z.infer<typeof VitrageBriqueVerre>;
export type VitragePolycarbonate = z.infer<typeof VitragePolycarbonate>;
export type VitrageInconnu = z.infer<typeof VitrageInconnu>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/baie#/$defs/survitrage
 */
export const Survitrage = z.object({
	type: TypeSurvitrageEnum.nullable().default(null),
	epaisseur_lame: nombre_positif.nullable().default(null),
});

export type Survitrage = z.infer<typeof Survitrage>;

export const BaieData = z.object({
	sdep: z.number(),
	b: z.number(),
	dp: z.number(),
	u: z.number(),
	deltar: z.number(),
	uw: z.number(),
	ug: z.number(),
	sse: z.number(),
	sw: z.number(),
	fe: z.number(),
});

export type BaieData = z.infer<typeof BaieData>;

/**
 * @see https://schemas.open-dpe.fr/enveloppe/baie
 *
 * Point de vigilance schéma (à faire trancher) : `menuiserie` n'est pas dans le
 * `required` racine du schéma, et la branche « Baie en polycarbonate » ne force
 * pas `menuiserie` à `non_applicable` (contrairement à la branche « brique de
 * verre »), alors que la doctrine du projet veut que toute propriété soit
 * toujours présente. Modélisé ici comme toujours présent et forcé à
 * `non_applicable` pour brique de verre ET polycarbonate, par cohérence avec le
 * reste du domaine — divergence à signaler côté schéma.
 */
export const BaieBase = z.object({
	id,
	description,
	type: TypeBaieEnum,
	presence_protection_solaire: z.boolean(),
	type_fermeture: TypeFermetureEnum,
	annee_installation: z.number().int().nullable().default(null),
	ug: nombre_positif.nullable().default(null),
	uw: nombre_positif.nullable().default(null),
	ujn: nombre_positif.nullable().default(null),
	sw: nombre_positif.max(1).nullable().default(null),
	position: Position,
	menuiserie: z.union([Menuiserie, non_applicable]),
	vitrage: Vitrage,
	survitrage: Survitrage.nullable().default(null),
});

export const BaieBriqueVerre = BaieBase.extend({
	type: TypeBaieEnum.extract([
		TYPES_BAIE.brique_verre_pleine,
		TYPES_BAIE.brique_verre_creuse,
	]),
	vitrage: VitrageBriqueVerre,
	menuiserie: non_applicable,
});

export const BaiePolycarbonate = BaieBase.extend({
	type: TypeBaieEnum.extract([TYPES_BAIE.polycarbonate]),
	vitrage: VitragePolycarbonate,
	menuiserie: non_applicable,
});

export const BaieFenetreOuPorteFenetre = BaieBase.extend({
	type: TypeBaieEnum.extract([
		TYPES_BAIE.fenetre_battante,
		TYPES_BAIE.fenetre_coulissante,
		TYPES_BAIE.porte_fenetre_coulissante,
		TYPES_BAIE.porte_fenetre_battante,
	]),
	vitrage: VitrageFenetre,
	menuiserie: Menuiserie,
});

export const Baie = z.union([
	BaieBriqueVerre,
	BaiePolycarbonate,
	BaieFenetreOuPorteFenetre,
]);

export const BaieWithData = z.intersection(
	Baie,
	z.object({
		data: BaieData,
	}),
);

export type Baie = z.infer<typeof Baie>;
export type BaieBase = z.infer<typeof BaieBase>;
export type BaieBriqueVerre = z.infer<typeof BaieBriqueVerre>;
export type BaiePolycarbonate = z.infer<typeof BaiePolycarbonate>;
export type BaieFenetreOuPorteFenetre = z.infer<
	typeof BaieFenetreOuPorteFenetre
>;
export type BaieWithData = z.infer<typeof BaieWithData>;
