import { dpe } from "@open-dpe-logement/ademe-models";
import { diagnostic } from "@open-dpe-logement/models";

export function fromDPE(data: dpe.DPE): diagnostic.Diagnostic {
	throw new Error("Function not implemented.");
}

export function toDPE(data: diagnostic.Diagnostic): dpe.DPE {
	throw new Error("Function not implemented.");
}
