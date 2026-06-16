import data from "#data/climat/nj.js";

export type Schema = {
	mois: string;
	nj: number;
};

export const load = (): Schema[] => data;
