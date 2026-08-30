import * as from from "@open-dpe-logement/ademe-models";

export type { Input } from "../types.js";

export type InstallationChauffage =
	| from.dpe.v22.InstallationChauffage
	| from.dpe.v23.InstallationChauffage
	| from.dpe.v24.InstallationChauffage
	| from.dpe.v25.InstallationChauffage
	| from.dpe.v26.InstallationChauffage
	| from.audit.InstallationChauffage;

export type EmetteurChauffage =
	| from.dpe.v22.EmetteurChauffage
	| from.dpe.v23.EmetteurChauffage
	| from.dpe.v24.EmetteurChauffage
	| from.dpe.v25.EmetteurChauffage
	| from.dpe.v26.EmetteurChauffage
	| from.audit.EmetteurChauffage;

export type GenerateurChauffage =
	| from.dpe.v22.GenerateurChauffage
	| from.dpe.v23.GenerateurChauffage
	| from.dpe.v24.GenerateurChauffage
	| from.dpe.v25.GenerateurChauffage
	| from.dpe.v26.GenerateurChauffage
	| from.audit.GenerateurChauffage;
