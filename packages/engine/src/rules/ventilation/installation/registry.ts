import * as rules from "./rules.js";

export const ID = "ventilation:installation";

export const RULES = {
	caux: "caux",
	pvent_moy: "pvent_moy",
	rut: "rut",
	rdim: "rdim",
	qvarep_conv: "qvarep_conv",
	qvasouf_conv: "qvasouf_conv",
	smea_conv: "smea_conv",
	hvent: "hvent",
} as const;

export type Results = {
	[ID]: Record<
		string,
		{
			[RULES.caux]: ReturnType<typeof rules.caux>;
			[RULES.pvent_moy]: ReturnType<typeof rules.pvent_moy>;
			[RULES.rut]: ReturnType<typeof rules.rut>;
			[RULES.rdim]: ReturnType<typeof rules.rdim>;
			[RULES.qvarep_conv]: ReturnType<typeof rules.qvarep_conv>;
			[RULES.qvasouf_conv]: ReturnType<typeof rules.qvasouf_conv>;
			[RULES.smea_conv]: ReturnType<typeof rules.smea_conv>;
			[RULES.hvent]: ReturnType<typeof rules.hvent>;
		}
	>;
};
