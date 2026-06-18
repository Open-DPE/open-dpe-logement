import { validate } from "@open-dpe-logement/schemas/enveloppe/local-non-chauffe";
import type {
	UUID,
	NonEmptyArray,
	OrientationCardinale,
} from "../common/common.js";
import { buildEnum } from "../utils.js";
import * as baie from "./local-non-chauffe/baie.js";
import * as paroi from "./local-non-chauffe/paroi.js";

export { baie, paroi };

export function isLocalNonChauffe(data: unknown): data is LocalNonChauffe {
	return validate(data).isValid;
}

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

type LocalNonChauffeType<
	T extends {
		type: TypeLnc;
		baies?: baie.Baie[];
		parois?: paroi.Paroi[];
	},
> = {
	id: UUID;
	description: string;
	type: TypeLnc;
	parois: paroi.Paroi[];
	baies: baie.Baie[];
} & T;

export type EspaceTamponSolarise = LocalNonChauffeType<{
	type: typeof TypeLncEnum.espace_tampon_solarise;
	baies: NonEmptyArray<baie.Baie>;
}>;

export type AutreLocalNonChauffe = LocalNonChauffeType<{
	type: Exclude<TypeLnc, typeof TypeLncEnum.espace_tampon_solarise>;
	parois: NonEmptyArray<paroi.Paroi>;
}>;

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
