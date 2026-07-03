import { fileURLToPath } from "url";
import { join } from "path";
import { runDpeVersionSuite } from "../helpers/dpe-fixture-suite.js";
import { loadManifest } from "../helpers/load-manifest.js";

const testsDir = fileURLToPath(new URL(".", import.meta.url));
const fixturesDir = join(testsDir, "..", "fixtures", "dpe", "v2.6");

runDpeVersionSuite("v2.6 (DPEv2.6.xsd)", fixturesDir, loadManifest(fixturesDir));
