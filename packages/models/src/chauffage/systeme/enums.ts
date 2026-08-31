import * as z from "zod";

export const TypeDistribution = z.enum({
	hydraulique: "hydraulique",
	aeraulique: "aeraulique",
});

export type TypeDistribution = z.infer<typeof TypeDistribution>;
