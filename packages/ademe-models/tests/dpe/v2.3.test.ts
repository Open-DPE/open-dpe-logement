import { fileURLToPath } from "url";
import { join } from "path";
import { runDpeVersionSuite } from "../helpers/dpe-fixture-suite.js";
import { loadManifest } from "../helpers/load-manifest.js";

const testsDir = fileURLToPath(new URL(".", import.meta.url));
const fixturesDir = join(testsDir, "..", "fixtures", "dpe", "v2.3");

runDpeVersionSuite("v2.3 (DPEv2.3.xsd)", fixturesDir, loadManifest(fixturesDir));
