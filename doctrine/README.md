# Doctrine

## Organisation

```text
doctrine/
├── corpus/                     # Textes réglementaires
├── dict/                       # Dictionnaire
├── extras/                     # Doctrine extra-réglementaire
└── formules/                   # Formules de calcul
```

## [Corpus](./corpus/)

La documentation présente dans le corpus est la source de vérité unique applicable à l'ensemble du projet.

Le corpus peut être étendu ou corrigé par une [doctrine extra-réglementaire](#doctrine-extra-réglementaire).

## [Dictionnaire](./dict/)

Le dictionnaire détermine un vocabulaire commun pour l'ensemble du projet.

### Valeurs énumérables et énumérations

Une valeur énumérable, ou enum, est une liste fermée d'énumérations.

La liste des valeurs énumérables et des énumérations associées est accessible dans le fichier [enums.csv](./dict/enums.csv).

#### Identifiant

Une valeur énumérable est identifiée par un ID unique au format `^([a-z-]+:)*([a-z-]+)$`.

Une énumération est décrite au format `^[a-zA-Z0-9-]+$`.

Une énumération est identifiée par un ID unique au format `<enum>:<enumeration>`.

#### Références

Toutes les références à une valeur énumérable dans le projet (abaques, extras, schemas) doivent être identifiables dans le dictionnaire.

Par convention, une référence est identifiée par la notation `enum(enum-id)` ou `enum(enumeration-id)` pour cibler une énumération précise.

## [Fomrules de calcul 3CL-DPE](./formules/)

Inventaire YAML des formules de calcul issues de la méthode 3CL-DPE 2021 à implémenter par un moteur de calcul.

Les formules de calcul sont regroupés par domaine (chauffage, ecs, éclairage...) et respectent le format suivant :

```yaml
path.to.rule:
    id: path.to.rule
    description: Description de la formules
    type: Type de valeur calculée
    unite: Unité de la valeur calculée
    references: Références réglementaires
    issues: Liste des issues associées
    dependances: Dépendances à d'autres formules de calcul
```

## [Doctrine extra-réglementaire](./extras/)

Le corpus extra-réglementaire est une extension communautaire de la méthode de calcul 3CL-DPE 2021 proposant les correctifs et améliorations utiles à sa stabilisation.
