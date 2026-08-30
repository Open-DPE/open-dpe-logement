import { ENERGIES } from "../../common/enums.js";
import { TYPES_GENERATEUR } from "./enums.js";
import {
	GenerateurBase,
	Generateur,
	GenerateurCombustion,
	ChaudiereCombustion,
	PoeleBoisBouilleur,
	PoeleOuInsert,
	GenerateurAirChaudCombustion,
	RadiateurGaz,
	GenerateurElectrique,
	ChaudiereElectrique,
	EmetteurElectrique,
	GenerateurThermodynamique,
	PacClassique,
	PacHybride,
	ReseauChaleur,
	GenerateurCollectifInconnu,
} from "./types.js";

export function isGenerateur(value: GenerateurBase): value is Generateur {
	return (
		isChaudiereCombustion(value) ||
		isPoeleBoisBouilleur(value) ||
		isPoeleOuInsert(value) ||
		isGenerateurAirChaudCombustion(value) ||
		isRadiateurGaz(value) ||
		isChaudiereElectrique(value) ||
		isEmetteurElectrique(value) ||
		isPacClassique(value) ||
		isPacHybride(value) ||
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
		isPoeleOuInsert(value) ||
		isGenerateurAirChaudCombustion(value) ||
		isRadiateurGaz(value)
	);
}

const ENERGIES_COMBUSTION = [
	ENERGIES.gaz_naturel,
	ENERGIES.gpl,
	ENERGIES.fioul,
	ENERGIES.charbon,
	ENERGIES.bois_buche,
	ENERGIES.bois_plaquette,
	ENERGIES.bois_granule,
] as const;

export function isChaudiereCombustion(
	value: GenerateurBase,
): value is ChaudiereCombustion {
	return (
		value.type === TYPES_GENERATEUR.chaudiere &&
		value.energie !== null &&
		(ENERGIES_COMBUSTION as readonly string[]).includes(value.energie)
	);
}

export function isPoeleBoisBouilleur(
	value: GenerateurBase,
): value is PoeleBoisBouilleur {
	return value.type === TYPES_GENERATEUR.poele_bouilleur;
}

export function isPoeleOuInsert(
	value: GenerateurBase,
): value is PoeleOuInsert {
	return (
		value.type === TYPES_GENERATEUR.cuisiniere ||
		value.type === TYPES_GENERATEUR.foyer_ferme ||
		value.type === TYPES_GENERATEUR.insert ||
		value.type === TYPES_GENERATEUR.poele
	);
}

export function isGenerateurAirChaudCombustion(
	value: GenerateurBase,
): value is GenerateurAirChaudCombustion {
	return (
		value.type === TYPES_GENERATEUR.generateur_air_chaud &&
		value.energie !== null &&
		(ENERGIES_COMBUSTION as readonly string[]).includes(value.energie)
	);
}

export function isRadiateurGaz(
	value: GenerateurBase,
): value is RadiateurGaz {
	return value.type === TYPES_GENERATEUR.radiateur_gaz;
}

export function isGenerateurElectrique(
	value: GenerateurBase,
): value is GenerateurElectrique {
	return isChaudiereElectrique(value) || isEmetteurElectrique(value);
}

export function isChaudiereElectrique(
	value: GenerateurBase,
): value is ChaudiereElectrique {
	return (
		(value.type === TYPES_GENERATEUR.chaudiere ||
			value.type === TYPES_GENERATEUR.generateur_air_chaud) &&
		value.energie === ENERGIES.electricite
	);
}

export function isEmetteurElectrique(
	value: GenerateurBase,
): value is EmetteurElectrique {
	return (
		value.energie === ENERGIES.electricite &&
		(value.type === TYPES_GENERATEUR.generateur_air_chaud ||
			value.type === TYPES_GENERATEUR.convecteur_bi_jonction ||
			value.type === TYPES_GENERATEUR.convecteur_electrique ||
			value.type === TYPES_GENERATEUR.panneau_rayonnant_electrique ||
			value.type === TYPES_GENERATEUR.plafond_rayonnant_electrique ||
			value.type === TYPES_GENERATEUR.plancher_rayonnant_electrique ||
			value.type === TYPES_GENERATEUR.radiateur_electrique ||
			value.type === TYPES_GENERATEUR.radiateur_electrique_accumulation)
	);
}

export function isGenerateurThermodynamique(
	value: GenerateurBase,
): value is GenerateurThermodynamique {
	return isPacClassique(value) || isPacHybride(value);
}

function isTypePac(type: GenerateurBase["type"]): boolean {
	return (
		type === TYPES_GENERATEUR.pac_air_air ||
		type === TYPES_GENERATEUR.pac_air_eau ||
		type === TYPES_GENERATEUR.pac_eau_eau ||
		type === TYPES_GENERATEUR.pac_eau_glycolee_eau ||
		type === TYPES_GENERATEUR.pac_geothermique
	);
}

export function isPacClassique(
	value: GenerateurBase,
): value is PacClassique {
	return isTypePac(value.type) && value.bienergie === null;
}

export function isPacHybride(value: GenerateurBase): value is PacHybride {
	return (
		isTypePac(value.type) &&
		value.type !== TYPES_GENERATEUR.pac_air_air &&
		value.bienergie !== null
	);
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
