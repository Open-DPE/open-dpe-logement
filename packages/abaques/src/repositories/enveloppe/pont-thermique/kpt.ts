import data from "#data/enveloppe/pont-thermique/kpt.js";
import { filter } from "#filter.js";

export type Schema = {
	type_liaison: string;
	isolation_mur: boolean;
	type_isolation_mur: string | null;
	isolation_plancher: boolean | null;
	type_isolation_plancher: string | null;
	type_pose_menuiserie: string | null;
	presence_retour_isolation: boolean | null;
	"largeur_dormant/lte": number | null;
	"largeur_dormant/gt": number | null;
	kpt: number;
};

export type Query = {
	type_liaison: string;
	isolation_mur: boolean;
	type_isolation_mur: string | null;
	isolation_plancher: boolean | null;
	type_isolation_plancher: string | null;
	type_pose_menuiserie: string | null;
	presence_retour_isolation: boolean | null;
	largeur_dormant: number | null;
};

export const load = (): Schema[] => data;

export const search = (query: Query, rows: Schema[]): Schema[] =>
	filter(query, rows);
