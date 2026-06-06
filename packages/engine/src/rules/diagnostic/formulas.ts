import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as eclairage from "#rules/eclairage/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as refroidissement from "#rules/refroidissement/formulas.js";
import * as ventilation from "#rules/ventilation/formulas.js";

/**
 * Consommations par usage et par énergie
 */
export function calcule_consommations(props: {
	chauffage: ReturnType<typeof chauffage.calcule_consommations>;
	eclairage: ReturnType<typeof eclairage.calcule_consommations>;
	ecs: ReturnType<typeof ecs.calcule_consommations>;
	refroidissement: ReturnType<typeof refroidissement.calcule_consommations>;
	ventilation: ReturnType<typeof ventilation.calcule_consommations>;
}): models.common.Consommations {
	return models.common.mergeConsommations(
		props.chauffage,
		props.eclairage,
		props.ecs,
		props.refroidissement,
		props.ventilation,
	);
}

/**
 * @doctrine diagnostic.cef
 * @return Consommation d'énergie finale en kWh/m².an
 */
export function calcule_cef(props: {
	consommations: ReturnType<typeof calcule_consommations>;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const consommations = models.common.reduceConsommations(props.consommations);
	return consommations.cef / props.sh;
}

/**
 * @doctrine diagnostic.cep
 * @return Consommation d'énergie primaire en kWh/m².an
 */
export function calcule_cep(props: {
	consommations: ReturnType<typeof calcule_consommations>;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const consommations = models.common.reduceConsommations(props.consommations);
	return consommations.cep / props.sh;
}

/**
 * @doctrine diagnostic.eges
 * @return Émissions de gaz à effet de serre en kgCO2/m².an
 */
export function calcule_eges(props: {
	consommations: ReturnType<typeof calcule_consommations>;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const consommations = models.common.reduceConsommations(props.consommations);
	return consommations.eges / props.sh;
}
