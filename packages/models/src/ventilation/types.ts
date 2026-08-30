import * as z from "zod";
import { Installation, InstallationWithData } from "./installation/types.js";

export const Ventilation = z.object({
	installations: z.array(Installation).min(1),
});

export const VentilationData = z.object({
	qvarep_conv: z.number().min(0),
	qvasouf_conv: z.number().min(0),
	smea_conv: z.number().min(0),
});

export const VentilationWithData = z.intersection(
	Ventilation,
	z.object({
		installations: z.array(InstallationWithData).min(1),
		data: VentilationData,
	}),
);

export type Ventilation = z.infer<typeof Ventilation>;
export type VentilationData = z.infer<typeof VentilationData>;
export type VentilationWithData = z.infer<typeof VentilationWithData>;
