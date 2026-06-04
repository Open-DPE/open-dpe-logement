import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as climat from "#rules/climat/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as generateur from "#rules/chauffage/generateur/formulas.js";
import * as systeme from "#rules/chauffage/systeme/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";
import { createParMois } from "#utils/helpers.js";

/**
 * @doctrine chauffage.installation.caux_dist
 * @return Consommations des auxiliaires de distribution en kWh/an
 */
export function calcule_caux_dist(props: {
	caux_dist: ReturnType<typeof systeme.calcule_caux_dist>[];
}): number {
	return props.caux_dist.reduce((acc, val) => acc + val, 0);
}

/**
 * @doctrine chauffage.installation.bch
 * @returns Besoins de chauffage proratisés à l'installation en kWh/mois
 */
export function calcule_bch(props: {
	bch: ReturnType<typeof chauffage.calcule_bch>;
	rdim: ReturnType<typeof calcule_rdim>;
}): models.common.ParMois<number> {
	const { rdim } = props;
	return createParMois((mois) => props.bch[mois] * rdim);
}

/**
 * @doctrine chauffage.installation.rdim
 * @param props.surface_installation - Surface de l'installation de chauffage en m²
 * @param props.surface_installations - Surface totale des installations de chauffage en m²
 * @returns Ratio de dimensionnement de l'installation de chauffage
 */
export function calcule_rdim(props: {
	surface_installation: number;
	surface_installations: number;
}): number {
	const { surface_installation, surface_installations } = props;
	return surface_installation / surface_installations;
}

/**
 * @doctrine chauffage.installation.pch
 * @returns Puissance de chauffage de l'installation de chauffage en kW
 */
export function calcule_pch(props: {
	pch: ReturnType<typeof chauffage.calcule_pch>;
	rdim: ReturnType<typeof calcule_rdim>;
}): number {
	const { pch, rdim } = props;
	return pch * rdim;
}

/**
 * @doctrine chauffage.installation.fch
 * @param props.fch_saisi - Facteur de couverture solaire saisi
 * @returns Facteur de couverture solaire de l'installation de chauffage
 */
export function calcule_fch(props: {
	fch_saisi: number | null;
	usage: models.chauffage.installation.UsageSolaire | null;
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	type_batiment: models.batiment.TypeBatiment;
}): number {
	const { fch_saisi, usage, ...query } = props;
	if (null === usage) return 0;
	if (fch_saisi) return fch_saisi;
	const abaque = abaques.chauffage.fch;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.fch;
}

/**
 * @see https://github.com/dpe-audit/dpe-logement/issues/46
 * @return Installation chauffée par effet de joule
 */
export function calcule_effet_joule(props: {
	type_installation: models.chauffage.installation.TypeInstallation;
	systemes: {
		type_systeme: models.chauffage.systeme.TypeSysteme;
		energie_generateur: ReturnType<typeof generateur.set_energie_generateur>;
	}[];
}): boolean {
	switch (props.type_installation) {
		case models.chauffage.installation.TypeInstallationEnum.central:
			return props.systemes.some(({ type_systeme, energie_generateur }) => {
				return (
					type_systeme === models.chauffage.systeme.TypeSystemeEnum.central &&
					energie_generateur === models.common.EnergieEnum.electricite
				);
			});
		case models.chauffage.installation.TypeInstallationEnum.divise:
			return (
				props.systemes.filter(
					({ energie_generateur }) =>
						energie_generateur === models.common.EnergieEnum.electricite,
				).length >
				props.systemes.length / 2
			);
	}
}
