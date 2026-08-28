# Schémas de données publiques

Standard de données publiques DPE Logement.

## Organisation

```text
schemas/
├── batiment/
├── chauffage/
├── ecs/
├── enveloppe/
├── production/
├── refroidissement/
├── ventilation/
├── manifest.schema.yaml        # Schéma des manifestes de versions
└── CHANGELOG.md
```

## Versionnage

Les schémas publics sont **contractuels et stables**.

## Spécifications

- JSON Schéma 2020-12
- Schémas sources en YAML
- Compilation en YAML et JSON
- UTF-8

## Schémas publics et privés

- `_*.yaml` -> schémas privés
- `*.yaml` -> schémas publics

## Keywords

Mots-clés JSON Schema personnalisés.

### `x-enum`

**Type :** `string`
**Format :** `^([a-z-]+:)*([a-z-]+)$`
**Exemple :** `x-enum: batiment:type`

Identifie une valeur énumérable dans le [dictionnaire](../doctrine/dict/enums.csv).

La valeur énumérable DOIT exister dans le dictionnaire.

Les énumérations DOIVENT exister dans le dictionnaires, sans exception ni ajout.

### `readOnly`

[Open API Spec](https://spec.openapis.org/oas/v3.2.0.html#validating-readonly-and-writeonly)

Une propriété `readOnly` ne DEVRAIT pas être renseignée par le client et sera ignorée.

Une propriété `readOnly` est toujours déterminée par le serveur (données calculées par ex.).

Une propriété `readOnly` ne DOIT PAS être présent dans le bloc `required`.

## Design

### Convention de nommage des URI

- kebab-case

### Convention de nommage des propriétés

- snake_case

### Polymorphisme

Par convention, tous les champs d'un schéma doivent être renseignées.

Une valeur non applicable dans un sous schéma doit être `null`.

Exemple :

```yaml
type: object
properties:
  foo:
    type: string
    enum: [A, B]
  bar:
    type: [number, "null"]
required:
  - foo
  - bar

oneOf:
  - properties:
      foo: { const: A }
      bar: { type: "null", const: null, default: null }
    required: [foo, bar]
  - properties:
      foo: { const: B }
    required: [foo]

```

### Valeurs inconnues

Une propriété PEUT être inconnue si le producteur est dans l'incapacité d'observer/mesurer/estimer l'information correspondante.

Sur une propriété donnée, `null` ne porte qu'une seule signification. Deux cas se présentent.

#### Cas général — aucune notion de "non applicable" ne s'exprime à ce niveau*

`null` signifie "inconnu".

```yaml
type: object
properties:
  foo:
    type: number
  bar:
    type: [number, "null"]   # "null" = inconnu
required: [foo, bar]
```

#### Cas particulier — la propriété exprime elle-même une existence conditionnelle

`null` est réservé à "absence / non applicable". "Inconnu" s'exprime alors par un objet défini dont toutes les propriétés sont elles-mêmes `null` (récursivement).

```yaml
solaire_thermique:
  oneOf:
    - $ref: "#/$defs/solaire"   # défini = connu (partiellement ou totalement) ou inconnu
    - const: null                 # absence / non applicable
```

Sur `solaire_thermique`, `null` NE signifie PAS "inconnu" : il signifie qu'il n'y a pas d'installation solaire thermique. "Inconnu" se traduit par un `solaire_thermique` défini dont toutes les propriétés valent `null`.
