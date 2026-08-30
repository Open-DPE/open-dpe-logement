import { MITOYENNETES } from "../common/enums.js";
import {
	PositionBase,
	Position,
	PositionLocalNonChauffe,
	PositionAutres,
	VitrageBase,
	Vitrage,
	VitrageSansVitrage,
	VitrageAvecVitrage,
} from "./types.js";

export function isPosition(value: PositionBase): value is Position {
	return isPositionLocalNonChauffe(value) || isPositionAutres(value);
}

export function isPositionLocalNonChauffe(
	value: PositionBase,
): value is PositionLocalNonChauffe {
	return value.mitoyennete === MITOYENNETES.local_non_chauffe;
}

export function isPositionAutres(value: PositionBase): value is PositionAutres {
	return value.mitoyennete !== MITOYENNETES.local_non_chauffe;
}

export function isVitrage(value: VitrageBase): value is Vitrage {
	return isVitrageSansVitrage(value) || isVitrageAvecVitrage(value);
}

export function isVitrageSansVitrage(
	value: VitrageBase,
): value is VitrageSansVitrage {
	return value.surface === 0;
}

export function isVitrageAvecVitrage(
	value: VitrageBase,
): value is VitrageAvecVitrage {
	return value.surface > 0;
}
