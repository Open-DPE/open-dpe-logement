import * as models from "@open-dpe-logement/models";

export const PERFORMANCE_COLORS = {
	A: "#2CAF85",
	B: "#A5CC74",
	C: "#F49838",
	D: "#E52322",
};

export const CONFORT_ETE_COLORS: Record<string, string> = {
	[models.diagnostic.ConfortEte.enum.bon]: "#2CAF85",
	[models.diagnostic.ConfortEte.enum.moyen]: "#F49838",
	[models.diagnostic.ConfortEte.enum.insuffisant]: "#E52322",
};

export const ETIQUETTE_CLIMAT_COLORS: Record<string, string> = {
	[models.diagnostic.Etiquette.enum.A]: "#A4DBF8",
	[models.diagnostic.Etiquette.enum.B]: "#8CB4D3",
	[models.diagnostic.Etiquette.enum.C]: "#7792B1",
	[models.diagnostic.Etiquette.enum.D]: "#606F8F",
	[models.diagnostic.Etiquette.enum.E]: "#4D5271",
	[models.diagnostic.Etiquette.enum.F]: "#393551",
	[models.diagnostic.Etiquette.enum.G]: "#281B35",
};

export const ETIQUETTE_ENERGIE_COLORS: Record<string, string> = {
	[models.diagnostic.Etiquette.enum.A]: "#00A06D",
	[models.diagnostic.Etiquette.enum.B]: "#52B153",
	[models.diagnostic.Etiquette.enum.C]: "#A5CC74",
	[models.diagnostic.Etiquette.enum.D]: "#F4E70F",
	[models.diagnostic.Etiquette.enum.E]: "#F0B40F",
	[models.diagnostic.Etiquette.enum.F]: "#EB8235",
	[models.diagnostic.Etiquette.enum.G]: "#D7221F",
};
