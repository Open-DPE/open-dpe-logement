import { validate } from "@open-dpe-logement/schemas/enveloppe/local-non-chauffe/paroi";
import type { UUID } from "../../common/common.js";
import type { Mitoyennete } from "../common.js";

export function isParoi(data: unknown): data is Paroi {
	return validate(data).isValid;
}

export type Paroi = {
	id: UUID;
	description: string;
	isolation: boolean | null;
	position: Position;
};

export type Position = {
	mitoyennete: Mitoyennete;
	surface: number;
};
