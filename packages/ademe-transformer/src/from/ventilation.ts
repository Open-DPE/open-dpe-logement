import * as models from "@open-dpe-logement/models";
import { type DPE } from "@open-dpe-logement/open-data";
import type { IContext } from "./context";
import { isDPELogement } from "./guards";

export function transformVentilation(
	data: DPE,
	context: IContext,
): models.ventilation.Ventilation | null {
	if (!isDPELogement(data)) return null;

  const installations = data.logement.ventilation_collection.map((ventilation) => {
    const id = crypto.randomUUID();
    const description = ventilation.donnee_entree.description ?? "nc";
    const surface = ventilation.donnee_entree.surface_ventile;
    const type = 


    return {
      id: crypto.randomUUID(),
      description: ventilation.donnee_entree.description ?? "nc",
      surface: ventilation.donnee_entree.surface_ventile,

    }
  })
}
