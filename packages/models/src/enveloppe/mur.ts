import type { UUID } from "../common/common.js";
import { buildEnum, createGuard } from "../utils.js";
import type {
	InertieParoi,
	Isolation,
	Position as PositionBase,
} from "./common.js";

export const isMur = createGuard<Mur>("/enveloppe/mur");

/**
 * @see https://schemas.open-dpe.fr/enveloppe/mur
 */
export type Mur = {
	id: UUID;
	description: string;
	structures: Structure[];
	type_doublage: TypeDoublage | null;
	presence_enduit_isolant: boolean | null;
	inertie: InertieParoi | null;
	annee_construction: number | null;
	annee_renovation: number | null;
	u0: number | null;
	u: number | null;
	position: Position;
	isolation: Isolation;
};

export type MurWithData<T extends Mur = Mur> = T & {
	data: MurData;
};

export type MurData = {
	u0: number;
	u: number;
	b: number;
	sdep: number;
	dp: number;
	paroi_ancienne: boolean;
};

export type Structure = {
	materiau: MateriauMur | null;
	epaisseur: number | null;
	materiau_ancien: boolean | null;
};

export type Position = PositionBase;

export const MATERIAUX_MUR = [
	"pierre_moellons",
	"pierre_moellons_avec_remplissage",
	"pise_ou_beton_terre",
	"pan_bois_sans_remplissage",
	"pan_bois_avec_remplissage",
	"bois_rondin",
	"brique_pleine_simple",
	"brique_pleine_double_avec_lame_air",
	"brique_creuse",
	"bloc_beton_plein",
	"bloc_beton_creux",
	"beton_banche",
	"beton_machefer",
	"brique_terre_cuite_alveolaire",
	"sandwich_beton_isolant_beton_sans_isolation_rapportee",
	"cloison_platre",
	"ossature_bois_sans_remplissage",
	"ossature_bois_avec_remplissage_tout_venant",
	"ossature_bois_avec_remplissage_isolant",
	"beton_cellulaire",
] as const;
export type MateriauMur = (typeof MATERIAUX_MUR)[number];
export const MateriauMurEnum = buildEnum(MATERIAUX_MUR);

export const TYPES_DOUBLAGE = [
	"sans_doublage",
	"indetermine",
	"lame_air_inferieur_15mm",
	"lame_air_superieur_15mm",
	"materiaux_connu",
] as const;
export type TypeDoublage = (typeof TYPES_DOUBLAGE)[number];
export const TypeDoublageEnum = buildEnum(TYPES_DOUBLAGE);
