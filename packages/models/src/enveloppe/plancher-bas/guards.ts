import { Mitoyennete } from "../common/enums.js";
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
	return value.mitoyennete === Mitoyennete.enum.local_non_chauffe;
}

export function isPositionMitoyenneteAutres(
	value: PositionBase,
): value is PositionMitoyenneteAutres {
	return value.mitoyennete !== Mitoyennete.enum.local_non_chauffe;
}

export function isPositionTerrePlein(
	value: PositionBase,
): value is PositionTerrePlein {
	return (
		value.mitoyennete === Mitoyennete.enum.enterre ||
		value.mitoyennete === Mitoyennete.enum.vide_sanitaire ||
		value.mitoyennete === Mitoyennete.enum.terre_plein ||
		value.mitoyennete === Mitoyennete.enum.sous_sol_non_chauffe
	);
}

export function isPositionAutres(value: PositionBase): value is PositionAutres {
	return (
		value.mitoyennete === Mitoyennete.enum.exterieur ||
		value.mitoyennete === Mitoyennete.enum.local_non_chauffe ||
		value.mitoyennete === Mitoyennete.enum.local_non_residentiel ||
		value.mitoyennete === Mitoyennete.enum.local_residentiel ||
		value.mitoyennete === Mitoyennete.enum.local_non_accessible
	);
}
