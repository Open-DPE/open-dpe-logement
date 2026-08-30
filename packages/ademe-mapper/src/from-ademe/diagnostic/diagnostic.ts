import { diagnostic } from "@open-dpe-logement/models";
import type { Input } from "../types.js";
import * as batiment from "../batiment/batiment.js";
import * as chauffage from "../chauffage/chauffage.js";
import * as ecs from "../ecs/ecs.js";
import * as enveloppe from "../enveloppe/enveloppe.js";
import * as production from "../production/production.js";
import * as refroidissement from "../refroidissement/refroidissement.js";
import * as ventilation from "../ventilation/ventilation.js";

type Props = Input;

export function mapDiagnostic(props: Props): diagnostic.Diagnostic {
	return {
		date_visite: mapDateVisite(props),
		date_etablissement: mapDateEtablissement(props),
		type: mapType(props),
		batiment: batiment.mapBatiment(props),
		chauffage: chauffage.mapChauffage(props),
		ecs: ecs.mapEcs(props),
		enveloppe: enveloppe.mapEnveloppe(props),
		production: production.mapProduction(props),
		refroidissement: refroidissement.mapRefroidissement(props),
		ventilation: ventilation.mapVentilation(props),
	};
}

export function mapDateVisite(props: Props): string {
	switch (props.type) {
		case "dpe":
			return props.administratif.date_visite_diagnostiqueur;
		case "audit":
			return props.administratif.date_visite_auditeur;
	}
}

export function mapDateEtablissement(props: Props): string {
	switch (props.type) {
		case "dpe":
			return props.administratif.date_etablissement_dpe;
		case "audit":
			return props.administratif.date_etablissement_audit;
	}
}

export function mapType(props: Props): diagnostic.TypeDiagnosticEnum {
	switch (
		props.logement.caracteristique_generale.enum_methode_application_dpe_log_id
	) {
		case "1":
		case "6":
		case "7":
		case "8":
		case "9":
		case "14":
		case "17":
		case "18":
		case "21":
		case "26":
		case "27":
		case "28":
		case "29":
		case "30":
			return diagnostic.TYPES_DIAGNOSTIC.batiment;
		default:
			return diagnostic.TYPES_DIAGNOSTIC.logement;
	}
}
