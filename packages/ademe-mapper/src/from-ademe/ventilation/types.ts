import * as from from "@open-dpe-logement/ademe-models";

export type { Input } from "../types.js";

export type Ventilation =
	| from.dpe.v22.Ventilation
	| from.dpe.v23.Ventilation
	| from.dpe.v24.Ventilation
	| from.dpe.v25.Ventilation
	| from.dpe.v26.Ventilation
	| from.audit.Ventilation;
