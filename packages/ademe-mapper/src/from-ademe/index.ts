import * as from from "@open-dpe-logement/ademe-models";
import * as to from "@open-dpe-logement/models";
import { resetIdRegistry } from "./common.js";
import { mapDiagnostic } from "./diagnostic/diagnostic.js";
import { SupportError } from "./errors.js";

export function mapFromDPE(
	dpe: from.dpe.DPELogementExistant,
): to.diagnostic.Diagnostic {
	resetIdRegistry();

	if (from.dpe.isDPELogementExistantv2(dpe))
		throw new SupportError(
			`Version DPE ${dpe.administratif.enum_version_id} non supportée`,
		);

	return mapDiagnostic({ type: "dpe", ...dpe });
}

export function mapFromAudit(
	audit: from.audit.Audit,
	scenario: from.audit.enums.ScenarioEnum,
): to.diagnostic.Diagnostic {
	resetIdRegistry();

	const logement = audit.logement_collection.find(
		(logement) =>
			logement.caracteristique_generale.enum_scenario_id === scenario,
	);
	if (!logement) throw new SupportError(`Scénario ${scenario} introuvable`);

	return mapDiagnostic({ type: "audit", logement, ...audit });
}
