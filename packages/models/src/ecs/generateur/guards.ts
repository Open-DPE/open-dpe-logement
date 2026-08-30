import { ENERGIES } from "../../common/enums.js";
import { TYPES_GENERATEUR } from "./enums.js";
import {
	GenerateurBase,
	Generateur,
	GenerateurCombustion,
	ChaudiereCombustion,
	PoeleBoisBouilleur,
	ChauffeEauGaz,
	GenerateurElectrique,
	ChaudiereElectrique,
	ChauffeEauElectrique,
	GenerateurThermodynamique,
	ChauffeEauThermodynamique,
	PacDoubleService,
	PacDoubleServiceHybride,
	ReseauChaleur,
	GenerateurCollectifInconnu,
} from "./types.js";

export function isGenerateur(value: GenerateurBase): value is Generateur {
	return (
		isChaudiereCombustion(value) ||
		isPoeleBoisBouilleur(value) ||
		isChauffeEauGaz(value) ||
		isChaudiereElectrique(value) ||
		isChauffeEauElectrique(value) ||
		isChauffeEauThermodynamique(value) ||
		isPacDoubleService(value) ||
		isPacDoubleServiceHybride(value) ||
		isReseauChaleur(value) ||
		isGenerateurCollectifInconnu(value)
	);
}

export function isGenerateurCombustion(
	value: GenerateurBase,
): value is GenerateurCombustion {
	return (
		isChaudiereCombustion(value) ||
		isPoeleBoisBouilleur(value) ||
		isChauffeEauGaz(value)
	);
}

export function isChaudiereCombustion(
	value: GenerateurBase,
): value is ChaudiereCombustion {
	return (
		value.type === TYPES_GENERATEUR.chaudiere &&
		value.energie !== null &&
		value.energie !== ENERGIES.electricite &&
		value.energie !== ENERGIES.reseau_chaleur
	);
}

export function isPoeleBoisBouilleur(
	value: GenerateurBase,
): value is PoeleBoisBouilleur {
	return value.type === TYPES_GENERATEUR.poele_bouilleur;
}

export function isChauffeEauGaz(
	value: GenerateurBase,
): value is ChauffeEauGaz {
	return (
		value.type === TYPES_GENERATEUR.chauffe_eau &&
		(value.energie === ENERGIES.gaz_naturel ||
			value.energie === ENERGIES.gpl)
	);
}

export function isGenerateurElectrique(
	value: GenerateurBase,
): value is GenerateurElectrique {
	return isChaudiereElectrique(value) || isChauffeEauElectrique(value);
}

export function isChaudiereElectrique(
	value: GenerateurBase,
): value is ChaudiereElectrique {
	return (
		value.type === TYPES_GENERATEUR.chaudiere &&
		value.energie === ENERGIES.electricite
	);
}

export function isChauffeEauElectrique(
	value: GenerateurBase,
): value is ChauffeEauElectrique {
	return (
		value.type === TYPES_GENERATEUR.chauffe_eau &&
		value.energie === ENERGIES.electricite
	);
}

export function isGenerateurThermodynamique(
	value: GenerateurBase,
): value is GenerateurThermodynamique {
	return (
		isChauffeEauThermodynamique(value) ||
		isPacDoubleService(value) ||
		isPacDoubleServiceHybride(value)
	);
}

export function isChauffeEauThermodynamique(
	value: GenerateurBase,
): value is ChauffeEauThermodynamique {
	return (
		value.type === TYPES_GENERATEUR.cet_air_ambiant ||
		value.type === TYPES_GENERATEUR.cet_air_exterieur ||
		value.type === TYPES_GENERATEUR.cet_air_extrait
	);
}

function isTypePac(type: GenerateurBase["type"]): boolean {
	return (
		type === TYPES_GENERATEUR.pac_air_eau ||
		type === TYPES_GENERATEUR.pac_eau_eau ||
		type === TYPES_GENERATEUR.pac_eau_glycolee_eau ||
		type === TYPES_GENERATEUR.pac_geothermique
	);
}

export function isPacDoubleService(
	value: GenerateurBase,
): value is PacDoubleService {
	return isTypePac(value.type) && value.bienergie === null;
}

export function isPacDoubleServiceHybride(
	value: GenerateurBase,
): value is PacDoubleServiceHybride {
	return isTypePac(value.type) && value.bienergie !== null;
}

export function isReseauChaleur(
	value: GenerateurBase,
): value is ReseauChaleur {
	return value.type === TYPES_GENERATEUR.reseau_chaleur;
}

export function isGenerateurCollectifInconnu(
	value: GenerateurBase,
): value is GenerateurCollectifInconnu {
	return value.type === null;
}

export function isGenerateurMultiBatiment(value: GenerateurBase): boolean {
	return value.position.generateur_multi_batiment;
}
