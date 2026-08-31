import _geste from "../../data/gestes.json";

export type Geste = {
	id: string;
	titre: string;
	description: string;
};

export const gestes = _geste as Geste[];
