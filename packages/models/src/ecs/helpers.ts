import type { Ecs } from "./types.js";
import type { Generateur } from "./generateur/types.js";
import type { Installation } from "./installation/types.js";
import type { Systeme } from "./systeme/types.js";
import { EntityNotFoundError } from "../errors.js";

export function getSystemes(ecs: Ecs): Systeme[] {
	return ecs.installations.flatMap((i) => i.systemes);
}

export function findGenerateur(id: string, ecs: Ecs): Generateur {
	const e = ecs.generateurs.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Générateur", id);
	return e;
}

export function findInstallation(id: string, ecs: Ecs): Installation {
	const e = ecs.installations.find((g) => g.id === id);
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}

export function findInstallationBySysteme(id: string, ecs: Ecs): Installation {
	const e = ecs.installations.find((i) => i.systemes.some((s) => s.id === id));
	if (!e) throw new EntityNotFoundError("Installation", id);
	return e;
}
