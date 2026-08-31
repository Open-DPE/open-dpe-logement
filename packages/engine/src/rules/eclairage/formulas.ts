import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "../common/formulas.js";
import * as batiment from "../batiment/formulas.js";
import * as climat from "../climat/formulas.js";
import * as production from "../production/formulas.js";
import { ValeurForfaitaireError } from "../errors.js";

/**
 * @formule eclairage.cef
 * @formule eclairage.cep
 * @formule eclairage.eges
 * @returns Consommations par usage et par énergie de l'éclairage
 */
export function calcule_consommations(props: {
	cecl: ReturnType<typeof calcule_cecl>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
}): models.common.Consommations {
	return common.calcule_consommations({
		cef: props.cecl,
		cef_enr: props.celec_ac.eclairage,
		usage: models.common.Usage.enum.eclairage,
		energie: models.common.Energie.enum.electricite,
		reseau_id: null,
	});
}

/**
 * @formule eclairage.cecl
 * @returns Consommation d'éclairage en kWh/an
 */
export function calcule_cecl(props: {
	sh: ReturnType<typeof batiment.calcule_sh>;
	nhecl: ReturnType<typeof calcule_nhecl>;
}): number {
	const { sh, nhecl } = props;
	return (0.9 * 1.4 * nhecl * sh) / 1000;
}

/**
 * @formule eclairage.nhecl
 * @see abaques.eclairage.nhecl
 * @throws {ValeurForfaitaireError}
 * @returns Nombre d'heures d'éclairage en heures/an
 */
export function calcule_nhecl(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
}): number {
	const abaque = abaques.eclairage.nhecl;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.nhecl;
}
