import type { UUID } from "../../common/common.js";
import type { Mitoyennete } from "../common.js";

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
