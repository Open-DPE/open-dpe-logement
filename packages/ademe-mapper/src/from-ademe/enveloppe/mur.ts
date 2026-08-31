import { enveloppe } from "@open-dpe-logement/models";
import { mapIsolation } from "./paroi/isolation.js";
import type { Input, Mur } from "./types.js";
import { mapPosition } from "./paroi/position.js";
import { resolveId } from "../common.js";

export type MurProps = {
	paroi: Mur;
	input: Input;
};

const MateriauMur = enveloppe.mur.MateriauMur;
const TypeDoublage = enveloppe.mur.TypeDoublage;
const Inertie = enveloppe.common.Inertie;

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
			return MateriauMur.enum.pierre_moellons;
		case "3":
			return MateriauMur.enum.pierre_moellons_avec_remplissage;
		case "4":
			return MateriauMur.enum.pise_ou_beton_terre;
		case "5":
			return MateriauMur.enum.pan_bois_sans_remplissage;
		case "6":
			return MateriauMur.enum.pan_bois_avec_remplissage;
		case "7":
			return MateriauMur.enum.bois_rondin;
		case "8":
			return MateriauMur.enum.brique_pleine_simple;
		case "9":
			return MateriauMur.enum.brique_pleine_double_avec_lame_air;
		case "10":
			return MateriauMur.enum.brique_creuse;
		case "11":
			return MateriauMur.enum.bloc_beton_plein;
		case "12":
			return MateriauMur.enum.bloc_beton_creux;
		case "13":
			return MateriauMur.enum.beton_banche;
		case "14":
			return MateriauMur.enum.beton_machefer;
		case "15":
			return MateriauMur.enum.brique_terre_cuite_alveolaire;
		case "16":
		case "17":
			return MateriauMur.enum.beton_cellulaire;
		case "18":
		case "24":
		case "26":
			return MateriauMur.enum.ossature_bois_avec_remplissage_isolant;
		case "19":
			return MateriauMur.enum
				.sandwich_beton_isolant_beton_sans_isolation_rapportee;
		case "20":
			return MateriauMur.enum.cloison_platre;
		case "25":
			return MateriauMur.enum.ossature_bois_sans_remplissage;
		case "27":
			return MateriauMur.enum.ossature_bois_avec_remplissage_tout_venant;
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
		? (props.donnee_entree.enduit_isolant_paroi_ancienne ?? null)
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
			return TypeDoublage.enum.sans_doublage;
		case "3":
			return TypeDoublage.enum.lame_air_inferieur_15mm;
		case "4":
			return TypeDoublage.enum.lame_air_superieur_15mm;
		case "5":
			return TypeDoublage.enum.materiaux_connu;
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
				return Inertie.enum.lourde;
			case false:
				return Inertie.enum.legere;
		}
	}
	return null;
}
