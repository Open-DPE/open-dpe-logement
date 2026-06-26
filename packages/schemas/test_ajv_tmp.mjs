import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import standaloneCode from "ajv/dist/standalone/index.js";
import fs from "fs";

const ajv = new Ajv2020({
  strict: false,
  allErrors: true,
  useDefaults: true,
  multipleOfPrecision: 2,
  code: { source: true, esm: true },
});
addFormats(ajv);
ajv.addKeyword("x-enum");

const appartement = {
  $id: "https://schemas.open-dpe.fr/batiment/appartement",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Appartement visité",
  type: "object",
  properties: {
    id: { type: "string", format: "uuid" },
    typologie: { type: "string", "x-enum": "typologie", enum: ["T1", "T2"] },
  },
};

const batiment = {
  $id: "https://schemas.open-dpe.fr/batiment",
  $schema: "https://json-schema.org/draft/2020-12/schema",
  title: "Bâtiment",
  type: "object",
  properties: {
    appartements_visites: { type: "array", items: { $ref: "/batiment/appartement" } },
  },
};

ajv.addSchema(appartement);
const validateBatiment = ajv.compile(batiment);

try {
  const moduleCode = standaloneCode(ajv, { Batiment: batiment.$id, Appartement: appartement.$id });
  fs.writeFileSync("test_standalone_output.mjs", moduleCode);
  console.log("Génération standalone OK, taille:", moduleCode.length, "octets");
  console.log("--- dépendances détectées dans le code généré ---");
  const requiresAjv = moduleCode.includes("ajv/dist/runtime");
  const requiresFormats = moduleCode.includes("ajv-formats");
  console.log("référence ajv/dist/runtime ?", requiresAjv);
  console.log("référence ajv-formats (au runtime) ?", requiresFormats);
} catch (e) {
  console.log("ERREUR génération standalone:", e.message);
}
