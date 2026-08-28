# @open-dpe-logement/ademe-models

Modèles TypeScript pour les exports XML **DPE** produits par l'[observatoire DPE-Audit](https://gitlab.com/observatoire-dpe/observatoire-dpe) (données open data ADEME, jeu `dpe03existant`).

Ce package fait le pont entre le XML réel tel que publié par l'ADEME et des types TypeScript exploitables : un XSD ADEME par version → un type `DPE` correspondant, plus un parseur qui normalise le XML brut vers la forme attendue par ces types.

> Positionnement dans le monorepo : ce package modélise le **format d'échange ADEME/observatoire** (XML, un schéma par version XSD). Il est distinct de [`packages/schemas`](../schemas) et [`packages/models`](../models), qui portent le **schéma de données publiques du projet** (JSON Schema, doctrine propre à `open-dpe-logement`, voir la [convention de design](../../docs)). Un transformer XML ADEME → schéma interne s'appuiera sur ce package en amont.

## Installation

```sh
npm i @open-dpe-logement/ademe-models
```

## Usage

```ts
import { dpe } from "@open-dpe-logement/ademe-models";

const input = {/** ... **/}
const data = dpe.DPELogementExistant.parse(input);

if (dpe.isDPEv2(data)) {}
if (dpe.isDPEv22(data)) {}
if (dpe.isDPEv23(data)) {}
if (dpe.isDPEv24(data)) {}
if (dpe.isDPEv25(data)) {}
if (dpe.isDPEv26(data)) {}

```

## Périmètre couvert

### Versions

- ✅ DPEv2.xsd
- ✅ DPEv2.2.xsd
- ✅ DPEv2.3.xsd
- ✅ DPEv2.4.xsd
- ✅ DPEv2.5.xsd
- ✅ DPEv2.6.xsd
- ⏳ audit_v2.1.xsd
- ⏳ audit_v2.2.xsd
- ⏳ audit_v2.3.xsd
- ⏳ audit_v2.4.xsd
- ⏳ audit_v2.5.xsd

### Modèles

- ✅ DPE Logement existant
- ❌ DPE Logement neuf
- ❌ DPE Tertiaire

## Origine des schémas (`doc/`)

`doc/` conserve les XSD officiels ADEME tels que publiés, pour référence lors de la mise à jour des types.

## Enums (génération)

Les enums DPE (`src/dpe/enums.ts`) sont **générées**, pas écrites à la main :

```sh
npm run generate:enums:dpe
```

- Source : `data/enums.dpe.json` (paires id → libellé, une entrée par enum)
- Sortie : `src/dpe/enums.ts` (commenté `@generated`, ne pas éditer directement)
- Règle de typage : une enum dont toutes les clés sont des entiers devient un type à clés `string`

## Tests

```sh
npm test
```

