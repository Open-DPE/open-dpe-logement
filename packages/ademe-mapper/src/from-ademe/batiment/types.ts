import * as from from "@open-dpe-logement/ademe-models";

import type { Input } from "../types.js";

export type { Input };

export type Adresse = from.dpe.Adresse;

export type InputWithDPEImmeuble = Input & {
	dpe_immeuble: DPEImmeuble;
};

export type DPEImmeuble =
	| from.dpe.v23.DPEImmeuble
	| from.dpe.v24.DPEImmeuble
	| from.dpe.v25.DPEImmeuble
	| from.dpe.v26.DPEImmeuble;

export type LogementVisite =
	| from.dpe.v23.LogementVisite
	| from.dpe.v24.LogementVisite
	| from.dpe.v25.LogementVisite
	| from.dpe.v26.LogementVisite;

export function isDPEImmeuble(props: Input): props is InputWithDPEImmeuble {
	return (
		props.dpe_immeuble !== undefined &&
		props.dpe_immeuble !== null &&
		!from.dpe.isDPEv23(props)
	);
}
