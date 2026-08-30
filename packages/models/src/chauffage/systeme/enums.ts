import * as z from "zod";

export const TYPES_DISTRIBUTION = {
	hydraulique: "hydraulique",
	aeraulique: "aeraulique",
} as const;

export const TypeDistributionEnum = z.enum(TYPES_DISTRIBUTION);
export type TypeDistributionEnum = z.infer<typeof TypeDistributionEnum>;
