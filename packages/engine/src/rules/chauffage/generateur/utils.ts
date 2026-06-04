import * as models from "@open-dpe-logement/models";

const TypeGenerateur = models.chauffage.generateur.TypeGenerateurEnum;

export type GenerateurCombustion = {
	type_generateur: models.chauffage.generateur.GenerateurCombustion["type"];
	energie_generateur: models.chauffage.generateur.GenerateurCombustion["energie"];
	bienergie_generateur: models.chauffage.generateur.GenerateurCombustion["bienergie"];
	generateur_multi_batiment: boolean;
};

export type ChaudiereCombustion = {
	type_generateur: models.chauffage.generateur.ChaudiereCombustion["type"];
	energie_generateur: Exclude<
		models.chauffage.generateur.ChaudiereCombustion["energie"],
		| typeof models.common.EnergieEnum.bois_buche
		| typeof models.common.EnergieEnum.bois_plaquette
		| typeof models.common.EnergieEnum.bois_granule
	>;
	bienergie_generateur: models.chauffage.generateur.ChaudiereCombustion["bienergie"];
	generateur_multi_batiment: boolean;
};

export type ChaudiereBois = ChaudiereCombustion & {
	type_generateur: models.chauffage.generateur.ChaudiereCombustion["type"];
	energie_generateur: Extract<
		models.chauffage.generateur.ChaudiereCombustion["energie"],
		| typeof models.common.EnergieEnum.bois_buche
		| typeof models.common.EnergieEnum.bois_plaquette
		| typeof models.common.EnergieEnum.bois_granule
	>;
	bienergie_generateur: models.chauffage.generateur.ChaudiereCombustion["bienergie"];
	generateur_multi_batiment: boolean;
};

export type PoeleBouilleur = {
	type_generateur: models.chauffage.generateur.PoeleBouilleur["type"];
	energie_generateur: models.chauffage.generateur.PoeleBouilleur["energie"];
	bienergie_generateur: models.chauffage.generateur.PoeleBouilleur["bienergie"];
	generateur_multi_batiment: boolean;
};

export type PoeleInsert = {
	type_generateur: models.chauffage.generateur.PoeleInsert["type"];
	energie_generateur: models.chauffage.generateur.PoeleInsert["energie"];
	bienergie_generateur: models.chauffage.generateur.PoeleInsert["bienergie"];
	generateur_multi_batiment: boolean;
};

export type GenerateurAirChaud = {
	type_generateur: models.chauffage.generateur.GenerateurAirChaudCombustion["type"];
	energie_generateur: models.chauffage.generateur.GenerateurAirChaudCombustion["energie"];
	bienergie_generateur: models.chauffage.generateur.GenerateurAirChaudCombustion["bienergie"];
	generateur_multi_batiment: boolean;
};

export type RadiateurGaz = {
	type_generateur: models.chauffage.generateur.RadiateurGaz["type"];
	energie_generateur: models.chauffage.generateur.RadiateurGaz["energie"];
	bienergie_generateur: models.chauffage.generateur.RadiateurGaz["bienergie"];
	generateur_multi_batiment: boolean;
};

export type GenerateurElectrique = {
	type_generateur: models.chauffage.generateur.GenerateurElectrique["type"];
	energie_generateur: models.chauffage.generateur.GenerateurElectrique["energie"];
	bienergie_generateur: models.chauffage.generateur.GenerateurElectrique["bienergie"];
	generateur_multi_batiment: boolean;
};

export type ChaudiereElectrique = {
	type_generateur: models.chauffage.generateur.ChaudiereElectrique["type"];
	energie_generateur: models.chauffage.generateur.ChaudiereElectrique["energie"];
	bienergie_generateur: models.chauffage.generateur.ChaudiereElectrique["bienergie"];
	generateur_multi_batiment: boolean;
};

export type EmetteurElectrique = {
	type_generateur: models.chauffage.generateur.EmetteurElectrique["type"];
	energie_generateur: models.chauffage.generateur.EmetteurElectrique["energie"];
	bienergie_generateur: models.chauffage.generateur.EmetteurElectrique["bienergie"];
	generateur_multi_batiment: boolean;
};

export type GenerateurThermodynamique = {
	type_generateur: models.chauffage.generateur.GenerateurThermodynamique["type"];
	energie_generateur: models.chauffage.generateur.GenerateurThermodynamique["energie"];
	bienergie_generateur: models.chauffage.generateur.GenerateurThermodynamique["bienergie"];
	generateur_multi_batiment: boolean;
};

export type PAC = {
	type_generateur: models.chauffage.generateur.PAC["type"];
	energie_generateur: models.chauffage.generateur.PAC["energie"];
	bienergie_generateur: models.chauffage.generateur.PAC["bienergie"];
	generateur_multi_batiment: boolean;
};

