import * as from from "@open-dpe-logement/ademe-models";

export type { Input } from "../types.js";

export type Climatisation =
	| from.dpe.v22.Climatisation
	| from.dpe.v23.Climatisation
	| from.dpe.v24.Climatisation
	| from.dpe.v25.Climatisation
	| from.dpe.v26.Climatisation
	| from.audit.Climatisation;
