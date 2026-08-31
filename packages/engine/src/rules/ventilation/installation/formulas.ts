import { abaques } from "@open-dpe-logement/engine-abaques";
import * as models from "@open-dpe-logement/models";
import * as common from "../../common/formulas.js";
import type * as production from "../../production/formulas.js";
import { ValeurForfaitaireError } from "../../errors.js";

/**
 * Surface habitable couverte par l'installation en m²
 */
type Sh = number;

/**
 * @formule ventilation.installation.cef
 * @formule ventilation.installation.cep
 * @formule ventilation.installation.eges
 * @returns Consommations par usage et par énergie de l'auxiliaire de ventilation
 */
export function calcule_consommations(props: {
	caux: ReturnType<typeof calcule_caux>;
	caux_enr: ReturnType<typeof calcule_caux_enr>;
}): models.common.Consommations {
	return common.calcule_consommations({
		cef: props.caux,
		cef_enr: props.caux_enr,
		usage: models.common.Usage.enum.auxiliaire,
		energie: models.common.Energie.enum.electricite,
		reseau_id: null,
	});
}

/**
 * @formule ventilation.installation.caux_enr
 * @returns Consommations d'électricité renouvelable de l'auxiliaire de ventilation en kWh/an
 */
export function calcule_caux_enr(props: {
	celec: ReturnType<typeof production.calcule_celec>;
	celec_ac: ReturnType<typeof production.calcule_celec_ac>;
	caux: ReturnType<typeof calcule_caux>;
}): number {
	return common.calcule_cener({
		celec: props.celec,
		celec_ac: props.celec_ac,
		usage: models.production.UsageElectricite.enum.auxiliaires_ventilation,
		cef: props.caux,
	});
}

/**
 * @formule ventilation.installation.caux
 * @returns Consommation de l'auxiliaire de ventilation en kWh/an
 */
export function calcule_caux(props: {
	rdim: ReturnType<typeof calcule_rdim>;
	pvent_moy: ReturnType<typeof calcule_pvent_moy>;
	rut: ReturnType<typeof calcule_rut>;
}): number {
	const { rdim, pvent_moy, rut } = props;
	return 8760 * (pvent_moy / 1000) * rut * rdim;
}

/**
 * @formule ventilation.installation.pvent_moy
 * @returns Puissance moyenne de l'auxiliaire de ventilation en W
 */
export function calcule_pvent_moy(props: {
	type_batiment: models.batiment.TypeBatiment;
	type_ventilation: ReturnType<typeof set_type_ventilation>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	surface_installation: Sh;
	qvarep_conv: ReturnType<typeof calcule_debits>["qvarep_conv"];
}): number {
	const { type_batiment, type_ventilation } = props;
	const ENUMS = models.ventilation.installation.TypeVentilation.enum;

	switch (type_ventilation) {
		// Ventilations naturelles
		case ENUMS.ventilation_ouverture_fenetres:
		case ENUMS.ventilation_entrees_air_hautes_basses:
		case ENUMS.ventilation_naturelle_conduit_entrees_air_hygroreglables:
		case ENUMS.ventilation_naturelle_conduit: {
			return 0;
		}
		// Ventilations mécaniques
		default: {
			switch (type_batiment) {
				case models.batiment.TypeBatiment.enum.maison:
					return calcule_pvent_moy_maison(props);
				case models.batiment.TypeBatiment.enum.immeuble:
					return calcule_pvent_moy_immeuble(props);
			}
		}
	}
}

/**
 * @see abaques.ventilation.pventMoy
 * @throws {ValeurForfaitaireError}
 * @returns Puissance moyenne de l'auxiliaire de ventilation pour une maison individuelle en W
 */
function calcule_pvent_moy_maison(props: {
	type_ventilation: ReturnType<typeof set_type_ventilation>;
	annee_installation: ReturnType<typeof set_annee_installation>;
}): number {
	const abaque = abaques.ventilation.pventMoy;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.pvent_moy;
}

/**
 * @see abaques.ventilation.pvent
 * @throws {ValeurForfaitaireError}
 * @returns Puissance moyenne de l'auxiliaire de ventilation pour un immeuble en W
 */
