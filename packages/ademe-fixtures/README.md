# @open-dpe-logement/ademe-fixtures

Fixtures XML réelles issues de l'[observatoire DPE-Audit](https://observatoire-dpe-audit.ademe.fr/) (ADEME, open data `dpe03existant`), partagées entre les packages qui en ont besoin à différents endroits du pipeline :

- [`ademe-client`](../ademe-client) : XML brut → objet JS (`parser.ts`)
- [`ademe-mapper`](../ademe-mapper) : objet JS (sortie d'`ademe-client`) → schéma interne (`@open-dpe-logement/models`)
- [`engine`](../engine) : schéma interne (sortie d'`ademe-mapper`) → calcul 3CL-DPE — à titre de non-régression bout-en-bout, distinct des tests unitaires de formules existants (`engine/tests/formulas`)

> Package privé (`private: true`), jamais publié : ce sont des données, pas du code à distribuer. Chaque consommateur l'ajoute en devDependency (workspace npm).

## Pourquoi un package dédié

Les fixtures XML ne sont utiles qu'à un stade différent d'un même pipeline (XML → ademe-client → ademe-mapper → engine). Centraliser la donnée ici évite de la dupliquer physiquement dans chaque package consommateur, tout en laissant à chacun sa propre logique de test : ce package n'expose que les fichiers et les chemins, jamais d'assertions.

## Organisation

Pool plat, pas de sous-dossier par version XSD : la version de chaque fichier est déterminée en lisant son contenu (`<enum_version_id>`), jamais depuis son emplacement sur disque — voir [`data/dpe/README.md`](./data/dpe/README.md).

```text
data/dpe/
├── manifest.json  # index généré (numero_dpe, version_dpe, file) — voir scripts/generate-manifest.mjs
├── README.md      # provenance, convention
└── <numero_dpe>.xml  # ~400 XML réels
```

## Usage

```ts
import { dpeFixturesDir, listDpeFixtures } from "@open-dpe-logement/ademe-fixtures";

listDpeFixtures();                  // toutes les fixtures DPE indexées
listDpeFixtures({ version: "2.6" }); // uniquement les fixtures version 2.6
dpeFixturesDir;                      // .../data/dpe (chemin racine du pool)
```

`listDpeFixtures` lit `data/dpe/manifest.json`. Après tout ajout/suppression de fichier XML, régénérer avec :

```sh
npm run generate-manifest --workspace=@open-dpe-logement/ademe-fixtures
```

## Périmètre

- ✅ DPE Logement existant
- ⏳ Audit
- ❌ DPE Logement neuf
- ❌ DPE Logement tertiaire

### DPE

- ❌ DPEv1
- ✅ DPEv2
- ✅ DPEv2.2
- ✅ DPEv2.3
- ✅ DPEv2.4
- ✅ DPEv2.5
- ✅ DPEv2.6

## Ajouter une fixture

Voir [`data/dpe/README.md`](./data/dpe/README.md).

## TODO

- [ ] Ajouter les fixtures Audit dans `data/audit/`.
