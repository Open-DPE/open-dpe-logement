import { Energie } from "../../common/enums.js";
import { TypeGenerateur } from "./enums.js";
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
	Energie.enum.gaz_naturel,
	Energie.enum.gpl,
	Energie.enum.fioul,
	Energie.enum.charbon,
	Energie.enum.bois_buche,
	Energie.enum.bois_plaquette,
	Energie.enum.bois_granule,
] as const;

export function isChaudiereCombustion(
	value: GenerateurBase,
): value is ChaudiereCombustion {
	return (
		value.type === TypeGenerateur.enum.chaudiere &&
		value.energie !== null &&
		(ENERGIES_COMBUSTION as readonly string[]).includes(value.energie)
	);
}

export function isPoeleBoisBouilleur(
	value: GenerateurBase,
): value is PoeleBoisBouilleur {
	return value.type === TypeGenerateur.enum.poele_bouilleur;
}

export function isPoeleOuInsert(value: GenerateurBase): value is PoeleOuInsert {
	return (
		value.type === TypeGenerateur.enum.cuisiniere ||
		value.type === TypeGenerateur.enum.foyer_ferme ||
		value.type === TypeGenerateur.enum.insert ||
		value.type === TypeGenerateur.enum.poele
	);
}

export function isGenerateurAirChaudCombustion(
	value: GenerateurBase,
): value is GenerateurAirChaudCombustion {
	return (
		value.type === TypeGenerateur.enum.generateur_air_chaud &&
		value.energie !== null &&
		(ENERGIES_COMBUSTION as readonly string[]).includes(value.energie)
	);
}

export function isRadiateurGaz(value: GenerateurBase): value is RadiateurGaz {
	return value.type === TypeGenerateur.enum.radiateur_gaz;
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
		(value.type === TypeGenerateur.enum.chaudiere ||
			value.type === TypeGenerateur.enum.generateur_air_chaud) &&
		value.energie === Energie.enum.electricite
	);
}

export function isEmetteurElectrique(
	value: GenerateurBase,
): value is EmetteurElectrique {
	return (
		value.energie === Energie.enum.electricite &&
		(value.type === TypeGenerateur.enum.generateur_air_chaud ||
			value.type === TypeGenerateur.enum.convecteur_bi_jonction ||
			value.type === TypeGenerateur.enum.convecteur_electrique ||
			value.type === TypeGenerateur.enum.panneau_rayonnant_electrique ||
			value.type === TypeGenerateur.enum.plafond_rayonnant_electrique ||
			value.type === TypeGenerateur.enum.plancher_rayonnant_electrique ||
			value.type === TypeGenerateur.enum.radiateur_electrique ||
			value.type === TypeGenerateur.enum.radiateur_electrique_accumulation)
	);
}

export function isGenerateurThermodynamique(
	value: GenerateurBase,
): value is GenerateurThermodynamique {
	return isPacClassique(value) || isPacHybride(value);
}

function isTypePac(type: GenerateurBase["type"]): boolean {
	return (
		type === TypeGenerateur.enum.pac_air_air ||
		type === TypeGenerateur.enum.pac_air_eau ||
		type === TypeGenerateur.enum.pac_eau_eau ||
		type === TypeGenerateur.enum.pac_eau_glycolee_eau ||
		type === TypeGenerateur.enum.pac_geothermique
	);
}

export function isPacClassique(value: GenerateurBase): value is PacClassique {
	return isTypePac(value.type) && value.bienergie === null;
}

export function isPacHybride(value: GenerateurBase): value is PacHybride {
	return (
		isTypePac(value.type) &&
		value.type !== TypeGenerateur.enum.pac_air_air &&
		value.bienergie !== null
	);
}

export function isReseauChaleur(value: GenerateurBase): value is ReseauChaleur {
	return value.type === TypeGenerateur.enum.reseau_chaleur;
}

export function isGenerateurCollectifInconnu(
	value: GenerateurBase,
): value is GenerateurCollectifInconnu {
	return value.type === null;
}

export function isGenerateurMultiBatiment(value: GenerateurBase): boolean {
	return value.position.generateur_multi_batiment;
}
