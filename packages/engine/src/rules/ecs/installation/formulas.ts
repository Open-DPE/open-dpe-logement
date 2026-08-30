import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import type * as climat from "../../climat/formulas.js";
import type * as ecs from "../formulas.js";
import type * as systeme from "../systeme/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";

/**
 * @returns Besoins d'eau chaude sanitaire proratisés à l'installation en kWh/mois
 */
export function calcule_becs(props: {
	becs: ReturnType<typeof ecs.calcule_becs>;
	rdim: ReturnType<typeof calcule_rdim>;
}): models.common.ParMois<number> {
	const { rdim } = props;
	return models.common.createParMois((mois) => props.becs[mois] * rdim);
}

/**
 * @returns Consommations des auxiliaires de distribution de l'installation d'eau chaude sanitaire en kWh/an
 */
export function calcule_caux_dist(props: {
	caux_dist: ReturnType<typeof systeme.calcule_caux_dist>[];
}): number {
	return props.caux_dist.reduce((acc, val) => acc + val, 0);
}

/**
 * @param props.surface_installation - Surface de l'installation d'eau chaude sanitaire en m²
 * @param props.surface_installations - Surface totale des installations d'eau chaude sanitaire en m²
 * @returns Ratio de dimensionnement de l'installation d'eau chaude sanitaire
 */
export function calcule_rdim(props: {
	surface_installation: number;
	surface_installations: number;
}): number {
	const { surface_installation, surface_installations } = props;
	return surface_installations > 0
		? surface_installation / surface_installations
		: 0;
}

/**
 * @param props.fch_saisi - Facteur de couverture solaire saisi
 * @param props.type_models.batiment - Type de bâtiment
 * @param props.usage_solaire - Usage du solaire thermique
 * @param props.anciennete_installation - Ancienneté de l'installation solaire en année
 * @returns Facteur de couverture solaire de l'installation d'eau chaude sanitaire
 */
export function calcule_fecs(props: {
	fecs_saisi: number | null;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	type_batiment: models.batiment.TypeBatimentEnum;
	installation_solaire: {
		usage: models.ecs.installation.UsageSolaireEnum;
		anciennete: ReturnType<typeof set_anciennete_installation_solaire>;
	} | null;
}): number {
	const { fecs_saisi } = props;
	if (fecs_saisi) return fecs_saisi;
	if (null === props.installation_solaire) return 0;
	const abaque = abaques.ecs.fecs;
	const query = {
		zone_climatique: props.zone_climatique,
		type_batiment: props.type_batiment,
		usage_solaire: props.installation_solaire.usage,
		anciennete_installation: props.installation_solaire.anciennete,
	};
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.fecs;
}

/**
 * @returns Pertes de distribution d'eau chaude sanitaire en Wh/an
 */
export function calcule_qdw(props: {
	qdw_ind_vc: ReturnType<typeof calcule_qdw_ind_vc>;
	qdw_col_vc: ReturnType<typeof calcule_qdw_col_vc>;
	qdw_col_hvc: ReturnType<typeof calcule_qdw_col_hvc>;
}): number {
	const { qdw_ind_vc, qdw_col_vc, qdw_col_hvc } = props;
	return qdw_ind_vc + qdw_col_vc + qdw_col_hvc;
}

/**
 * @param props.sh : Surface de l'installation d'eau chaude sanitaire en m²
 * @param props.ns : Nombre de systèmes d'eau chaude sanitaire associés à l'installation
 * @returns Pertes de distribution individuelle en volume chauffé de l'installation d'eau chaude sanitaire en Wh/an
 */
export function calcule_qdw_ind_vc(props: {
	becs: ReturnType<typeof ecs.calcule_becs>;
	sh: number;
	ns: number;
}): number {
	const { sh, ns } = props;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	const rat = 1 / ns;
	const lvc = 0.2 * sh * rat;
	return ((0.5 * lvc) / sh) * becs;
}

/**
 * @returns Pertes de distribution collective en volume chauffé en Wh/an
 */
export function calcule_qdw_col_vc(props: {
	becs: ReturnType<typeof ecs.calcule_becs>;
	reseau_collectif: boolean;
}): number {
	const { reseau_collectif } = props;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	return reseau_collectif ? becs * 0.112 : 0;
}

/**
 * @returns Pertes de distribution collective hors du volume chauffé en Wh/an
 */
export function calcule_qdw_col_hvc(props: {
	becs: ReturnType<typeof ecs.calcule_becs>;
	reseau_collectif: boolean;
}): number {
	const { reseau_collectif } = props;
	const becs = models.common.reduceParMois(props.becs) * 1000;
	return reseau_collectif ? becs * 0.028 : 0;
}

export function set_anciennete_installation_solaire(props: {
	annee_reference: number;
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	return (
		props.annee_reference -
		(props.annee_installation ?? props.annee_construction_batiment)
	);
}
