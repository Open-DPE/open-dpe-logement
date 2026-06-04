import { abaques } from "@open-dpe-logement/abaques";
import * as batiment from "#rules/batiment/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";

/**
 * @doctrine eclairage.cecl
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
 * @doctrine eclairage.nhecl
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
