import { SCHEMA_KEYS } from "@open-dpe-logement/schemas";
import type { UUID } from "#/common/common";
import { buildEnum, createGuard } from "#/utils";
import type {
	Orientation,
	Position as PositionBase,
	TypePose,
} from "./common.js";

export const isPorte = createGuard<Porte>(SCHEMA_KEYS["enveloppe/porte"]);

/**
 * @see https://schemas.open-dpe.fr/enveloppe/porte
 */
export type Porte = {
	id: UUID;
	description: string;
	isolation: boolean | null;
	materiau: Materiau | null;
	annee_installation: number | null;
	u: number | null;
	position: Position;
	menuiserie: Menuiserie;
	vitrage: Vitrage | null;
};

export type PorteWithData<T extends Porte = Porte> = T & {
	data: PorteData;
};

export type PorteData = {
	u: number;
	b: number;
	sdep: number;
	dp: number;
};

export type Position = PositionBase & {
	paroi_id: UUID | null;
	orientation: Orientation;
	type_pose: TypePose;
	presence_sas: boolean;
};

export type Menuiserie = {
	largeur_dormant: number | null;
	presence_joint: boolean | null;
	presence_retour_isolation: boolean | null;
};

export type Vitrage = {
	surface: number;
	type: TypeVitrage | null;
};

export const MATERIAUX = ["bois", "metal", "pvc"] as const;
export type Materiau = (typeof MATERIAUX)[number];
export const MateriauEnum = buildEnum(MATERIAUX);

export const TYPES_VITRAGE = [
	"simple_vitrage",
	"double_vitrage",
	"triple_vitrage",
] as const;
export type TypeVitrage = (typeof TYPES_VITRAGE)[number];
export const TypeVitrageEnum = buildEnum(TYPES_VITRAGE);
