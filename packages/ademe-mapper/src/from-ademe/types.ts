import { dpe, audit } from "@open-dpe-logement/ademe-models";

export type Input = DPEInput | AuditInput;

export type DPEInput = DPELogementExistant & {
	type: "dpe";
};

export type AuditInput = Audit & {
	type: "audit";
	logement: Audit["logement_collection"][number];
};

export type DPELogementExistant =
	| dpe.v22.DPELogementExistant
	| dpe.v23.DPELogementExistant
	| dpe.v24.DPELogementExistant
	| dpe.v25.DPELogementExistant
	| dpe.v26.DPELogementExistant;

export type Audit = audit.Audit;
