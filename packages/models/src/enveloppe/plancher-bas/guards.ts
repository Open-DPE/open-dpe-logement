import { MITOYENNETES } from "../common/enums.js";
import {
	PositionBase,
	PositionMitoyenneteLocalNonChauffe,
	PositionMitoyenneteAutres,
	PositionTerrePlein,
	PositionAutres,
} from "./types.js";

export function isPositionMitoyenneteLocalNonChauffe(
	value: PositionBase,
): value is PositionMitoyenneteLocalNonChauffe {
	return value.mitoyennete === MITOYENNETES.local_non_chauffe;
}

export function isPositionMitoyenneteAutres(
	value: PositionBase,
): value is PositionMitoyenneteAutres {
	return value.mitoyennete !== MITOYENNETES.local_non_chauffe;
}

export function isPositionTerrePlein(
	value: PositionBase,
): value is PositionTerrePlein {
	return (
		value.mitoyennete === MITOYENNETES.enterre ||
		value.mitoyennete === MITOYENNETES.vide_sanitaire ||
		value.mitoyennete === MITOYENNETES.terre_plein ||
		value.mitoyennete === MITOYENNETES.sous_sol_non_chauffe
	);
}

export function isPositionAutres(value: PositionBase): value is PositionAutres {
	return (
		value.mitoyennete === MITOYENNETES.exterieur ||
		value.mitoyennete === MITOYENNETES.local_non_chauffe ||
		value.mitoyennete === MITOYENNETES.local_non_residentiel ||
		value.mitoyennete === MITOYENNETES.local_residentiel ||
		value.mitoyennete === MITOYENNETES.local_non_accessible
	);
}
