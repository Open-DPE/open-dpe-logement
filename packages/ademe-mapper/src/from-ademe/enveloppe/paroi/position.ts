import { enveloppe } from "@open-dpe-logement/models";
import type { Input, Paroi, ParoiVitree } from "../types.js";
import { findReference, resolveId } from "../../common.js";
import { MappingError } from "../../errors.js";

const MITOYENNETES = enveloppe.common.MITOYENNETES;

export function mapPosition(props: {
	paroi: Paroi;
	input: Input;
}): enveloppe.common.Position {
	const { paroi } = props;
	const value: enveloppe.common.PositionBase = {
		surface: mapSurface(paroi),
		mitoyennete: mapMitoyennete(paroi),
		local_non_chauffe_id: mapLocalNonChauffeId(props),
	};

	if (!enveloppe.common.isPosition(value))
		throw new MappingError("position", paroi);

	return value;
}

export function mapSurface(props: Paroi): number {
	if ("surface_totale_baie" in props.donnee_entree)
		return props.donnee_entree.surface_totale_baie;

	if ("surface_porte" in props.donnee_entree)
		return props.donnee_entree.surface_porte;

	return props.donnee_entree.surface_paroi_opaque;
}

export function mapMitoyennete(props: Paroi): enveloppe.common.MitoyenneteEnum {
	switch (props.donnee_entree.enum_type_adjacence_id) {
		case "1":
			return MITOYENNETES.exterieur;
		case "2":
		case "5":
			return MITOYENNETES.enterre;
		case "3":
			return MITOYENNETES.vide_sanitaire;
		case "4":
			return MITOYENNETES.local_non_residentiel;
		case "6":
			return MITOYENNETES.sous_sol_non_chauffe;
		case "7":
			return MITOYENNETES.local_non_accessible;
		case "20":
			return MITOYENNETES.local_non_residentiel;
		case "22":
			return MITOYENNETES.local_residentiel;
		default:
			return MITOYENNETES.local_non_chauffe;
	}
}

export function mapLocalNonChauffeId(props: {
	paroi: Paroi;
	input: Input;
}): enveloppe.common.Position["local_non_chauffe_id"] {
	const { paroi, input } = props;

	// Absence de local non chauffé mitoyen
	if (mapMitoyennete(paroi) !== MITOYENNETES.local_non_chauffe) return null;

	// Cas des espaces tampons solarisés
	if (paroi.donnee_entree.enum_type_adjacence_id === "10") {
		const reference_lnc = paroi.donnee_entree.reference_lnc;

		if (reference_lnc) {
			for (const ets of input.logement.enveloppe.ets_collection) {
				if (reference_lnc === ets.donnee_entree.reference)
					return resolveId(reference_lnc);
			}
		}
		// Référence absente ou non trouvée dans les ETS du logement
		throw new MappingError("reference_lnc", paroi);
	}

	// Autres locaux non chauffés
	return resolveId(paroi.donnee_entree.reference);
}

export function mapParoiId(props: {
	paroi: ParoiVitree;
	input: Input;
}): enveloppe.porte.Position["paroi_id"] {
	const { paroi, input } = props;

	if (!paroi.donnee_entree.reference_paroi) return null;

	const collection = [
		...input.logement.enveloppe.mur_collection,
		...input.logement.enveloppe.plancher_bas_collection,
		...input.logement.enveloppe.plancher_haut_collection,
	];

	const references = collection.map((item) => item.donnee_entree.reference);

	const match = findReference(paroi.donnee_entree.reference_paroi, references);
	return match ? resolveId(match) : null;
}
