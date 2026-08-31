import * as z from "zod";
import { nombre, nombre_positif, non_applicable } from "../common/types.js";
import { Exposition } from "./enums.js";
import { Inertie } from "./common/enums.js";
import { Niveau, NiveauWithData } from "./niveau/types.js";
import {
	LocalNonChauffe,
	LocalNonChauffeWithData,
} from "./local-non-chauffe/types.js";
import { Mur, MurWithData } from "./mur/types.js";
import { PlancherBas, PlancherBasWithData } from "./plancher-bas/types.js";
import { PlancherHaut, PlancherHautWithData } from "./plancher-haut/types.js";
import { Baie, BaieWithData } from "./baie/types.js";
import { Porte, PorteWithData } from "./porte/types.js";
import {
	PontThermique,
	PontThermiqueWithData,
} from "./pont-thermique/types.js";

export const Enveloppe = z.object({
	exposition: Exposition,
	q4pa_conv: z.union([nombre_positif, non_applicable]),
	presence_brasseurs_air: z.boolean(),
	niveaux: z.array(Niveau).min(1),
	locaux_non_chauffes: z.array(LocalNonChauffe),
	murs: z.array(Mur),
	planchers_bas: z.array(PlancherBas),
	planchers_hauts: z.array(PlancherHaut),
	baies: z.array(Baie),
	portes: z.array(Porte),
	ponts_thermiques: z.array(PontThermique),
});

export const EnveloppeData = z.object({
	gv: nombre,
	ubat: nombre,
	dp: nombre,
	dp_murs: nombre,
	dp_planchers_bas: nombre,
	dp_planchers_hauts: nombre,
	dp_baies: nombre,
	dp_portes: nombre,
	pt: nombre,
	dr: nombre,
	sdep: nombre,
	sdep_murs: nombre,
	sdep_planchers_bas: nombre,
	sdep_planchers_hauts: nombre,
	sdep_baies: nombre,
	sdep_portes: nombre,
	inertie: Inertie,
	hperm: nombre,
	hvent: nombre,
	// NOTE écart schéma : `q4pa_conv` est une propriété de `enveloppe.yaml#/$defs/data`
	// mais est absente de son `required` (seule propriété de `data` dans ce cas).
	// Modélisé requis ici par cohérence avec la doctrine (toute propriété toujours
	// présente) et avec le reste du fichier `data`. À corriger côté schéma si volontaire.
	q4pa_conv: nombre,
	presence_joints: z.boolean(),
	isolation_planchers_hauts: z.boolean(),
	presence_protection_solaire: z.boolean(),
	logement_traversant: z.boolean(),
	sse: nombre,
});

export const EnveloppeWithData = z.intersection(
	Enveloppe,
	z.object({
		data: EnveloppeData,
		niveaux: z.array(NiveauWithData).min(1),
		locaux_non_chauffes: z.array(LocalNonChauffeWithData),
		murs: z.array(MurWithData),
		planchers_bas: z.array(PlancherBasWithData),
		planchers_hauts: z.array(PlancherHautWithData),
		baies: z.array(BaieWithData),
		portes: z.array(PorteWithData),
		ponts_thermiques: z.array(PontThermiqueWithData),
	}),
);

export type Enveloppe = z.infer<typeof Enveloppe>;
export type EnveloppeData = z.infer<typeof EnveloppeData>;
export type EnveloppeWithData = z.infer<typeof EnveloppeWithData>;
