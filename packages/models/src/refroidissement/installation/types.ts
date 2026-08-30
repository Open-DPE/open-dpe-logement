import * as z from "zod";
import { id, description, surface } from "../../common/types.js";

export const Installation = z.object({
	id,
	description,
	surface,
	generateurs: z.array(id).min(1),
});

export const InstallationData = z.object({
	rdim: z.number().min(0),
});

export const InstallationWithData = z.intersection(
	Installation,
	z.object({
		data: InstallationData,
	}),
);

export type Installation = z.infer<typeof Installation>;
export type InstallationData = z.infer<typeof InstallationData>;
export type InstallationWithData = z.infer<typeof InstallationWithData>;
