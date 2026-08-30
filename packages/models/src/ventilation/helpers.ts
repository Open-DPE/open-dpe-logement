import type { Ventilation } from "./types.js";
import type { Installation } from "./installation/types.js";
import { EntityNotFoundError } from "../errors.js";

export function findInstallation(
	id: string,
	ventilation: Ventilation,
): Installation {
	const e = ventilation.installations.find((i) => i.id === id);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
