import * as installation from "./installation/registry.js";
import * as rules from "./rules.js";

export const ID = "ventilation";

export const RULES = {
	caux: "caux",
	qvarep_conv: "qvarep_conv",
	qvasouf_conv: "qvasouf_conv",
	smea_conv: "smea_conv",
	hvent: "hvent",
} as const;

export type Results = {
	[ID]: {
		[RULES.caux]: ReturnType<typeof rules.caux>;
		[RULES.qvarep_conv]: ReturnType<typeof rules.qvarep_conv>;
		[RULES.qvasouf_conv]: ReturnType<typeof rules.qvasouf_conv>;
		[RULES.smea_conv]: ReturnType<typeof rules.smea_conv>;
		[RULES.hvent]: ReturnType<typeof rules.hvent>;
	};
} & installation.Results;
