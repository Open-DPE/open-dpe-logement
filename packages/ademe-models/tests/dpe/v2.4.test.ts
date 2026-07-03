import { fileURLToPath } from "url";
import { join } from "path";
import { runDpeVersionSuite } from "../helpers/dpe-fixture-suite.js";
import { loadManifest } from "../helpers/load-manifest.js";

const testsDir = fileURLToPath(new URL(".", import.meta.url));
const fixturesDir = join(testsDir, "..", "fixtures", "dpe", "v2.4");

runDpeVersionSuite("v2.4 (DPEv2.4.xsd)", fixturesDir, loadManifest(fixturesDir));
