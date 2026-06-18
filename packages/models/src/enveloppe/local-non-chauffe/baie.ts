import { validate } from "@open-dpe-logement/schemas/enveloppe/local-non-chauffe/baie";
import type { UUID } from "../../common/common.js";
import type { Materiau, TypeVitrage, TypeVitrageEnum } from "../baie.js";
import type {
	Mitoyennete,
	Orientation,
	OrientationHorizontale,
} from "../common.js";

export function isBaie(data: unknown): data is Baie {
	return validate(data).isValid;
}

export type Baie = BaieVitree | BaieAutre;

type BaieType<
	T extends {
		type_vitrage: TypeVitrage | null;
		materiau_menuiserie?: Materiau | null;
	},
> = {
	id: UUID;
	description: string;
	type_vitrage: TypeVitrage | null;
	materiau_menuiserie: Materiau | null;
	presence_rupteur_pont_thermique: boolean | null;
	position: Position;
} & T;

export type BaieVitree = BaieType<{
	type_vitrage:
		| typeof TypeVitrageEnum.polycarbonate
		| typeof TypeVitrageEnum.brique_verre;
	materiau_menuiserie: null;
}>;

export type BaieAutre = BaieType<{
	type_vitrage: Exclude<
		TypeVitrage,
		typeof TypeVitrageEnum.polycarbonate | typeof TypeVitrageEnum.brique_verre
	>;
}>;

export type Position = PositionHorizontale | PositionVerticale;

type PositionType<
	T extends {
		orientation: Orientation;
		inclinaison: number;
	},
> = {
	mitoyennete: Mitoyennete;
	surface: number;
	orientation: Orientation;
	inclinaison: number;
} & T;

export type PositionHorizontale = PositionType<{
	orientation: typeof OrientationHorizontale;
	inclinaison: 0;
}>;

export type PositionVerticale = PositionType<{
	orientation: Exclude<Orientation, typeof OrientationHorizontale>;
	inclinaison: number;
}>;