function calcule_pvent_moy_immeuble(props: {
	type_ventilation: ReturnType<typeof set_type_ventilation>;
	annee_installation: ReturnType<typeof set_annee_installation>;
	surface_installation: Sh;
	qvarep_conv: ReturnType<typeof calcule_debits>["qvarep_conv"];
}): number {
	const { surface_installation, qvarep_conv, ...query } = props;
	const abaque = abaques.ventilation.pvent;
	const match = abaque.search(query, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return match.pvent * qvarep_conv * surface_installation;
}

/**
 * @formule ventilation.installation.rut
 * @returns Ratio du temps d'utilisation du mode mécanique de l'auxiliaire de ventilation
 */
export function calcule_rut(props: {
	type_ventilation: ReturnType<typeof set_type_ventilation>;
	installation_collective: boolean | null;
}): number {
	const { type_ventilation, installation_collective } = props;
	const TypeVentilation = models.ventilation.installation.TypeVentilation;
	switch (type_ventilation) {
		// Ventilations naturelles
		case TypeVentilation.enum.ventilation_ouverture_fenetres:
		case TypeVentilation.enum.ventilation_entrees_air_hautes_basses:
		case TypeVentilation.enum
			.ventilation_naturelle_conduit_entrees_air_hygroreglables:
		case TypeVentilation.enum.ventilation_naturelle_conduit: {
			return 0;
		}
		// Ventilations hybrides
		case TypeVentilation.enum.ventilation_hybride:
		case TypeVentilation.enum.ventilation_hybride_entrees_air_hygroreglables: {
			return installation_collective ? 0.167 : 0.083;
		}
		// Ventilations mécaniques
		default: {
			return 1;
		}
	}
}

/**
 * @formule ventilation.installation.rdim
 * @param props.surface_installation : Surface de l'installation de ventilation en m²
 * @param props.surface_installations : Surface totale des installations de ventilation en m²
 * @returns Ratio de dimensionnement de l'installation de ventilation
 */
export function calcule_rdim(props: {
	surface_installation: number;
	surface_installations: number;
}): number {
	return props.surface_installations
		? props.surface_installation / props.surface_installations
		: 0;
}

export type Debits = {
	// Débit volumique conventionnel à reprendre en m3/(h.m²)
	qvarep_conv: number;
	// Débit volumique conventionnel à souffler en m3/(h.m²)
	qvasouf_conv: number;
	// Somme des modules d'entrée d'air sous 20 Pa en m3/(h.m²)
	smea_conv: number;
};

/**
 * @formule ventilation.installation.qvasouf_conv
 * @formule ventilation.installation.qvarep_conv
 * @formule ventilation.installation.smea_conv
 * @see abaques.ventilation.debits
 * @throws {ValeurForfaitaireError}
 * @returns Débits conventionnels de l'installation de ventilation
 */
export function calcule_debits(props: {
	type_ventilation: ReturnType<typeof set_type_ventilation>;
	presence_echangeur_thermique: ReturnType<
		typeof set_presence_echangeur_thermique
	>;
	installation_collective: boolean | null;
	annee_installation: ReturnType<typeof set_annee_installation>;
}): Debits {
	const abaque = abaques.ventilation.debits;
	const match = abaque.search(props, abaque.load()).at(0);
	if (!match) throw new ValeurForfaitaireError(props);
	return {
		smea_conv: match.smea_conv,
		qvarep_conv: match.qvarep_conv,
		qvasouf_conv: match.qvasouf_conv,
	};
}

/**
 * @formule ventilation.installation.hvent
 * @returns Déperditions thermiques par renouvellement d'air due au système de ventilation en W/K
 */
export function calcule_hvent(props: {
	rdim: ReturnType<typeof calcule_rdim>;
	qvarep_conv: ReturnType<typeof calcule_debits>["qvarep_conv"];
	sh: Sh;
}): number {
	const { rdim, qvarep_conv, sh } = props;
	return 0.34 * qvarep_conv * sh * rdim;
}

/**
 * @param props.type_ventilation : Type de ventilation saisi
 * @returns Type de ventilation retenu
 */
export function set_type_ventilation(props: {
	type_ventilation: models.ventilation.installation.TypeVentilation | null;
}): models.ventilation.installation.TypeVentilation {
	const { type_ventilation } = props;
	return (
		type_ventilation ??
		models.ventilation.installation.TypeVentilation.enum
			.ventilation_ouverture_fenetres
	);
}

/**
 * @param props.annee_installation : Année d'installation du système de ventilation saisie
 * @param props.annee_construction_batiment : Année de construction du bâtiment
 * @returns Année d'installation du système de ventilation retenue
 */
export function set_annee_installation(props: {
	annee_installation: number | null;
	annee_construction_batiment: number;
}): number {
	const { annee_installation, annee_construction_batiment } = props;
	return annee_installation ?? annee_construction_batiment;
}

/**
 * @param props.presence_echangeur_thermique : Présence d'un échangeur thermique saisie
 * @returns Présence d'un échangeur thermique retenue
 */
export function set_presence_echangeur_thermique(props: {
	presence_echangeur_thermique: boolean | null;
}): boolean {
	const { presence_echangeur_thermique } = props;
	return presence_echangeur_thermique ?? false;
}
