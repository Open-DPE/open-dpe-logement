import type { UUID } from "../common/common.js";
import { buildEnum } from "../utils.js";
import type { Masque } from "./masque.js";
import type {
	Orientation,
	OrientationHorizontale,
	Position as _PositionBase,
	TypePose,
} from "./common.js";

/**
 * @see https://schemas.open-dpe.fr/enveloppe/baie
 */
export type Baie =
	| BaieBriqueVerre
	| BaiePolycarbonate
	| BaieFenetreOuPorteFenetre;

export function isBaie(value: BaieBase): value is Baie {
	return (
		isBaieBriqueVerre(value) ||
		isBaiePolycarbonate(value) ||
		isBaieFenetreOuPorteFenetre(value)
	);
}

export type BaieBase = {
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

type _Baie<T extends Partial<BaieBase>> = BaieBase & T;

export type BaieBriqueVerre = _Baie<{
	type:
		| typeof TypeBaieEnum.brique_verre_pleine
		| typeof TypeBaieEnum.brique_verre_creuse;
	vitrage: BriqueVerre;
	menuiserie: null;
}>;

export function isBaieBriqueVerre(value: BaieBase): value is BaieBriqueVerre {
	return (
		value.type === TypeBaieEnum.brique_verre_pleine ||
		value.type === TypeBaieEnum.brique_verre_creuse
	);
}

export type BaiePolycarbonate = _Baie<{
	type: typeof TypeBaieEnum.polycarbonate;
	vitrage: Polycarbonate;
	menuiserie: null;
}>;

export function isBaiePolycarbonate(
	value: BaieBase,
): value is BaiePolycarbonate {
	return value.type === TypeBaieEnum.polycarbonate;
}

export type BaieFenetreOuPorteFenetre = _Baie<{
	type:
		| typeof TypeBaieEnum.fenetre_battante
		| typeof TypeBaieEnum.fenetre_coulissante
		| typeof TypeBaieEnum.porte_fenetre_coulissante
		| typeof TypeBaieEnum.porte_fenetre_battante;
	vitrage: VitrageComplexe | VitrageSimple | VitrageInconnu;
	menuiserie: Menuiserie;
}>;

export function isBaieFenetreOuPorteFenetre(
	value: BaieBase,
): value is BaieFenetreOuPorteFenetre {
	return (
		value.type === TypeBaieEnum.fenetre_battante ||
		value.type === TypeBaieEnum.fenetre_coulissante ||
		value.type === TypeBaieEnum.porte_fenetre_coulissante ||
		value.type === TypeBaieEnum.porte_fenetre_battante
	);
}

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

export type Position = PositionHorizontale | PositionVerticale;

export function isPosition(value: PositionBase): value is Position {
	return isPositionHorizontale(value) || isPositionVerticale(value);
}

export type PositionBase = _PositionBase & {
	paroi_id: UUID | null;
	baie_id: UUID | null;
	type_pose: TypePose | null;
	inclinaison: number;
	orientation: Orientation;
	masques: Masque[];
};

type _Position<T extends Partial<PositionBase>> = PositionBase & T;

export type PositionHorizontale = _Position<{
	inclinaison: 0;
	orientation: typeof OrientationHorizontale;
}>;

export function isPositionHorizontale(
	value: PositionBase,
): value is PositionHorizontale {
	return value.inclinaison === 0;
}

export type PositionVerticale = _Position<{
	inclinaison: number;
	orientation: Exclude<Orientation, typeof OrientationHorizontale>;
}>;

export function isPositionVerticale(
	value: PositionBase,
): value is PositionVerticale {
	return value.inclinaison > 0;
}

export type Menuiserie = {
	materiau: Materiau | null;
	largeur_dormant: number | null;
	presence_soubassement: boolean;
	presence_joint: boolean | null;
	presence_retour_isolation: boolean | null;
	presence_rupteur_pont_thermique: boolean | null;
};

export type Vitrage =
	| VitrageSimple
	| VitrageComplexe
	| BriqueVerre
	| Polycarbonate
	| VitrageInconnu;

export function isVitrage(value: VitrageBase): value is Vitrage {
	return (
		isVitrageSimple(value) ||
		isVitrageComplexe(value) ||
		isBriqueVerre(value) ||
		isPolycarbonate(value) ||
		isVitrageInconnu(value)
	);
}

export type VitrageBase = {
	type: TypeVitrage | null;
	nature_lame: NatureLame | null;
	epaisseur_lame: number | null;
};

type _Vitrage<T extends Partial<VitrageBase>> = VitrageBase & T;

export type VitrageSimple = _Vitrage<{
	type: typeof TypeVitrageEnum.simple_vitrage;
	nature_lame: null;
	epaisseur_lame: null;
}>;

export function isVitrageSimple(value: VitrageBase): value is VitrageSimple {
	return value.type === TypeVitrageEnum.simple_vitrage;
}

export type VitrageComplexe = _Vitrage<{
	type:
		| typeof TypeVitrageEnum.double_vitrage
		| typeof TypeVitrageEnum.double_vitrage_fe
		| typeof TypeVitrageEnum.triple_vitrage
		| typeof TypeVitrageEnum.triple_vitrage_fe;
	nature_lame: NatureLame | null;
	epaisseur_lame: number | null;
}>;

export function isVitrageComplexe(
	value: VitrageBase,
): value is VitrageComplexe {
	return (
		value.type === TypeVitrageEnum.double_vitrage ||
		value.type === TypeVitrageEnum.double_vitrage_fe ||
		value.type === TypeVitrageEnum.triple_vitrage ||
		value.type === TypeVitrageEnum.triple_vitrage_fe
	);
}

export type BriqueVerre = _Vitrage<{
	type: typeof TypeVitrageEnum.brique_verre;
	nature_lame: null;
	epaisseur_lame: null;
}>;

export function isBriqueVerre(value: VitrageBase): value is BriqueVerre {
	return value.type === TypeVitrageEnum.brique_verre;
}

export type Polycarbonate = _Vitrage<{
	type: typeof TypeVitrageEnum.polycarbonate;
	nature_lame: null;
	epaisseur_lame: null;
}>;

export function isPolycarbonate(value: VitrageBase): value is Polycarbonate {
	return value.type === TypeVitrageEnum.polycarbonate;
}

export type VitrageInconnu = _Vitrage<{
	type: null;
	nature_lame: null;
	epaisseur_lame: null;
}>;

export function isVitrageInconnu(value: VitrageBase): value is VitrageInconnu {
	return value.type === null;
}

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
