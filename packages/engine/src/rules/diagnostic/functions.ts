import * as RefroidissementRule from "#rules/refroidissement/formulas.js";
import * as VentilationRule from "#rules/ventilation/formulas.js";

/**
 * @returns Consommations d'énergie finale en kWh/an
 */
export function caux(props: {
	caux_ch: number;
	caux_ecs: number;
	caux_fr: number;
	caux_vent: ReturnType<typeof VentilationRule.calcule_caux>;
}): number {
	return Object.values(props).reduce((acc, val) => acc + val, 0);
}

/**
 * @returns Consommations d'énergie finale en kWh/an
 */
export function cef(props: {
	cef_ecl: number;
	cef_ch: number;
	cef_ecs: number;
	cef_fr: ReturnType<typeof RefroidissementRule.calcule_cfr_elec>;
	cef_aux_ch: number;
	cef_aux_ecs: number;
	cef_aux_fr: number;
	cef_aux_vent: ReturnType<typeof VentilationRule.calcule_caux>;
}): number {
	return Object.values(props).reduce((acc, val) => acc + val, 0);
}