export type PACHybride = {
	type_generateur: models.chauffage.generateur.PACHybride["type"];
	energie_generateur: models.chauffage.generateur.PACHybride["energie"];
	bienergie_generateur: models.chauffage.generateur.PACHybride["bienergie"];
	generateur_multi_batiment: boolean;
};

export type ReseauChaleur = {
	type_generateur: models.chauffage.generateur.ReseauChaleur["type"];
	energie_generateur: models.chauffage.generateur.ReseauChaleur["energie"];
	bienergie_generateur: models.chauffage.generateur.ReseauChaleur["bienergie"];
	generateur_multi_batiment: boolean;
};

export type GenerateurMultiBatiment = {
	type_generateur: models.chauffage.generateur.TypeGenerateur;
	energie_generateur: models.chauffage.generateur.EnergieChauffage;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
	generateur_multi_batiment: true;
};

export type Generateur = {
	type_generateur: models.chauffage.generateur.TypeGenerateur;
	energie_generateur: models.chauffage.generateur.EnergieChauffage;
	bienergie_generateur: models.chauffage.generateur.Bienergie | null;
	generateur_multi_batiment: boolean;
};

export function is_generateur_combustion(
	props: Generateur,
): props is GenerateurCombustion {
	return (
		!is_generateur_multi_batiment(props) &&
		models.common.ENERGIES_COMBUSTION.includes(props.energie_generateur)
	);
}

export function is_chaudiere_bois(props: Generateur): props is ChaudiereBois {
	return (
		is_chaudiere_combustion(props) &&
		models.common.ENERGIES_BOIS.includes(props.energie_generateur)
	);
}

export function is_chaudiere_combustion(
	props: Generateur,
): props is ChaudiereCombustion {
	return (
		is_generateur_combustion(props) &&
		props.type_generateur === TypeGenerateur.chaudiere &&
		!is_chaudiere_bois(props)
	);
}

export function is_poele_bouilleur(props: Generateur): props is PoeleBouilleur {
	return (
		is_generateur_combustion(props) &&
		props.type_generateur === TypeGenerateur.poele_bouilleur
	);
}

export function is_poele_insert(props: Generateur): props is PoeleInsert {
	const scope: models.chauffage.generateur.TypeGenerateur[] = [
		TypeGenerateur.cuisiniere,
		TypeGenerateur.insert,
		TypeGenerateur.foyer_ferme,
		TypeGenerateur.poele,
	];
	return (
		is_generateur_combustion(props) && scope.includes(props.type_generateur)
	);
}

export function is_generateur_air_chaud_combustion(
	props: Generateur,
): props is GenerateurAirChaud {
	return (
		is_generateur_combustion(props) &&
		props.type_generateur === TypeGenerateur.generateur_air_chaud
	);
}

export function is_radiateur_gaz(props: Generateur): props is RadiateurGaz {
	return (
		is_generateur_combustion(props) &&
		props.type_generateur === TypeGenerateur.radiateur_gaz
	);
}

export function is_generateur_electrique(
	props: Generateur,
): props is GenerateurElectrique {
	return (
		!is_generateur_multi_batiment(props) &&
		props.energie_generateur === models.common.EnergieEnum.electricite
	);
}

export function is_chaudiere_electrique(
	props: Generateur,
): props is ChaudiereElectrique {
	const scope: models.chauffage.generateur.TypeGenerateur[] = [
		TypeGenerateur.chaudiere,
		TypeGenerateur.generateur_air_chaud,
	];
	return (
		is_generateur_electrique(props) && scope.includes(props.type_generateur)
	);
}

export function is_emetteur_electrique(
	props: Generateur,
): props is EmetteurElectrique {
	return (
		is_generateur_electrique(props) &&
		props.type_generateur !== TypeGenerateur.chaudiere
	);
}

export function is_generateur_thermodynamique(
	props: Generateur,
): props is GenerateurThermodynamique {
	const scope: models.chauffage.generateur.TypeGenerateur[] = [
		TypeGenerateur.pac_air_air,
		TypeGenerateur.pac_air_eau,
		TypeGenerateur.pac_eau_eau,
		TypeGenerateur.pac_eau_glycolee_eau,
		TypeGenerateur.pac_geothermique,
	];

	return (
		!is_generateur_multi_batiment(props) &&
		scope.includes(props.type_generateur)
	);
}

export function is_pac(props: Generateur): props is PAC {
	return (
		is_generateur_thermodynamique(props) && props.bienergie_generateur === null
	);
}

export function is_pac_hybride(props: Generateur): props is PACHybride {
	return (
		is_generateur_thermodynamique(props) && props.bienergie_generateur !== null
	);
}

export function is_reseau_chaleur(props: Generateur): props is ReseauChaleur {
	return props.type_generateur === TypeGenerateur.reseau_chaleur;
}

export function is_generateur_multi_batiment(
	props: Generateur,
): props is GenerateurMultiBatiment {
	return !is_reseau_chaleur(props) && props.generateur_multi_batiment === true;
}
