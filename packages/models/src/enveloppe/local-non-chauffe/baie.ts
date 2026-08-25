import type { UUID } from "../../common/common.js";
import { type Materiau, type TypeVitrage, TypeVitrageEnum } from "../baie.js";
import {
	type Mitoyennete,
	type Orientation,
	OrientationHorizontale,
} from "../common.js";

export type Baie = BaieVitree | BaieAutre;

export function isBaie(value: BaieBase): value is Baie {
	return isBaieVitree(value) || isBaieAutre(value);
}

const test = {} as Baie;

test.type_vitrage;

export type BaieBase = {
	id: UUID;
	description: string;
	type_vitrage: TypeVitrage | null;
	materiau_menuiserie: Materiau | null;
	presence_rupteur_pont_thermique: boolean | null;
	position: Position;
};

type _Baie<
	T extends Partial<Pick<BaieBase, "type_vitrage" | "materiau_menuiserie">>,
> = BaieBase & T;

export type BaieVitree = _Baie<{
	type_vitrage:
		| typeof TypeVitrageEnum.polycarbonate
		| typeof TypeVitrageEnum.brique_verre;
	materiau_menuiserie: null;
}>;

export function isBaieVitree(value: BaieBase): value is BaieVitree {
	return (
		value.type_vitrage === TypeVitrageEnum.polycarbonate ||
		value.type_vitrage === TypeVitrageEnum.brique_verre
	);
}

export type BaieAutre = _Baie<{
	type_vitrage: Exclude<
		TypeVitrage,
		typeof TypeVitrageEnum.polycarbonate | typeof TypeVitrageEnum.brique_verre
	> | null;
}>;

export function isBaieAutre(value: BaieBase): value is BaieAutre {
	return (
		value.type_vitrage !== TypeVitrageEnum.polycarbonate &&
		value.type_vitrage !== TypeVitrageEnum.brique_verre
	);
}

export type Position = PositionHorizontale | PositionVerticale;

export function isPosition(value: PositionBase): value is Position {
	return isPositionHorizontale(value) || isPositionVerticale(value);
}

export type PositionBase = {
	mitoyennete: Mitoyennete;
	surface: number;
	orientation: Orientation;
	inclinaison: number;
};

type _Position<T extends Pick<PositionBase, "orientation" | "inclinaison">> =
	PositionBase & T;

export type PositionHorizontale = _Position<{
	orientation: typeof OrientationHorizontale;
	inclinaison: 0;
}>;

export function isPositionHorizontale(
	value: PositionBase,
): value is PositionHorizontale {
	return value.orientation === OrientationHorizontale;
}

export type PositionVerticale = _Position<{
	orientation: Exclude<Orientation, typeof OrientationHorizontale>;
	inclinaison: number;
}>;

export function isPositionVerticale(
	value: PositionBase,
): value is PositionVerticale {
	return value.orientation !== OrientationHorizontale;
}
