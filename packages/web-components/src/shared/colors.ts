import * as models from "@open-dpe-logement/models";

export const PERFORMANCE_COLORS = {
	1: "#2CAF85",
	2: "#A5CC74",
	3: "#F49838",
	4: "#E52322",
};

export const ETIQUETTE_CLIMAT_COLORS = {
	[models.diagnostic.EtiquetteEnum.A]: "#A4DBF8",
	[models.diagnostic.EtiquetteEnum.B]: "#8CB4D3",
	[models.diagnostic.EtiquetteEnum.C]: "#7792B1",
	[models.diagnostic.EtiquetteEnum.D]: "#606F8F",
	[models.diagnostic.EtiquetteEnum.E]: "#4D5271",
	[models.diagnostic.EtiquetteEnum.F]: "#393551",
	[models.diagnostic.EtiquetteEnum.G]: "#281B35",
};

export const ETIQUETTE_ENERGIE_COLORS = {
	[models.diagnostic.EtiquetteEnum.A]: "#00A06D",
	[models.diagnostic.EtiquetteEnum.B]: "#52B153",
	[models.diagnostic.EtiquetteEnum.C]: "#A5CC74",
	[models.diagnostic.EtiquetteEnum.D]: "#F4E70F",
	[models.diagnostic.EtiquetteEnum.E]: "#F0B40F",
	[models.diagnostic.EtiquetteEnum.F]: "#EB8235",
	[models.diagnostic.EtiquetteEnum.G]: "#D7221F",
};
