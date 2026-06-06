import type { Results as BaieResults } from "./baie/registry.js";
import type { Results as LocalNonChauffeResults } from "./local-non-chauffe/registry.js";
import type { Results as MurResults } from "./mur/registry.js";
import type { Results as NiveauResults } from "./niveau/registry.js";
import type { Results as PlancherBasResults } from "./plancher-bas/registry.js";
import type { Results as PlancherHautResults } from "./plancher-haut/registry.js";
import type { Results as PontThermiqueResults } from "./pont-thermique/registry.js";
import type { Results as PorteResults } from "./porte/registry.js";

import * as rules from "./rules.js";

export const ID = "enveloppe";

export const RULES = {
	gv: "gv",
	ubat: "ubat",
	dp: "dp",
	dp_murs: "dp_murs",
	dp_planchers_bas: "dp_planchers_bas",
	dp_planchers_hauts: "dp_planchers_hauts",
	dp_baies: "dp_baies",
	dp_portes: "dp_portes",
	pt: "pt",
	dr: "dr",
	sdep: "sdep",
	sdep_murs: "sdep_murs",
	sdep_planchers_bas: "sdep_planchers_bas",
	sdep_planchers_hauts: "sdep_planchers_hauts",
	sdep_baies: "sdep_baies",
	sdep_portes: "sdep_portes",
	inertie: "inertie",
	hperm: "hperm",
	qvinf: "qvinf",
	n50: "n50",
	q4pa: "q4pa",
	q4paenv: "q4paenv",
	q4paconv: "q4paconv",
	isolation_murs_plafonds: "isolation_murs_plafonds",
	presence_joints: "presence_joints",
	isolation_planchers_hauts: "isolation_planchers_hauts",
	presence_protection_solaire: "presence_protection_solaire",
	logement_traversant: "logement_traversant",
	parois_anciennes: "parois_anciennes",
	sse: "sse",
} as const;

export type Results = {
	[ID]: {
		[RULES.gv]: ReturnType<typeof rules.gv>;
		[RULES.ubat]: ReturnType<typeof rules.ubat>;
		[RULES.dp]: ReturnType<typeof rules.dp>;
		[RULES.dp_murs]: ReturnType<typeof rules.dp_murs>;
		[RULES.dp_planchers_bas]: ReturnType<typeof rules.dp_planchers_bas>;
		[RULES.dp_planchers_hauts]: ReturnType<typeof rules.dp_planchers_hauts>;
		[RULES.dp_baies]: ReturnType<typeof rules.dp_baies>;
		[RULES.dp_portes]: ReturnType<typeof rules.dp_portes>;
		[RULES.pt]: ReturnType<typeof rules.pt>;
		[RULES.dr]: ReturnType<typeof rules.dr>;
		[RULES.sdep]: ReturnType<typeof rules.sdep>;
		[RULES.sdep_murs]: ReturnType<typeof rules.sdep_murs>;
		[RULES.sdep_planchers_bas]: ReturnType<typeof rules.sdep_planchers_bas>;
		[RULES.sdep_planchers_hauts]: ReturnType<typeof rules.sdep_planchers_hauts>;
		[RULES.sdep_baies]: ReturnType<typeof rules.sdep_baies>;
		[RULES.sdep_portes]: ReturnType<typeof rules.sdep_portes>;
		[RULES.inertie]: ReturnType<typeof rules.inertie>;
		[RULES.hperm]: ReturnType<typeof rules.hperm>;
		[RULES.qvinf]: ReturnType<typeof rules.qvinf>;
		[RULES.n50]: ReturnType<typeof rules.n50>;
		[RULES.q4pa]: ReturnType<typeof rules.q4pa>;
		[RULES.q4paenv]: ReturnType<typeof rules.q4paenv>;
		[RULES.q4paconv]: ReturnType<typeof rules.q4paconv>;
		[RULES.isolation_murs_plafonds]: ReturnType<
			typeof rules.isolation_murs_plafonds
		>;
		[RULES.presence_joints]: ReturnType<typeof rules.presence_joints>;
		[RULES.parois_anciennes]: ReturnType<typeof rules.parois_anciennes>;
		[RULES.isolation_planchers_hauts]: ReturnType<
			typeof rules.isolation_planchers_hauts
		>;
		[RULES.presence_protection_solaire]: ReturnType<
			typeof rules.presence_protection_solaire
		>;
		[RULES.logement_traversant]: ReturnType<typeof rules.logement_traversant>;
		[RULES.sse]: ReturnType<typeof rules.sse>;
	};
} & BaieResults &
	LocalNonChauffeResults &
	MurResults &
	NiveauResults &
	PlancherBasResults &
	PlancherHautResults &
	PontThermiqueResults &
	PorteResults;
