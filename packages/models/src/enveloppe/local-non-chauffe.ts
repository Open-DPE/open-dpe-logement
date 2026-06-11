import type {
	UUID,
	NonEmptyArray,
	OrientationCardinale,
} from "#/common/common";
import { buildEnum, createGuard } from "#/utils";
import type {
	Mitoyennete,
	Orientation,
	OrientationHorizontale,
} from "./common.js";
import type { Materiau, TypeVitrage, TypeVitrageEnum } from "./baie.js";

export const isLocalNonChauffe = createGuard<LocalNonChauffe>(
	"/enveloppe/local-non-chauffe",
);
export const isBaie = createGuard<Baie>("/enveloppe/local-non-chauffe/baie");
export const isParoi = createGuard<Paroi>("/enveloppe/local-non-chauffe/paroi");

export function isEspaceTamponSolarise(
	localNonChauffe: LocalNonChauffe,
): localNonChauffe is EspaceTamponSolarise {
	return localNonChauffe.type === TypeLncEnum.espace_tampon_solarise;
}

export function isAutreLocalNonChauffe(
	localNonChauffe: LocalNonChauffe,
): localNonChauffe is AutreLocalNonChauffe {
	return localNonChauffe.type !== TypeLncEnum.espace_tampon_solarise;
}

/**
 * @see https://schemas.open-dpe.fr/enveloppe/local-non-chauffe
 */
export type LocalNonChauffe = EspaceTamponSolarise | AutreLocalNonChauffe;

type LocalNonChauffeBase = {
	id: UUID;
	description: string;
	type: TypeLnc;
	parois: Paroi[];
	baies: Baie[];
};

export type EspaceTamponSolarise = LocalNonChauffeBase & {
	type: typeof TypeLncEnum.espace_tampon_solarise;
	baies: NonEmptyArray<Baie>;
};

export type AutreLocalNonChauffe = LocalNonChauffeBase & {
	type: Exclude<TypeLnc, typeof TypeLncEnum.espace_tampon_solarise>;
	parois: NonEmptyArray<Paroi>;
};

export type LocalNonChauffeWithData<
	T extends LocalNonChauffe = LocalNonChauffe,
> = T & {
	data: LocalNonChauffeData;
};

export type LocalNonChauffeData = {
	b: number;
	aiu: number;
	aue: number;
	isolation_aiu: boolean;
	isolation_aue: boolean;
	sse: number;
	orientations: OrientationCardinale[];
	t: number;
};

export type Paroi = {
	id: UUID;
	description: string;
	isolation: boolean | null;
	position: PositionParoi;
};

export type PositionParoi = {
	mitoyennete: Mitoyennete;
	surface: number;
};

export type Baie = BaieVitree | BaieAutre;

type BaieBase = {
	id: UUID;
	description: string;
	type_vitrage: TypeVitrage | null;
	materiau_menuiserie: Materiau | null;
	presence_rupteur_pont_thermique: boolean | null;
	position: PositionBaie;
};

export type BaieVitree = BaieBase & {
	type_vitrage:
		| typeof TypeVitrageEnum.polycarbonate
		| typeof TypeVitrageEnum.brique_verre;
	materiau_menuiserie: null;
};

export type BaieAutre = BaieBase & {
	type_vitrage: Exclude<
		TypeVitrage,
		typeof TypeVitrageEnum.polycarbonate | typeof TypeVitrageEnum.brique_verre
	>;
};

export type PositionBaie = PositionBaieHorizontale | PositionBaieVerticale;

type PositionBaieBase = {
	mitoyennete: Mitoyennete;
	surface: number;
	orientation: Orientation;
	inclinaison: number;
};

export type PositionBaieHorizontale = PositionBaieBase & {
	orientation: typeof OrientationHorizontale;
	inclinaison: 0;
};

export type PositionBaieVerticale = PositionBaieBase & {
	orientation: Exclude<Orientation, typeof OrientationHorizontale>;
	inclinaison: number;
};

export const TYPES_LNC = [
	"garage",
	"cellier",
	"espace_tampon_solarise",
	"comble_fortement_ventile",
	"comble_faiblement_ventile",
	"comble_tres_faiblement_ventile",
	"circulation_sans_ouverture_exterieure",
	"circulation_avec_ouverture_exterieure",
	"circulation_avec_bouche_ou_gaine_desenfumage_ouverte",
	"hall_entree_avec_fermeture_automatique",
	"hall_entree_sans_fermeture_automatique",
	"garage_collectif",
	"autres",
] as const;
export type TypeLnc = (typeof TYPES_LNC)[number];
export const TypeLncEnum = buildEnum(TYPES_LNC);