- Les fixtures sont des XML **réels**, un par cas, téléchargés depuis `https://observatoire-dpe-audit.ademe.fr/afficher-dpe/{numero_dpe}` (voir `tests/fixtures/dpe/README.md`)
- Un dossier par version XSD (`tests/fixtures/dpe/v2/`, `v2.2/`, … `v2.6/`), chacun avec un `manifest.json` déclarant les fixtures attendues (`numero_dpe`, `version_dpe`, `critere`)
- Les critères couverts : `maison_individuelle`, `appartement_individuel`, `immeuble_collectif`, `multi_generateurs`, et `champs_optionnels_absents` (déclaré mais pas encore instancié dans les manifests)
- Une fixture listée dans `manifest.json` mais absente du dossier est **skip** (pas d'échec), pour permettre un ajout progressif — les fichiers XML doivent être ajoutés manuellement (ils ne sont pas générés)
- Les tests vérifient des invariants structurels (types après parsing, collections toujours en tableau, cohérence `enum_version_id` ↔ dossier), **pas** l'exhaustivité des ~290 champs du schéma — voir le commentaire en tête de `tests/helpers/dpe-fixture-suite.ts`
Pour ajouter un cas de test : déposer le XML dans le dossier de la version concernée, puis ajouter son entrée dans le `manifest.json` du dossier.

## Todo

- [x] DPE (`dpe_v2.*.xsd`)
- [ ] Audit (`audit_v2.*.xsd`)

## Limites connues

- `xsi:nil="true"` sur un élément nillable n'est pas géré explicitement par le parseur (les éditeurs observés omettent en général l'élément plutôt que d'utiliser `xsi:nil`) — à corriger si une fixture réelle l'exploite

## Scripts

| Commande                     | Effet                                                      |
| ---------------------------- | ---------------------------------------------------------- |
| `npm run build`              | Compile `src/` → `dist/` (types + JS, `tsc`)               |
| `npm run check-types`        | Vérification TypeScript sans émission                      |
| `npm test`                   | Lance la suite Vitest (fixtures réelles, skip si absentes) |
| `npm run generate:enums:dpe` | Régénère `src/dpe/enums.ts` depuis `data/enums.dpe.json`   |

## Différences XML/Typescript

### Numéro DPE/Audit

Les propriétés `numero_dpe` et `numero_audit` ne sont décrites dans aucun des fichiers XSD. Ces propriétés sont cependant resenginées à la racine des exports XML.

### Énumérations

```xml
<xs:element name="enum_zone_climatique_id">
    <xs:simpleType>
        <xs:restriction base="xs:int">
            <xs:minInclusive value="1"/>
            <xs:maxInclusive value="8"/>
        </xs:restriction>
    </xs:simpleType>
</xs:element>
```

⏬ devient ⏬

```typescript
type Type = {
    enum_type_doublage_id: "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8"
}
```

### Booleans

```xml
<xs:element name="batiment_materiaux_anciens" type="s_oui_non"  />
```

⏬ devient ⏬

```typescript
type Type = {
    batiment_materiaux_anciens: boolean
}
```

### Collections

```xml
<xs:element name="mur_collection">
    <xs:complexType>
        <xs:sequence>
            <xs:element name="mur" minOccurs="0" maxOccurs="unbounded" nillable="true">
                ...
            </xs:element>
        <xs:sequence>
    <xs:complexType>
<xs:sequence>
```

⏬ devient ⏬

```typescript
type Type = {
    mur_collection: [{...}]
}
```

### Anonymisation

Champs non couverts par souci d'anonymisation des données :

- administratif/nom_proprietaire
- administratif/siren_proprietaire
- administratif/nom_proprietaire_installation_commune
- administratif/diagnostiqueur
- administratif/auditeur
- administratif/consentement_proprietaire
- administratif/information_consentement_proprietaire
- administratif/information_formulaire_consentement
- administratif/geolocalisation/adresses/adresse_proprietaire
- administratif/enum_consentement_formulaire_id
- administratif/enum_commanditaire_id

### Propriétés optionnelles

Champs déclarés `minOccurs="0"`/`nillable="true"` dans le XSD ADEME (toutes versions,
sauf mention contraire) mais modélisés comme requis à l'origine dans les schémas Zod —
corrigés en `.nullable().optional()` :

- `reference` (donnée_entree de tout équipement : mur, baie_vitree, plancher_haut,
  plancher_bas, porte, pont_thermique, ventilation, climatisation, installation_chauffage
  [+ émetteur + générateur], installation_ecs [+ générateur], production_elec_enr, ets
  [+ baie_ets]) — v2/v2.1 uniquement (seules versions où le champ existe avec ce statut)
- `logement/enveloppe/baie_vitree_collection/donnee_intermediaire/ujn`
- `logement/enveloppe/baie_vitree_collection/donnee_intermediaire/ug`
- `logement/enveloppe/mur_collection/donnee_intermediaire/umur0`
- `logement/enveloppe/mur_collection/donnee_entree/surface_paroi_totale`
- `logement/enveloppe/plancher_haut_collection/donnee_intermediaire/uph0`
- `logement/enveloppe/plancher_bas_collection/donnee_intermediaire/upb0`
- `logement/enveloppe/porte_collection/donnee_entree/nb_porte`
- `logement/enveloppe/porte_collection/donnee_entree/enum_type_pose_id` — v2/v2.1
  uniquement (requis à partir de v2.2)
- `logement/enveloppe/pont_thermique_collection/donnee_entree/pourcentage_valeur_pont_thermique`
  — v2/v2.1 uniquement (requis à partir de v2.2)
- `logement/installation_ecs_collection/donnee_intermediaire/fecs`
- `logement/sortie/qualite_isolation/qualite_isol_plancher_haut_toit_terrasse`
- `logement/sortie/qualite_isolation/qualite_isol_plancher_haut_comble_amenage`
- `logement/sortie/qualite_isolation/qualite_isol_plancher_haut_comble_perdu`
- `logement/sortie/qualite_isolation/qualite_isol_plancher_bas`
- `logement/sortie/confort_ete`
- `logement/sortie/ef_conso/conso_auxiliaire_distribution_fr`
- `logement/sortie/ep_conso/ep_conso_auxiliaire_distribution_fr`
- `logement/sortie/emission_ges/emission_ges_auxiliaire_distribution_fr`
- `logement/sortie/cout/cout_auxiliaire_distribution_fr`

Cas particulier : `administratif/geolocalisation/adresses/adresse_bien/label_brut_avec_complement`
n'existe pas du tout dans le XSD v2/v2.1 (ajouté en v2.2) — retiré du schéma Zod v2
plutôt que rendu optionnel.

### Valeurs par défaut

Champs déclarés requis dans le XSD ADEME (toutes versions) mais fréquemment absents des
données publiées (écart XSD-requis vs données réelles, indépendant d'une version
particulière — voir analyse du corpus). Plutôt que de rejeter ces enregistrements,
une valeur de repli documentée est substituée à l'absence de donnée :

- `descriptif_travaux/pack_travaux_collection/travaux_collection/performance_recommande` → `"Non renseigné"`
- `descriptif_travaux/pack_travaux_collection/travaux_collection/description_travaux` → `"Non renseigné"`
- `descriptif_travaux/commentaire_travaux` → `"Non renseigné"`
- `descriptif_simplifie_collection/description` → `"Non renseigné"`
- `fiche_technique_collection/sous_fiche_technique_collection/valeur` → `"Non renseigné"`
- `justificatif_collection/description` → `"Non renseigné"`
- `dpe_immeuble/logement_visite_collection/description` → `"Non renseigné"`

Implémentation : `z.string().nullable().optional().transform((v) => v ?? "Non renseigné")`
plutôt que `z.string().default(...)` — `.default()` ne s'applique qu'à une entrée
`undefined`, pas à `null` (constaté sur le corpus : ces champs arrivent en `null`, jamais
`undefined`, une fois retirés du XML ou vidés par le diagnostiqueur).
