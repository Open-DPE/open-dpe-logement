import { TypeVitrage } from "../../baie/enums.js";
import {
	PositionBase,
	Position,
	PositionVerticale,
	PositionHorizontale,
	BaieBase,
	Baie,
	BaieVitree,
	BaieAutre,
} from "./types.js";

export function isPosition(value: PositionBase): value is Position {
	return isPositionVerticale(value) || isPositionHorizontale(value);
}

export function isPositionVerticale(
	value: PositionBase,
): value is PositionVerticale {
	return value.inclinaison > 0;
}

export function isPositionHorizontale(
	value: PositionBase,
): value is PositionHorizontale {
	return value.inclinaison === 0;
}

export function isBaie(value: BaieBase): value is Baie {
	return isBaieVitree(value) || isBaieAutre(value);
}

export function isBaieVitree(value: BaieBase): value is BaieVitree {
	return (
		value.type_vitrage === TypeVitrage.enum.polycarbonate ||
		value.type_vitrage === TypeVitrage.enum.brique_verre
	);
}

export function isBaieAutre(value: BaieBase): value is BaieAutre {
	return (
		value.type_vitrage !== TypeVitrage.enum.polycarbonate &&
		value.type_vitrage !== TypeVitrage.enum.brique_verre
	);
}
