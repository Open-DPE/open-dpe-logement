import { getTable, registerTable } from "../../cache.js";

export type Schema = {
	mois: string;
	nj: number;
};

const TABLE_KEY = "climat/nj";
registerTable(TABLE_KEY);

export const load = (): Schema[] => getTable<Schema[]>(TABLE_KEY);
