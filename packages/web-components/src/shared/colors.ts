import * as models from "@open-dpe-logement/models";

export const PERFORMANCE_COLORS = {
	A: "#2CAF85",
	B: "#A5CC74",
	C: "#F49838",
	D: "#E52322",
};

export const CONFORT_ETE_COLORS: Record<string, string> = {
	"1": "#2CAF85",
	"2": "#F49838",
	"3": "#E52322",
};

export const ETIQUETTE_CLIMAT_COLORS: Record<string, string> = {
	[models.diagnostic.ETIQUETTES.A]: "#A4DBF8",
	[models.diagnostic.ETIQUETTES.B]: "#8CB4D3",
	[models.diagnostic.ETIQUETTES.C]: "#7792B1",
	[models.diagnostic.ETIQUETTES.D]: "#606F8F",
	[models.diagnostic.ETIQUETTES.E]: "#4D5271",
	[models.diagnostic.ETIQUETTES.F]: "#393551",
	[models.diagnostic.ETIQUETTES.G]: "#281B35",
};

export const ETIQUETTE_ENERGIE_COLORS: Record<string, string> = {
	[models.diagnostic.ETIQUETTES.A]: "#00A06D",
	[models.diagnostic.ETIQUETTES.B]: "#52B153",
	[models.diagnostic.ETIQUETTES.C]: "#A5CC74",
	[models.diagnostic.ETIQUETTES.D]: "#F4E70F",
	[models.diagnostic.ETIQUETTES.E]: "#F0B40F",
	[models.diagnostic.ETIQUETTES.F]: "#EB8235",
	[models.diagnostic.ETIQUETTES.G]: "#D7221F",
};
