import { abaques } from "@open-dpe-logement/abaques";
import * as models from "@open-dpe-logement/models";
import * as batiment from "#rules/batiment/formulas.js";
import * as climat from "#rules/climat/formulas.js";
import * as chauffage from "#rules/chauffage/formulas.js";
import * as eclairage from "#rules/eclairage/formulas.js";
import * as ecs from "#rules/ecs/formulas.js";
import * as enveloppe from "#rules/enveloppe/formulas.js";
import * as refroidissement from "#rules/refroidissement/formulas.js";
import * as ventilation from "#rules/ventilation/formulas.js";
import { ValeurForfaitaireError } from "#utils/errors.js";

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

/**
 * @doctrine diagnostic.etiquette_energie
 * @see abaques.diagnostic.etiquetteEnergie
 * @throws {ValeurForfaitaireError}
 * @return Étiquette énergie du bâtiment
 */
export function calcule_etiquette_energie(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	altitude: number;
	cep: ReturnType<typeof calcule_cep>;
	eges: ReturnType<typeof calcule_eges>;
}): models.diagnostic.Etiquette {
	const abaque = abaques.diagnostic.etiquetteEnergie;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.etiquette_energie as models.diagnostic.Etiquette;
}

/**
 * @doctrine diagnostic.etiquette_climat
 * @see abaques.diagnostic.etiquetteClimat
 * @throws {ValeurForfaitaireError}
 * @return Étiquette climatique du bâtiment
 */
export function calcule_etiquette_climat(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	altitude: number;
	eges: ReturnType<typeof calcule_eges>;
}): models.diagnostic.Etiquette {
	const abaque = abaques.diagnostic.etiquetteClimat;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.etiquette_climat as models.diagnostic.Etiquette;
}

/**
 * @doctrine diagnostic.confort_ete
 * @return Niveau de confort d'été du logement
 */
export function calcule_confort_ete(props: {
	type_diagnostic: models.diagnostic.TypeDiagnostic;
	presence_protection_solaire: ReturnType<
		typeof enveloppe.calcule_presence_protection_solaire
	>;
	isolation_planchers_hauts: ReturnType<
		typeof enveloppe.calcule_isolation_planchers_hauts
	>;
	inertie: ReturnType<typeof enveloppe.calcule_inertie>;
	logement_traversant: ReturnType<typeof enveloppe.calcule_logement_traversant>;
	presence_brasseur_air: boolean;
}): models.diagnostic.ConfortEte | null {
	if (props.type_diagnostic === models.diagnostic.TypeDiagnosticEnum.batiment) {
		return null;
	}
	if (
		false === props.presence_protection_solaire ||
		false === props.isolation_planchers_hauts
	)
		return 1;

	const inertie_lourde =
		props.inertie === models.enveloppe.common.InertieEnum.tres_lourde ||
		props.inertie === models.enveloppe.common.InertieEnum.lourde;

	const conditions = [
		inertie_lourde,
		props.logement_traversant,
		props.presence_brasseur_air,
	];

	return conditions.filter(Boolean).length >= 2 ? 2 : 3;
}
