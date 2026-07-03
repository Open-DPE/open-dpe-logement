import { readFileSync } from "fs";
import { join } from "path";
import type { FixtureManifestEntry } from "./dpe-fixture-suite.js";

export function loadManifest(fixturesDir: string): FixtureManifestEntry[] {
	const raw = readFileSync(join(fixturesDir, "manifest.json"), "utf-8");
	return JSON.parse(raw) as FixtureManifestEntry[];
}
