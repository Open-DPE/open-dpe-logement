import { type DPE } from "@open-dpe-logement/open-data";

export function isDPELogement(
	data: DPE,
): data is DPE & { logement: NonNullable<DPE["logement"]> } {
	return data.logement !== null && data.logement !== undefined;
}
