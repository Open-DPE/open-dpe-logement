export * as installation from "./installation/constants.js";

export const NAMESPACE = "ventilation";

export const RULES = {
	consommations: "consommations",
	caux: "caux",
	qvarep_conv: "qvarep_conv",
	qvasouf_conv: "qvasouf_conv",
	smea_conv: "smea_conv",
	hvent: "hvent",
} as const;
