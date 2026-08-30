import _departements from "../../data/departements.json";

export type Departement = {
	code_departement: string;
	departement: string;
	commune: string;
	code_insee: string;
};

export interface Repository {
	all(): Departement[];
	byCode(code: string): Departement | null;
}

export const departement: Repository = {
	all(): Departement[] {
		return _departements;
	},

	byCode(code: string): Departement | null {
		return _departements.find((d) => d.code_departement === code) ?? null;
	},
};
