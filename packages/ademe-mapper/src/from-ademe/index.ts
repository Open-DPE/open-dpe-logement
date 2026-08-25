import * as from from "@open-dpe-logement/ademe-models";
import * as to from "@open-dpe-logement/models";
import type { Input } from "./types.js";

export function fromAdeme(props: from.dpe.DPE): to.diagnostic.Diagnostic {
	throw new Error("Not implemented");
}

/**
 * 86% des DPE couverts
 */
export function supports(props: from.dpe.DPE): props is Input {
	return (
		from.dpe.isDPELogement(props) &&
		(from.dpe.isDPEv22(props) ||
			from.dpe.isDPEv23(props) ||
			from.dpe.isDPEv24(props) ||
			from.dpe.isDPEv25(props) ||
			from.dpe.isDPEv26(props))
	);
}
