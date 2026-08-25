import { dpe } from "@open-dpe-logement/ademe-models";

export type Input =
	| dpe.v22.DPELogement
	| dpe.v23.DPELogement
	| dpe.v24.DPELogement
	| dpe.v25.DPELogement
	| dpe.v26.DPELogement;
