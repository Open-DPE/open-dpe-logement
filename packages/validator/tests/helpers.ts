import type { common, enveloppe } from "@open-dpe-logement/models";

/** UUID de test n°1 */
export const UUID = "550e8400-e29b-41d4-a716-446655440000";
/** UUID de test n°2 */
export const UUID2 = "550e8400-e29b-41d4-a716-446655440001";

/** Identité — conservé pour la lisibilité des fixtures (surface, hauteur...) */
export const p = (n: number): number => n;

export const ADRESSE: common.Adresse = {
	ban_id: null,
	nom: "1 rue de la Paix",
	code_postal: "75001",
	code_insee: "75056",
	commune: "Paris",
};

export const ISOLATION_SANS: enveloppe.common.Isolation = {
	etat: false,
	type: null,
	annee_installation: null,
	epaisseur: null,
	resistance_thermique: null,
};
