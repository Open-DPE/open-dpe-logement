import * as from from "@open-dpe-logement/ademe-models";

export type { Input } from "../types.js";

export type InstallationEcs =
	| from.dpe.v22.InstallationEcs
	| from.dpe.v23.InstallationEcs
	| from.dpe.v24.InstallationEcs
	| from.dpe.v25.InstallationEcs
	| from.dpe.v26.InstallationEcs
	| from.audit.InstallationEcs;

export type GenerateurEcs =
	| from.dpe.v22.GenerateurEcs
	| from.dpe.v23.GenerateurEcs
	| from.dpe.v24.GenerateurEcs
	| from.dpe.v25.GenerateurEcs
	| from.dpe.v26.GenerateurEcs
	| from.audit.GenerateurEcs;
