import { beforeAll } from "vitest";
import { init } from "@open-dpe-logement/abaques";

beforeAll(async () => {
	await init();
});
