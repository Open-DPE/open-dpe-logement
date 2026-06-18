import { validate } from "@open-dpe-logement/schemas/enveloppe/baie";
import type { UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";
import type { Masque } from "./masque.js";
import type {
	Orientation,
	OrientationHorizontale,
	Position as BasePosition,
	TypePose,
} from "./common.js";

export function isBaie(data: unknown): data is Baie {
	return validate(data).isValid;
}

/**
 * @see https://schemas.open-dpe.fr/enveloppe/baie
 */
export type Baie =
	| BaieBriqueVerre
	| BaiePolycarbonate
	| BaieFenetreOuPorteFenetre;

type BaieBase = {
	id: UUID;
	description: string;
	type: TypeBaie;
	presence_protection_solaire: boolean;
	type_fermeture: TypeFermeture;
	annee_installation: number | null;
	ug: number | null;
	uw: number | null;
	ujn: number | null;
	sw: number | null;
	position: Position;
	menuiserie: Menuiserie | null;
	vitrage: Vitrage;
	survitrage: Survitrage | null;
};

export type BaieBriqueVerre = BaieBase & {
	type:
		| typeof TypeBaieEnum.brique_verre_pleine
		| typeof TypeBaieEnum.brique_verre_creuse;
	vitrage: {
		type: typeof TypeVitrageEnum.brique_verre;
	};
	menuiserie: null;
};

export type BaiePolycarbonate = BaieBase & {
	type: typeof TypeBaieEnum.polycarbonate;
	vitrage: {
		type: typeof TypeVitrageEnum.polycarbonate;
	};
	menuiserie: null;
};

export type BaieFenetreOuPorteFenetre = BaieBase & {
	type:
		| typeof TypeBaieEnum.fenetre_battante
		| typeof TypeBaieEnum.fenetre_coulissante
		| typeof TypeBaieEnum.porte_fenetre_coulissante
		| typeof TypeBaieEnum.porte_fenetre_battante;
	vitrage: {
		type: Exclude<
			TypeVitrage,
			typeof TypeVitrageEnum.brique_verre | typeof TypeVitrageEnum.polycarbonate
		>;
	};
	menuiserie: Menuiserie;
};

export type BaieWithData<T extends Baie = Baie> = T & {
	data: BaieData;
};

export type BaieData = {
	u: number;
	b: number;
	sdep: number;
	dp: number;
	deltar: number;
	uw: number;
	ug: number;
	sw: number;
	fe: number;
	sse: number;
};

export type Position = BasePosition & {
	paroi_id: UUID | null;
	baie_id: UUID | null;
	type_pose: TypePose;
	inclinaison: number;
	orientation: Orientation;
	masques: Masque[];
} & (PositionHorizontale | PositionVerticale);

export type PositionHorizontale = {
	inclinaison: 0;
	orientation: typeof OrientationHorizontale;
};

export type PositionVerticale = {
	inclinaison: number;
	orientation: Exclude<Orientation, typeof OrientationHorizontale>;
};

export type Menuiserie = {
	materiau: Materiau | null;
	largeur_dormant: number | null;
	presence_soubassement: boolean;
	presence_joint: boolean | null;
	presence_retour_isolation: boolean | null;
	presence_rupteur_pont_thermique: boolean | null;
};

export type Vitrage = VitrageSimple | VitrageComplexe | AutresVitrages;

type VitrageBase = {
	type: TypeVitrage | null;
	nature_lame: NatureLame | null;
	epaisseur_lame: number | null;
};

export type VitrageSimple = VitrageBase & {
	type: typeof TypeVitrageEnum.simple_vitrage;
	nature_lame: null;
	epaisseur_lame: null;
};

export type VitrageComplexe = VitrageBase & {
	type:
		| typeof TypeVitrageEnum.double_vitrage
		| typeof TypeVitrageEnum.double_vitrage_fe
		| typeof TypeVitrageEnum.triple_vitrage
		| typeof TypeVitrageEnum.triple_vitrage_fe;
	nature_lame: NatureLame | null;
	epaisseur_lame: number | null;
};

export type AutresVitrages = VitrageBase & {
	type:
		| typeof TypeVitrageEnum.polycarbonate
		| typeof TypeVitrageEnum.brique_verre
		| null;
	nature_lame: null;
	epaisseur_lame: null;
};

export type Survitrage = {
	type: TypeSurvitrage | null;
	epaisseur_lame: number | null;
};

export const TYPES_BAIE = [
	"brique_verre_pleine",
	"brique_verre_creuse",
	"polycarbonate",
	"fenetre_battante",
	"fenetre_coulissante",
	"porte_fenetre_coulissante",
	"porte_fenetre_battante",
] as const;
export type TypeBaie = (typeof TYPES_BAIE)[number];
export const TypeBaieEnum = buildEnum(TYPES_BAIE);

export const TYPES_FERMETURE = [
	"sans_fermeture",
	"jalousie_accordeon",
	"fermeture_lames_orientables",
	"venitiens_exterieurs_metal",
	"volet_battant_avec_ajours_fixes",
	"persiennes_avec_ajours_fixes",
	"fermeture_sans_ajours",
	"volets_roulants_aluminium",
	"volets_roulants_pvc_bois_epaisseur_lte_12mm",
	"volets_roulants_pvc_bois_epaisseur_gt_12mm",
	"persienne_coulissante_epaisseur_lte_22mm",
	"persienne_coulissante_epaisseur_gt_22mm",
	"volet_battant_pvc_bois_epaisseur_lte_22mm",
	"volet_battant_pvc_bois_epaisseur_gt_22mm",
	"fermeture_isolee_sans_ajours",
] as const;
export type TypeFermeture = (typeof TYPES_FERMETURE)[number];
export const TypeFermetureEnum = buildEnum(TYPES_FERMETURE);

export const TYPES_VITRAGE = [
	"brique_verre",
	"polycarbonate",
	"simple_vitrage",
	"double_vitrage",
	"double_vitrage_fe",
	"triple_vitrage",
	"triple_vitrage_fe",
] as const;
export type TypeVitrage = (typeof TYPES_VITRAGE)[number];
export const TypeVitrageEnum = buildEnum(TYPES_VITRAGE);

export const NATURES_LAME = ["air", "argon", "krypton"] as const;
export type NatureLame = (typeof NATURES_LAME)[number];
export const NatureLameEnum = buildEnum(NATURES_LAME);

export const TYPES_SURVITRAGE = ["survitrage_simple", "survitrage_fe"] as const;
export type TypeSurvitrage = (typeof TYPES_SURVITRAGE)[number];
export const TypeSurvitrageEnum = buildEnum(TYPES_SURVITRAGE);

export const MATERIAUX = ["bois", "metal", "pvc", "bois_metal"] as const;
export type Materiau = (typeof MATERIAUX)[number];
export const MateriauEnum = buildEnum(MATERIAUX);
