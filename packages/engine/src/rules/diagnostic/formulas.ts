import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import type * as batiment from "../batiment/formulas.js";
import type * as climat from "../climat/formulas.js";
import type * as chauffage from "../chauffage/formulas.js";
import type * as eclairage from "../eclairage/formulas.js";
import type * as ecs from "../ecs/formulas.js";
import type * as enveloppe from "../enveloppe/formulas.js";
import type * as refroidissement from "../refroidissement/formulas.js";
import type * as ventilation from "../ventilation/formulas.js";
import { ValeurForfaitaireError } from "../errors.js";

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
 * @formule diagnostic.cef
 * @returns Consommation d'énergie finale en kWh/m².an
 */
export function calcule_cef(props: {
	consommations: ReturnType<typeof calcule_consommations>;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const consommations = models.common.reduceConsommations(props.consommations);
	return consommations.cef / props.sh;
}

/**
 * @formule diagnostic.cep
 * @returns Consommation d'énergie primaire en kWh/m².an
 */
export function calcule_cep(props: {
	consommations: ReturnType<typeof calcule_consommations>;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const consommations = models.common.reduceConsommations(props.consommations);
	return consommations.cep / props.sh;
}

/**
 * @formule diagnostic.eges
 * @returns Émissions de gaz à effet de serre en kgCO2/m².an
 */
export function calcule_eges(props: {
	consommations: ReturnType<typeof calcule_consommations>;
	sh: ReturnType<typeof batiment.calcule_sh>;
}): number {
	const consommations = models.common.reduceConsommations(props.consommations);
	return consommations.eges / props.sh;
}

/**
 * @formule diagnostic.etiquette_energie
 * @see abaques.diagnostic.etiquetteEnergie
 * @throws {ValeurForfaitaireError}
 * @returns Étiquette énergie du bâtiment
 */
export function calcule_etiquette_energie(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	altitude: number;
	cep: ReturnType<typeof calcule_cep>;
	eges: ReturnType<typeof calcule_eges>;
}): models.diagnostic.EtiquetteEnum {
	const query = {
		...props,
		cep: Math.floor(props.cep),
		eges: Math.floor(props.eges),
	};
	const abaque = abaques.diagnostic.etiquetteEnergie;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.etiquette_energie as models.diagnostic.EtiquetteEnum;
}

/**
 * @formule diagnostic.etiquette_climat
 * @see abaques.diagnostic.etiquetteClimat
 * @throws {ValeurForfaitaireError}
 * @returns Étiquette climatique du bâtiment
 */
export function calcule_etiquette_climat(props: {
	zone_climatique: ReturnType<typeof climat.calcule_zone_climatique>;
	altitude: number;
	eges: ReturnType<typeof calcule_eges>;
}): models.diagnostic.EtiquetteEnum {
	const query = {
		...props,
		eges: Math.floor(props.eges),
	};
	const abaque = abaques.diagnostic.etiquetteClimat;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(query);
	return match.etiquette_climat as models.diagnostic.EtiquetteEnum;
}

/**
 * @formule diagnostic.confort_ete
 * @todo Contrainte pour les immeubles collectifs
 * @returns Niveau de confort d'été du logement
 */
export function calcule_confort_ete(props: {
	type_diagnostic: models.diagnostic.TypeDiagnosticEnum;
	presence_protection_solaire: ReturnType<
		typeof enveloppe.calcule_presence_protection_solaire
	>;
	isolation_planchers_hauts: ReturnType<
		typeof enveloppe.calcule_isolation_planchers_hauts
	>;
	inertie: ReturnType<typeof enveloppe.calcule_inertie>;
	logement_traversant: ReturnType<typeof enveloppe.calcule_logement_traversant>;
	presence_brasseur_air: boolean;
}): models.diagnostic.ConfortEteEnum | null {
	if (
		false === props.presence_protection_solaire ||
		false === props.isolation_planchers_hauts
	)
		return models.diagnostic.CONFORTS_ETE.insuffisant;

	const inertie_lourde =
		props.inertie === models.enveloppe.common.INERTIES.tres_lourde ||
		props.inertie === models.enveloppe.common.INERTIES.lourde;

	const conditions = [
		inertie_lourde,
		props.logement_traversant,
		props.presence_brasseur_air,
	];

	return conditions.filter(Boolean).length >= 2
		? models.diagnostic.CONFORTS_ETE.bon
		: models.diagnostic.CONFORTS_ETE.moyen;
}
