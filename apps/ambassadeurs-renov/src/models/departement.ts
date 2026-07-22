import _departements from "../../data/departements.json";

export type Departement = {
	code_departement: string;
	departement: string;
	commune: string;
	code_insee: string;
};

export const departements = _departements as Departement[];
