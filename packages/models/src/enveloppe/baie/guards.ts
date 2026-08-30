import { MITOYENNETES } from "../common/enums.js";
import { TYPES_BAIE, TYPES_VITRAGE } from "./enums.js";
import {
	PositionBase,
	PositionMitoyenneteLocalNonChauffe,
	PositionMitoyenneteAutres,
	PositionVerticale,
	PositionHorizontale,
	VitrageBase,
	Vitrage,
	VitrageSimple,
	VitrageComplexe,
	VitrageBriqueVerre,
	VitragePolycarbonate,
	VitrageInconnu,
	BaieBase,
	Baie,
	BaieBriqueVerre,
	BaiePolycarbonate,
	BaieFenetreOuPorteFenetre,
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

export function isVitrage(value: VitrageBase): value is Vitrage {
	return (
		isVitrageSimple(value) ||
		isVitrageComplexe(value) ||
		isVitrageBriqueVerre(value) ||
		isVitragePolycarbonate(value) ||
		isVitrageInconnu(value)
	);
}

export function isVitrageSimple(value: VitrageBase): value is VitrageSimple {
	return value.type === TYPES_VITRAGE.simple_vitrage;
}

export function isVitrageComplexe(
	value: VitrageBase,
): value is VitrageComplexe {
	return (
		value.type === TYPES_VITRAGE.double_vitrage ||
		value.type === TYPES_VITRAGE.double_vitrage_fe ||
		value.type === TYPES_VITRAGE.triple_vitrage ||
		value.type === TYPES_VITRAGE.triple_vitrage_fe
	);
}

export function isVitrageBriqueVerre(
	value: VitrageBase,
): value is VitrageBriqueVerre {
	return value.type === TYPES_VITRAGE.brique_verre;
}

export function isVitragePolycarbonate(
	value: VitrageBase,
): value is VitragePolycarbonate {
	return value.type === TYPES_VITRAGE.polycarbonate;
}

export function isVitrageInconnu(value: VitrageBase): value is VitrageInconnu {
	return value.type === null;
}

export function isBaie(value: BaieBase): value is Baie {
	return (
		isBaieBriqueVerre(value) ||
		isBaiePolycarbonate(value) ||
		isBaieFenetreOuPorteFenetre(value)
	);
}

export function isBaieBriqueVerre(value: BaieBase): value is BaieBriqueVerre {
	return (
		value.type === TYPES_BAIE.brique_verre_pleine ||
		value.type === TYPES_BAIE.brique_verre_creuse
	);
}

export function isBaiePolycarbonate(
	value: BaieBase,
): value is BaiePolycarbonate {
	return value.type === TYPES_BAIE.polycarbonate;
}

export function isBaieFenetreOuPorteFenetre(
	value: BaieBase,
): value is BaieFenetreOuPorteFenetre {
	return (
		value.type === TYPES_BAIE.fenetre_battante ||
		value.type === TYPES_BAIE.fenetre_coulissante ||
		value.type === TYPES_BAIE.porte_fenetre_coulissante ||
		value.type === TYPES_BAIE.porte_fenetre_battante
	);
}
