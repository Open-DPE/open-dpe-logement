import * as models from "@open-dpe-logement/models";

export type GenerateurThermodynamique = {
	type_generateur: models.ecs.generateur.GenerateurThermodynamique["type"];
};

export type GenerateurCombustion = {
	type_generateur: models.ecs.generateur.GenerateurCombustion["type"];
	energie_generateur: models.ecs.generateur.GenerateurCombustion["energie"];
};

export type PACHybride = {
	type_generateur: models.ecs.generateur.PacHybride["type"];
	energie_generateur: models.ecs.generateur.PacHybride["energie"];
	bienergie_generateur: models.ecs.generateur.Bienergie;
};

export function is_generateur_thermodynamique(props: {
	type_generateur: models.ecs.generateur.TypeGenerateur;
}): props is GenerateurThermodynamique {
	switch (props.type_generateur) {
		case models.ecs.generateur.TypeGenerateurEnum.cet_air_ambiant:
		case models.ecs.generateur.TypeGenerateurEnum.cet_air_exterieur:
		case models.ecs.generateur.TypeGenerateurEnum.cet_air_extrait:
		case models.ecs.generateur.TypeGenerateurEnum.pac_double_service:
			return true;
		default:
			return false;
	}
}

export function is_generateur_combustion(props: {
	type_generateur: models.ecs.generateur.TypeGenerateur;
	energie_generateur: models.ecs.generateur.EnergieEcs;
}): props is GenerateurCombustion {
	return models.common.ENERGIES_COMBUSTION.includes(props.energie_generateur);
}

export function is_pac_hybride(props: {
	type_generateur: models.ecs.generateur.TypeGenerateur;
	energie_generateur: models.ecs.generateur.EnergieEcs;
	bienergie_generateur: models.ecs.generateur.Bienergie | null;
}): props is PACHybride {
	return null !== props.bienergie_generateur;
}
