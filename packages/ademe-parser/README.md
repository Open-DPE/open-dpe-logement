# @open-dpe-logement/ademe-parser

Normalisation du XML brut de l'[observatoire DPE-Audit](https://observatoire-dpe-audit.ademe.fr/) (ADEME) vers un objet JS, selon la forme attendue par les types de [`ademe-models`](../ademe-models) (collections aplaties en tableaux, énumérations/références en string, `s_oui_non` en boolean).

> Positionnement dans le monorepo : ce package ne fait que du XML → objet JS, sans connaissance du transport HTTP ([`ademe-client`](../ademe-client)) ni de la validation de schéma ([`ademe-models`](../ademe-models)). Séparé de ces deux packages pour que chacun puisse le consommer indépendamment sans dépendance circulaire — notamment `ademe-models`, qui s'en sert pour ses propres tests d'exhaustivité sur fixtures réelles, sans dépendre d'`ademe-client` (qui dépend déjà de `ademe-models`).

## Installation

```sh
npm i @open-dpe-logement/ademe-parser
```

## Usage

```ts
import { parse } from "@open-dpe-logement/ademe-parser";

const xml = "<dpe>...</dpe>"; // ou <audit>...</audit>
const parsed = parse(xml); // objet JS brut, non typé, non validé
```

`parse()` ne valide rien : il produit un objet JS prêt à être passé à un schéma [`ademe-models`](../ademe-models) (`dpe.DPELogementExistant.parse(parsed)`, `audit.Audit.parse(parsed)`).

## Convention de normalisation

### Références

Les références internes sont converties en minuscules et normalisées en
espacement (espaces de bord retirés, espaces internes multiples réduits à
un seul — le XML ADEME contient des références au double espacement
irrégulier, ex. `"mur  1"`, corpus réel).

Propriétés concernées :

- reference
- reference_1
- reference_2
- reference_lnc
- reference_paroi
- reference_generateur_mixte

### Énumérations

Les énumérations sont converties en chaîne de caractères.

Propriétés concernées : `enum_xxxx`

### Nombres

Les valeurs numériques sont arrondies à deux décimales.

### Booleans

Les valeurs au format `s_oui_non` dans le format XSD sont converties en boolean.

Propriétés concernées :

- appartement_non_visite
- aspect_traversant
- batiment_materiaux_anciens
- brasseur_air
- calcul_ue
- double_fenetre
- enduit_isolant_paroi_ancienne
- inertie_lourde
- inertie_paroi_verticale_lourd
- inertie_plancher_bas_lourd
- inertie_plancher_haut_lourd
- isolation_toiture
- paroi_lourde
- personne_morale
- plusieurs_facade_exposee
- position_volume_chauffe
- position_volume_chauffe_stockage
- presence_joint
- presence_production_pv
- presence_protection_solaire_hors_fermeture
- presence_regulation_combustion
- presence_retour_isolation
- presence_ventouse
- protection_solaire_exterieure
- reseau_distribution_isole
- ventilation_post_2012
- vitrage_vir

### Nulls

```xml
<dpe_a_remplacer xsi:nil="true"/>
```

⏬ devient ⏬

```json
{
  "dpe_a_remplacer": ""
}
```

⏬ devient ⏬

```typescript
const value = {
  dpe_a_remplacer: null;
}
```

### Collections

Propriétés concernées : `xxxx_collection`

```xml
<mur_collection>
    <mur>...<mur>
    <mur>...<mur>
    <mur>...<mur>
<mur_collection>
```

⏬ devient ⏬

```typescript
const value = {
    mur_collection: [{...}, {...}, {...}]
}
```

## Limite connue

Ne gère pas explicitement `xsi:nil="true"` sur les éléments nillable (à date, non observé dans les fixtures réelles : les éditeurs omettent en général l'élément plutôt que de le marquer `nil`).

## Tests

```sh
npm run test
```

## Scripts

| Commande              | Effet                                        |
| --------------------- | -------------------------------------------- |
| `npm run build`       | Compile `src/` → `dist/` (types + JS, `tsc`) |
| `npm run check-types` | Vérification TypeScript sans émission        |
| `npm run test`        | Lance la suite Vitest                        |
