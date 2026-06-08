import * as rules from "./rules.js";

export const ID = "diagnostic";

export const RULES = {
	consommations: "consommations",
	cef: "cef",
	cep: "cep",
	eges: "eges",
	etiquette_energie: "etiquette_energie",
	etiquette_climat: "etiquette_climat",
	confort_ete: "confort_ete",
} as const;

export type Results = {
	[ID]: {
		[RULES.consommations]: ReturnType<typeof rules.consommations>;
		[RULES.cef]: ReturnType<typeof rules.cef>;
		[RULES.cep]: ReturnType<typeof rules.cep>;
		[RULES.eges]: ReturnType<typeof rules.eges>;
		[RULES.etiquette_energie]: ReturnType<typeof rules.etiquette_energie>;
		[RULES.etiquette_climat]: ReturnType<typeof rules.etiquette_climat>;
		[RULES.confort_ete]: ReturnType<typeof rules.confort_ete>;
	};
};
