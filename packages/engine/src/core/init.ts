import { init as initAbaques } from "@open-dpe-logement/abaques";

let pending: Promise<void> | undefined;

export function init(): Promise<void> {
	if (!pending) {
		pending = initAbaques();
	}
	return pending;
}
