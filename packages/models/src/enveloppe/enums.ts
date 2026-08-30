import * as z from "zod";

export const EXPOSITIONS = {
	simple: "simple",
	multiple: "multiple",
} as const;

export const ExpositionEnum = z.enum(EXPOSITIONS);
export type ExpositionEnum = z.infer<typeof ExpositionEnum>;
