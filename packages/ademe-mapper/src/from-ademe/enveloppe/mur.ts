import { enveloppe } from "@open-dpe-logement/models";
import { mapIsolation } from "./paroi/isolation.js";
import type { Input, Mur } from "./types.js";
import { mapPosition } from "./paroi/position.js";
import { resolveId } from "../common.js";

export type MurProps = {
	paroi: Mur;
	input: Input;
};

const MateriauMurEnum = enveloppe.mur.MATERIAUX_MUR;
const TypeDoublageEnum = enveloppe.mur.TYPES_DOUBLAGE;
const InertieEnum = enveloppe.common.INERTIES;

export function mapMur(props: MurProps): enveloppe.mur.Mur {
	return {
		id: mapId(props.paroi),
		description: mapDescription(props.paroi),
		structures: mapStructures(props.paroi),
		type_doublage: mapTypeDoublage(props.paroi),
		presence_enduit_isolant: mapPresenceEnduitIsolant(props.paroi),
		u: mapU(props.paroi),
		u0: mapU0(props.paroi),
		inertie: inertie(props.paroi),
		annee_construction: null,
		annee_renovation: null,
		position: mapPosition(props),
		isolation: mapIsolation(props),
	};
}

export function mapStructures(
	props: MurProps["paroi"],
): enveloppe.mur.Structure[] {
	return [
		{
			materiau: mapMateriau(props),
			epaisseur: mapEpaisseur(props),
			materiau_ancien: mapMateriauAncien(props),
		},
	];
}

export function mapId(props: MurProps["paroi"]): enveloppe.mur.Mur["id"] {
	return resolveId(props.donnee_entree.reference);
}

export function mapDescription(
	props: MurProps["paroi"],
): enveloppe.mur.Mur["description"] {
	return props.donnee_entree.description ?? "Non renseigné";
}

export function mapMateriau(
	props: MurProps["paroi"],
): enveloppe.mur.Structure["materiau"] {
	switch (props.donnee_entree.enum_materiaux_structure_mur_id) {
		case "2":
			return MateriauMurEnum.pierre_moellons;
		case "3":
			return MateriauMurEnum.pierre_moellons_avec_remplissage;
		case "4":
			return MateriauMurEnum.pise_ou_beton_terre;
		case "5":
			return MateriauMurEnum.pan_bois_sans_remplissage;
		case "6":
			return MateriauMurEnum.pan_bois_avec_remplissage;
		case "7":
			return MateriauMurEnum.bois_rondin;
		case "8":
			return MateriauMurEnum.brique_pleine_simple;
		case "9":
			return MateriauMurEnum.brique_pleine_double_avec_lame_air;
		case "10":
			return MateriauMurEnum.brique_creuse;
		case "11":
			return MateriauMurEnum.bloc_beton_plein;
		case "12":
			return MateriauMurEnum.bloc_beton_creux;
		case "13":
			return MateriauMurEnum.beton_banche;
		case "14":
			return MateriauMurEnum.beton_machefer;
		case "15":
			return MateriauMurEnum.brique_terre_cuite_alveolaire;
		case "16":
		case "17":
			return MateriauMurEnum.beton_cellulaire;
		case "18":
		case "24":
		case "26":
			return MateriauMurEnum.ossature_bois_avec_remplissage_isolant;
		case "19":
			return MateriauMurEnum.sandwich_beton_isolant_beton_sans_isolation_rapportee;
		case "20":
			return MateriauMurEnum.cloison_platre;
		case "25":
			return MateriauMurEnum.ossature_bois_sans_remplissage;
		case "27":
			return MateriauMurEnum.ossature_bois_avec_remplissage_tout_venant;
		default:
			return null;
	}
}

export function mapEpaisseur(
	props: MurProps["paroi"],
): enveloppe.mur.Structure["epaisseur"] {
	return props.donnee_entree.epaisseur_structure || null;
}

export function mapMateriauAncien(
	props: MurProps["paroi"],
): enveloppe.mur.Structure["materiau_ancien"] {
	return mapPresenceEnduitIsolant(props);
}

export function mapPresenceEnduitIsolant(
	props: MurProps["paroi"],
): enveloppe.mur.Mur["presence_enduit_isolant"] {
	return "enduit_isolant_paroi_ancienne" in props.donnee_entree
		? props.donnee_entree.enduit_isolant_paroi_ancienne ?? null
		: null;
}

export function mapU(props: MurProps["paroi"]): enveloppe.mur.Mur["u"] {
	return props.donnee_entree.umur_saisi || null;
}

export function mapU0(props: MurProps["paroi"]): enveloppe.mur.Mur["u0"] {
	return props.donnee_entree.umur0_saisi || null;
}

export function mapTypeDoublage(
	props: MurProps["paroi"],
): enveloppe.mur.Mur["type_doublage"] {
	switch (props.donnee_entree.enum_type_doublage_id) {
		case "2":
			return TypeDoublageEnum.sans_doublage;
		case "3":
			return TypeDoublageEnum.lame_air_inferieur_15mm;
		case "4":
			return TypeDoublageEnum.lame_air_superieur_15mm;
		case "5":
			return TypeDoublageEnum.materiaux_connu;
		default:
			return null;
	}
}

export function inertie(
	props: MurProps["paroi"],
): enveloppe.mur.Mur["inertie"] {
	if ("paroi_lourde" in props.donnee_entree) {
		switch (props.donnee_entree.paroi_lourde) {
			case true:
				return InertieEnum.lourde;
			case false:
				return InertieEnum.legere;
		}
	}
	return null;
}
