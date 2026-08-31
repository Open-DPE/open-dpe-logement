import { Mitoyennete } from "./enums.js";
import {
	PositionBase,
	Position,
	PositionLocalNonChauffe,
	PositionAutres,
	IsolationBase,
	Isolation,
	SansIsolation,
	IsolationInconnue,
	TypeIsolationInconnue,
	IsolationConnue,
} from "./types.js";

export function isPosition(value: PositionBase): value is Position {
	return isPositionLocalNonChauffe(value) || isPositionAutres(value);
}

export function isPositionLocalNonChauffe(
	value: PositionBase,
): value is PositionLocalNonChauffe {
	return value.mitoyennete === Mitoyennete.enum.local_non_chauffe;
}

export function isPositionAutres(value: PositionBase): value is PositionAutres {
	return value.mitoyennete !== Mitoyennete.enum.local_non_chauffe;
}

export function isIsolation(value: IsolationBase): value is Isolation {
	return (
		isSansIsolation(value) ||
		isIsolationInconnue(value) ||
		isTypeIsolationInconnue(value) ||
		isIsolationConnue(value)
	);
}

export function isSansIsolation(value: IsolationBase): value is SansIsolation {
	return value.etat === false;
}

export function isIsolationInconnue(
	value: IsolationBase,
): value is IsolationInconnue {
	return value.etat === null;
}

export function isTypeIsolationInconnue(
	value: IsolationBase,
): value is TypeIsolationInconnue {
	return value.etat === true && value.type === null;
}

export function isIsolationConnue(
	value: IsolationBase,
): value is IsolationConnue {
	return value.etat === true && value.type !== null;
}
