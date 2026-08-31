import type * as models from "@open-dpe-logement/models";

export type User = {
	scenario: string | null;
	diagnostic: models.diagnostic.DiagnosticWithData | null;
	simulation: models.diagnostic.DiagnosticWithData | null;
	gestes: string[];
};
