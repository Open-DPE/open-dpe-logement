import { beforeAll } from "vitest";
import { init } from "@open-dpe-logement/engine-abaques";

beforeAll(async () => {
	await init();
});
