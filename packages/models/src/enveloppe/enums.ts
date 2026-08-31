import * as z from "zod";

export const Exposition = z.enum({
	simple: "simple",
	multiple: "multiple",
});

export type Exposition = z.infer<typeof Exposition>;
