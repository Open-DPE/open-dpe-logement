# Plan d'amélioration — Règles ECS

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Aligner l'implémentation de `packages/engine/src/rules/ecs` avec la doctrine réglementaire (`doctrine/regles/ecs.yaml`) en corrigeant les écarts de couverture, de nommage et de granularité temporelle.

**Architecture:** Le moteur ECS suit un pattern `formulas → rules → registry` en trois niveaux (générateur, installation, système). La doctrine définit 40+ règles ; l'implémentation actuelle en couvre ~22, manque les variantes mensuelles (`_j`), récupérables et les règles d'énergie finale/primaire/GES. Les problèmes sont indépendants les uns des autres et peuvent être traités en parallèle par tâche.

**Tech Stack:** TypeScript 5, Node.js ≥ 18, Turborepo, `@open-dpe-logement/abaques`, `@open-dpe-logement/models`

---

## Contexte : écarts doctrine ↔ implémentation

### Règles manquantes par module

| Module | Règle doctrine | Règle implémentée | Statut |
|--------|---------------|-------------------|--------|
| `ecs` | `ecs.cef` | — | Manquant |
| `ecs` | `ecs.cep` | — | Manquant |
| `ecs` | `ecs.eges` | — | Manquant |
| `ecs` | `ecs.cef_aux` | — | Manquant |
| `ecs` | `ecs.cep_aux` | — | Manquant |
| `ecs` | `ecs.eges_aux` | — | Manquant |
| `ecs:generateur` | `pertes_generation` | `qgen` (nommage incorrect) | Partiel |
| `ecs:generateur` | `pertes_generation_j` | — | Manquant |
| `ecs:generateur` | `pertes_generation_recuperables` | — | Manquant |
| `ecs:generateur` | `pertes_generation_recuperables_j` | — | Manquant |
| `ecs:generateur` | `pertes_stockage` | `qgw` (nommage incorrect) | Partiel |
| `ecs:generateur` | `pertes_stockage_j` | — | Manquant |
| `ecs:generateur` | `pertes_stockage_recuperables` | — | Manquant |
| `ecs:generateur` | `pertes_stockage_recuperables_j` | — | Manquant |
| `ecs:installation` | `rd` | — (dans systeme uniquement) | Manquant |
| `ecs:installation` | `rg` | — | Manquant |
| `ecs:installation` | `rs` | — | Manquant |
| `ecs:installation` | `rgs` | — | Manquant |
| `ecs:installation` | `iecs` | — | Manquant |
| `ecs:installation` | `pertes_stockage` | — | Manquant |
| `ecs:installation` | `pertes_stockage_j` | — | Manquant |
| `ecs:installation` | `pertes_stockage_recuperables` | — | Manquant |
| `ecs:installation` | `pertes_stockage_recuperables_j` | — | Manquant |
| `ecs:installation` | `pertes_distribution` | `qdw` (nommage incorrect) | Partiel |
| `ecs:installation` | `pertes_distribution_j` | — | Manquant |
| `ecs:installation` | `pertes_distribution_recuperables` | — | Manquant |
| `ecs:installation` | `pertes_distribution_recuperables_j` | — | Manquant |
| `ecs:installation` | `pertes_distribution_ind_vc_j` | `qdw_ind_vc` (annuel, nommage incorrect) | Partiel |
| `ecs:installation` | `pertes_distribution_col_vc_j` | `qdw_col_vc` (annuel, nommage incorrect) | Partiel |
| `ecs:installation` | `pertes_distribution_col_hvc_j` | `qdw_col_hvc` (annuel, nommage incorrect) | Partiel |

### Magic numbers sans référence réglementaire

| Fichier | Valeur | Usage | Référence 3CL requise |
|---------|--------|-------|----------------------|
| `ecs/formulas.ts` | `1.163` | chaleur massique eau (Wh/kg.°C) | Annexe 2, §Besoins ECS |
| `ecs/formulas.ts` | `56` | litres/jour scénario conventionnel | Annexe 2, §Besoins ECS |
| `ecs/formulas.ts` | `79` | litres/jour scénario dépensier | Annexe 2, §Besoins ECS |
| `ecs/formulas.ts` | `40` | température de puisage (°C) | Annexe 2, §Besoins ECS |
| `generateur/formulas.ts` | `8592` | coefficient pertes stockage électrique | Annexe 2, §Pertes stockage |
| `generateur/formulas.ts` | `67662` | coefficient pertes stockage gaz | Annexe 2, §Pertes stockage |
| `generateur/formulas.ts` | `0.55` | exposant loi puissance stockage gaz | Annexe 2, §Pertes stockage |
| `systeme/formulas.ts` | `1790` | coefficient pertes chaudière mixte | Annexe 2, §Rendements |
| `systeme/formulas.ts` | `8592` | coefficient pertes accumulateur gaz | Annexe 2, §Rendements |
| `systeme/formulas.ts` | `6970` | coefficient pertes veilleuse | Annexe 2, §Rendements |
| `systeme/formulas.ts` | `0.324` | exposant rendement circulateur | Annexe 2, §Auxiliaires |
| `systeme/formulas.ts` | `15.3` | diviseur rendement circulateur | Annexe 2, §Auxiliaires |
| `installation/formulas.ts` | `0.112` | ratio pertes distribution collective VC | Annexe 2, §Distribution |
| `installation/formulas.ts` | `0.028` | ratio pertes distribution collective HVC | Annexe 2, §Distribution |
| `installation/formulas.ts` | `0.14` | ratio pertes traceur | Annexe 2, §Auxiliaires |

---

## Fichiers concernés

| Fichier | Action | Raison |
|---------|--------|--------|
| `ecs/registry.ts` | Modifier | Ajouter cef, cep, eges, cef_aux, cep_aux, eges_aux |
| `ecs/rules.ts` | Modifier | Ajouter règles énergie finale/primaire/GES |
| `ecs/formulas.ts` | Modifier | Nommer les constantes 3CL |
| `generateur/registry.ts` | Modifier | Renommer qgw→pertes_stockage, qgen→pertes_generation ; ajouter variantes _j et récupérables |
| `generateur/rules.ts` | Modifier | Aligner sur nouveau registry |
| `generateur/formulas.ts` | Modifier | Décomposer en mensuel, nommer constantes, factoriser rendements |
| `installation/registry.ts` | Modifier | Renommer qdw→pertes_distribution ; ajouter rd, rg, rs, rgs, iecs, pertes_stockage, variantes _j et récupérables |
| `installation/rules.ts` | Modifier | Aligner sur nouveau registry |
| `installation/formulas.ts` | Modifier | Décomposer en mensuel, nommer constantes, ajouter validation division |
| `systeme/registry.ts` | Modifier | Supprimer rd (appartient à installation) |
| `systeme/rules.ts` | Modifier | Déléguer rd à installation |
| `systeme/formulas.ts` | Modifier | Nommer constantes, factoriser rendements combustion |

---

## Tâche 1 : Renommage pour alignement doctrinal

**Objectif :** Aligner les identifiants de règles avec le vocabulaire de `doctrine/regles/ecs.yaml`.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/generateur/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/rules.ts`

### Table de correspondance

| Ancien nom | Nouveau nom | Module |
|------------|-------------|--------|
| `qgw` | `pertes_stockage` | `ecs:generateur` |
| `qgen` | `pertes_generation` | `ecs:generateur` |
| `qdw` | `pertes_distribution` | `ecs:installation` |
| `qdw_ind_vc` | `pertes_distribution_ind_vc` | `ecs:installation` |
| `qdw_col_vc` | `pertes_distribution_col_vc` | `ecs:installation` |
| `qdw_col_hvc` | `pertes_distribution_col_hvc` | `ecs:installation` |

- [ ] **Étape 1 :** Mettre à jour les clés du `RULES` object dans `generateur/registry.ts` selon la table ci-dessus
- [ ] **Étape 2 :** Mettre à jour les clés du `RULES` object dans `installation/registry.ts`
- [ ] **Étape 3 :** Mettre à jour les appels à `RULES.*` dans `generateur/rules.ts`
- [ ] **Étape 4 :** Mettre à jour les appels à `RULES.*` dans `installation/rules.ts`
- [ ] **Étape 5 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 6 :** Vérifier que tous les consumers de ces règles sont mis à jour (grep `RULES.qgw`, `RULES.qgen`, `RULES.qdw` dans `packages/`)
- [ ] **Étape 7 :** Commit — `refactor(engine/ecs): aligner nommage règles avec doctrine`

---

## Tâche 2 : Nommage des constantes 3CL

**Objectif :** Éliminer les magic numbers en nommant chaque constante avec sa source réglementaire.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/systeme/formulas.ts`
- Créer : `packages/engine/src/rules/ecs/constants.ts`

**Approche :** Créer un fichier `constants.ts` dédié dans `packages/engine/src/rules/ecs/`. Chaque constante est exportée avec un nom descriptif en snake_case et un commentaire indiquant son origine dans le corpus 3CL (annexe et section).

### Constantes à extraire

| Constante | Valeur | Nom suggéré |
|-----------|--------|-------------|
| Chaleur massique eau | `1.163` | `CHALEUR_MASSIQUE_EAU_WH_KG_C` |
| Litres/jour conventionnel | `56` | `CONSOMMATION_JOURNALIERE_CONVENTIONNELLE_L` |
| Litres/jour dépensier | `79` | `CONSOMMATION_JOURNALIERE_DEPENSIERE_L` |
| Température de puisage | `40` | `TEMPERATURE_PUISAGE_C` |
| Coeff. stockage élec | `8592` | `COEFF_PERTES_STOCKAGE_ELECTRIQUE` |
| Coeff. stockage gaz | `67662` | `COEFF_PERTES_STOCKAGE_GAZ` |
| Exposant stockage gaz | `0.55` | `EXPOSANT_PERTES_STOCKAGE_GAZ` |
| Coeff. chaudière mixte | `1790` | `COEFF_PERTES_CHAUDIERE_MIXTE` |
| Coeff. accumulateur gaz | `8592` | `COEFF_PERTES_ACCUMULATEUR_GAZ` |
| Coeff. veilleuse | `6970` | `COEFF_PERTES_VEILLEUSE` |
| Exposant rendement circulateur | `0.324` | `EXPOSANT_RENDEMENT_CIRCULATEUR` |
| Diviseur rendement circulateur | `15.3` | `DIVISEUR_RENDEMENT_CIRCULATEUR` |
| Ratio pertes distrib. col. VC | `0.112` | `RATIO_PERTES_DISTRIBUTION_COL_VC` |
| Ratio pertes distrib. col. HVC | `0.028` | `RATIO_PERTES_DISTRIBUTION_COL_HVC` |
| Ratio pertes traceur | `0.14` | `RATIO_PERTES_TRACEUR` |

- [ ] **Étape 1 :** Créer `packages/engine/src/rules/ecs/constants.ts` avec toutes les constantes ci-dessus, chacune commentée avec sa référence dans le corpus
- [ ] **Étape 2 :** Remplacer les valeurs littérales dans `ecs/formulas.ts` par les imports de `constants.ts`
- [ ] **Étape 3 :** Remplacer dans `generateur/formulas.ts`
- [ ] **Étape 4 :** Remplacer dans `installation/formulas.ts`
- [ ] **Étape 5 :** Remplacer dans `systeme/formulas.ts`
- [ ] **Étape 6 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 7 :** Commit — `refactor(engine/ecs): extraire constantes 3CL nommées`

---

## Tâche 3 : Granularité mensuelle des pertes

**Objectif :** Implémenter les variantes `_j` (mensuelles) pour les pertes de génération, de stockage et de distribution, telles que définies dans `doctrine/regles/ecs.yaml`.

**Contexte :** La doctrine définit des pertes mensuelles distinctes des pertes annuelles. Les pertes récupérables (T4) en dépendent. Elles sont actuellement calculées en annuel uniquement, ce qui empêche le calcul des `_recuperables` et affecte les bilans thermiques du chauffage.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/generateur/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/formulas.ts`

### Règles mensuelles à implémenter

| Règle | Module | Dépendances |
|-------|--------|-------------|
| `pertes_generation_j` | `ecs:generateur` | `climat:nref_ch`, `ecs.generateur.rdim`, `qp0` |
| `pertes_stockage_j` | `ecs:generateur` | `climat:nref_ch`, `ecs.generateur.rdim`, `cr`, volume |
| `pertes_distribution_ind_vc_j` | `ecs:installation` | `ecs.becs_j`, `ecs.installation.rdim` |
| `pertes_distribution_col_vc_j` | `ecs:installation` | `ecs.becs_j`, `ecs.installation.rdim` |
| `pertes_distribution_col_hvc_j` | `ecs:installation` | `ecs.becs_j`, `ecs.installation.rdim` |
| `pertes_stockage_j` (installation) | `ecs:installation` | `climat:nref_ch` |

**Note sur les formules :** Pour les pertes mensuelles de génération, la doctrine applique un coefficient proportionnel à `nref_ch_j` (nombre de jours de référence chauffage du mois) pour les pertes hors saison de chauffe. Pour les pertes de distribution, les formules sont les mêmes qu'en annuel mais appliquées à `becs_j` (besoins mensuels) au lieu de `becs` (besoins annuels).

- [ ] **Étape 1 :** Ajouter `pertes_stockage_j` et `pertes_generation_j` au `RULES` de `generateur/registry.ts`
- [ ] **Étape 2 :** Ajouter les formules mensuelles correspondantes dans `generateur/formulas.ts` (paramètre `ParMois` pour `nref_ch`)
- [ ] **Étape 3 :** Ajouter les règles de résolution dans `generateur/rules.ts`
- [ ] **Étape 4 :** Transformer `pertes_distribution_ind_vc_j`, `pertes_distribution_col_vc_j`, `pertes_distribution_col_hvc_j` dans `installation/formulas.ts` pour qu'ils travaillent sur `becs_j` (mensuel) et non `becs` annuel réduit
- [ ] **Étape 5 :** Mettre à jour `installation/registry.ts` et `installation/rules.ts`
- [ ] **Étape 6 :** Les règles annuelles (`pertes_stockage`, `pertes_generation`, `pertes_distribution`) deviennent des agrégations via `reduceParMois` de leur variante `_j`
- [ ] **Étape 7 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 8 :** Commit — `feat(engine/ecs): ajouter variantes mensuelles des pertes`

---

## Tâche 4 : Pertes récupérables

**Objectif :** Implémenter les règles `_recuperables` et `_recuperables_j` définies dans `doctrine/regles/ecs.yaml`.

**Contexte :** Les pertes récupérables sont la fraction des pertes ECS (génération, stockage, distribution) qui contribuent aux apports thermiques internes du bâtiment pendant la saison de chauffe. Elles dépendent de `climat:nref_ch` (jours de référence chauffage) et entrent dans le calcul des besoins de chauffage.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/generateur/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/formulas.ts`

### Règles récupérables à implémenter

| Règle mensuelle | Règle annuelle | Dépendances clés |
|----------------|----------------|-----------------|
| `pertes_generation_recuperables_j` | `pertes_generation_recuperables` | `pertes_generation_j`, `climat:nref_ch` |
| `pertes_stockage_recuperables_j` (generateur) | `pertes_stockage_recuperables` | `pertes_stockage_j`, `climat:nref_ch` |
| `pertes_distribution_recuperables_j` | `pertes_distribution_recuperables` | `pertes_distribution_j`, `climat:nref_ch` |
| `pertes_stockage_recuperables_j` (installation) | `pertes_stockage_recuperables` | `pertes_stockage_j`, `climat:nref_ch` |

**Note sur les formules :** La fraction récupérable est déterminée par le rapport `nref_ch_j / nj` pour chaque mois (ratio jours de chauffe sur jours totaux du mois). La récupération ne s'applique qu'en période de chauffage.

- [ ] **Étape 1 :** Ajouter les clés `pertes_*_recuperables` et `pertes_*_recuperables_j` dans `generateur/registry.ts`
- [ ] **Étape 2 :** Implémenter les formules récupérables dans `generateur/formulas.ts`
- [ ] **Étape 3 :** Ajouter les règles de résolution dans `generateur/rules.ts`
- [ ] **Étape 4 :** Répéter pour `installation/registry.ts`, `installation/formulas.ts`, `installation/rules.ts`
- [ ] **Étape 5 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 6 :** Commit — `feat(engine/ecs): ajouter pertes récupérables génération, stockage, distribution`

---

## Tâche 5 : Rendements au niveau installation

**Objectif :** Implémenter les règles `rd`, `rg`, `rs`, `rgs`, `iecs` dans `ecs:installation`, actuellement absentes ou mal placées (rd est dans `ecs:systeme`).

**Contexte :** La doctrine distingue les rendements **au niveau de l'installation** (agrégation sur les générateurs et installations) des rendements **au niveau du système**. Actuellement, `rd` est calculé dans `ecs:systeme` et `rg`/`rs`/`rgs` ne sont calculés qu'implicitement dans `systeme/formulas.ts`. Cette ambiguïté rend difficile le calcul de `iecs` indépendamment du système.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/installation/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/installation/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/systeme/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/systeme/rules.ts`

### Règles rendements installation

| Règle | Formule doctrine | Dépendances |
|-------|-----------------|-------------|
| `rd` | Abaque `abaques.ecs.rd` | installation_collective, bouclage, alimentation_contigue, prod_volume_chauffe |
| `rg` | Voir §Rendements 3CL | becs, rpn, qp0, pveilleuse |
| `rs` | Voir §Rendements 3CL | becs, qgw, rd |
| `rgs` | Voir §Rendements 3CL | cop, rpn, qp0, pveilleuse, qgw |
| `iecs` | `rd × rg × rs × rgs` | rd, rg, rs, rgs |

- [ ] **Étape 1 :** Déplacer `rd` de `systeme/registry.ts` vers `installation/registry.ts`
- [ ] **Étape 2 :** Déplacer la logique de calcul `rd` de `systeme/rules.ts` vers `installation/rules.ts`
- [ ] **Étape 3 :** Ajouter `rg`, `rs`, `rgs`, `iecs` dans `installation/registry.ts`
- [ ] **Étape 4 :** Extraire les formules de rendement des fonctions privées de `systeme/formulas.ts` vers des fonctions exportées dans `installation/formulas.ts`
- [ ] **Étape 5 :** Mettre à jour `systeme/rules.ts` pour résoudre `rd`, `rg`, `rs`, `rgs` depuis `ecs:installation` (via `ctx.resolve`)
- [ ] **Étape 6 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 7 :** Commit — `refactor(engine/ecs): déplacer rendements vers ecs:installation`

---

## Tâche 6 : Énergie finale, primaire et GES

**Objectif :** Implémenter les règles `cef`, `cep`, `eges` et leurs variantes auxiliaires au niveau `ecs`.

**Contexte :** Ces règles sont les sorties finales du module ECS. Elles nécessitent les facteurs de conversion énergétique par vecteur (facteurs ep et GES) présents dans `@open-dpe-logement/models` ou `@open-dpe-logement/abaques`. Vérifier leur disponibilité avant d'implémenter.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/registry.ts`
- Modifier : `packages/engine/src/rules/ecs/rules.ts`
- Modifier : `packages/engine/src/rules/ecs/formulas.ts`

### Règles à implémenter

| Règle | Formule | Dépendances |
|-------|---------|-------------|
| `cef` | Somme `cecs` sur les générateurs | `ecs:systeme.cecs` par générateur |
| `cep` | `cef × facteur_ep(energie)` | `cef`, facteur énergie primaire |
| `eges` | `cef × facteur_co2(energie)` | `cef`, facteur émissions GES |
| `cef_aux` | Somme `caux` sur les générateurs + distributions | `ecs.caux_gen`, `ecs.caux_dist` |
| `cep_aux` | `cef_aux × facteur_ep(energie_aux)` | `cef_aux` |
| `eges_aux` | `cef_aux × facteur_co2(energie_aux)` | `cef_aux` |

**Prérequis :** Vérifier la disponibilité des facteurs de conversion dans `@open-dpe-logement/models` (enum `Energie`) ou dans un abaque dédié. Si absents, créer un abaque `doctrine/abaques/energie/facteurs.csv` avant d'implémenter.

- [ ] **Étape 1 :** Vérifier la disponibilité des facteurs ep et GES dans `packages/models/` et `doctrine/abaques/`
- [ ] **Étape 2 :** Si absent, créer `doctrine/abaques/energie/facteurs.csv` avec les valeurs réglementaires (Tableau 11 3CL-DPE 2021)
- [ ] **Étape 3 :** Ajouter `cef`, `cep`, `eges`, `cef_aux`, `cep_aux`, `eges_aux` dans `ecs/registry.ts`
- [ ] **Étape 4 :** Implémenter les formules dans `ecs/formulas.ts`
- [ ] **Étape 5 :** Implémenter les règles de résolution dans `ecs/rules.ts`
- [ ] **Étape 6 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 7 :** Commit — `feat(engine/ecs): ajouter règles énergie finale, primaire et GES`

---

## Tâche 7 : Validation des entrées critiques

**Objectif :** Ajouter des guards sur les divisions et les valeurs non bornées pour éviter les NaN/Infinity silencieux.

**Fichiers :**
- Modifier : `packages/engine/src/rules/ecs/installation/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/generateur/formulas.ts`
- Modifier : `packages/engine/src/rules/ecs/formulas.ts`

### Cas critiques sans validation

| Fichier | Ligne aprox. | Cas | Risque actuel |
|---------|-------------|-----|---------------|
| `installation/formulas.ts` | `calcule_rdim` | `surface_installations === 0` | Division par zéro → `Infinity` |
| `generateur/formulas.ts` | `calcule_pecs` | `volume_stockage < 0` | Formule incorrecte silencieuse |
| `systeme/formulas.ts` | `calcule_qcirb` | `niveaux === 0` | Division par zéro dans `lb` |
| `ecs/formulas.ts` | `calcule_nadeq` | `logements === 0` | Résultat zéro sans signal |

**Approche :** Utiliser `ValeurForfaitaireError` (déjà présent dans le projet) pour signaler les cas de données manquantes, et lever des erreurs explicites pour les cas impossible (volume < 0, niveaux <= 0).

- [ ] **Étape 1 :** Ajouter un guard `surface_installations === 0` dans `calcule_rdim` de `installation/formulas.ts`
- [ ] **Étape 2 :** Ajouter un guard `volume_stockage < 0` dans `calcule_pecs` de `generateur/formulas.ts`
- [ ] **Étape 3 :** Ajouter un guard `niveaux <= 0` dans `calcule_qcirb` de `systeme/formulas.ts`
- [ ] **Étape 4 :** Ajouter un guard `logements === 0` dans `calcule_nadeq` de `ecs/formulas.ts`
- [ ] **Étape 5 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 6 :** Commit — `fix(engine/ecs): ajouter validation entrées critiques`

---

## Tâche 8 : Factorisation des rendements combustion

**Objectif :** Éliminer la duplication entre `calcule_rendements_chaudiere_mixte` et `calcule_rendements_accumulateur_gaz`.

**Contexte :** Ces deux fonctions dans `systeme/formulas.ts` diffèrent uniquement par un coefficient (`1790` vs `8592`). Elles partagent la même structure : `rgs = 1 / (1/rpn + (K×qp0 + qgw)/becs + 6970×(C×pveilleuse/becs))` avec des valeurs K et C différentes.

**Fichier :**
- Modifier : `packages/engine/src/rules/ecs/systeme/formulas.ts`

- [ ] **Étape 1 :** Extraire une fonction privée commune `calcule_rgs_combustion(rpn, qp0, qgw, pveilleuse, becs, coeff_qp0, coeff_pveilleuse)` dans `systeme/formulas.ts`
- [ ] **Étape 2 :** Réécrire `calcule_rendements_chaudiere_mixte` pour appeler cette fonction avec `coeff_qp0 = COEFF_PERTES_CHAUDIERE_MIXTE` et `coeff_pveilleuse = 0.5`
- [ ] **Étape 3 :** Réécrire `calcule_rendements_accumulateur_gaz` pour appeler cette fonction avec `coeff_qp0 = COEFF_PERTES_ACCUMULATEUR_GAZ` et `coeff_pveilleuse = 1`
- [ ] **Étape 4 :** Vérifier la compilation — `npm run check-types --filter=@open-dpe-logement/engine`
- [ ] **Étape 5 :** Commit — `refactor(engine/ecs): factoriser calcul rgs combustion`

---

## Tâche 9 : Tests unitaires des formulas

**Objectif :** Créer une couverture de test minimale sur les formules pures (couche `formulas.ts`) pour prévenir les régressions lors des refactorisations précédentes.

**Contexte :** Aucun test n'existe dans `packages/engine/`. Vérifier la configuration de test dans `packages/engine/tsconfig.test.json` et le `package.json` pour identifier le runner (vitest ou jest).

**Fichiers :**
- Créer : `packages/engine/src/rules/ecs/formulas.test.ts`
- Créer : `packages/engine/src/rules/ecs/generateur/formulas.test.ts`
- Créer : `packages/engine/src/rules/ecs/installation/formulas.test.ts`
- Créer : `packages/engine/src/rules/ecs/systeme/formulas.test.ts`

### Cas de test prioritaires

| Formule | Cas nominal | Cas limite |
|---------|-------------|------------|
| `calcule_nmax` (maison) | `sh=50` → `nmax=1.75-0.01875×20=1.375` | `sh=0` → `nmax=1` |
| `calcule_nmax` (immeuble) | `sh=30` → `nmax=1.75-0.01875×20=1.375` | `sh=0` → `nmax=1` |
| `calcule_nadeq` | `nmax=2, logements=10` → `nadeq=10×(1.75+0.3×0.25)` | `nmax=1, logements=5` → `nadeq=5` |
| `calcule_becs` (conventionnel) | Valeurs tefs et nj connus | `tefs=40` → `becs=0` |
| `calcule_pecs` | `volume=0` → `pecs=21` ; `volume=100` | `volume<0` → erreur |
| `calcule_qgw` | `volume=0` → `qgw=0` ; électrique vs gaz | — |
| `calcule_rdim` | `surface_inst=20, total=100` → `rdim=0.2` | `total=0` → erreur |

- [ ] **Étape 1 :** Vérifier le runner de test dans `packages/engine/package.json`
- [ ] **Étape 2 :** Créer `ecs/formulas.test.ts` avec tests de `calcule_nmax`, `calcule_nadeq`, `calcule_becs`
- [ ] **Étape 3 :** Créer `generateur/formulas.test.ts` avec tests de `calcule_pecs`, `calcule_qgw`, `calcule_pdim`
- [ ] **Étape 4 :** Créer `installation/formulas.test.ts` avec tests de `calcule_rdim`, pertes distribution
- [ ] **Étape 5 :** Créer `systeme/formulas.test.ts` avec tests des rendements (chaudière mixte, accumulateur, thermodynamique, électrique)
- [ ] **Étape 6 :** Lancer les tests — `npm run test --filter=@open-dpe-logement/engine`
- [ ] **Étape 7 :** Commit — `test(engine/ecs): ajouter tests unitaires formulas`

---

## Ordre d'exécution recommandé

Les tâches **1, 2, 7, 8** sont indépendantes et peuvent être exécutées en parallèle. Les tâches **3, 4** dépendent du renommage (Tâche 1). La Tâche **5** dépend des Tâches **3 et 4**. La Tâche **6** dépend de la Tâche **5**. La Tâche **9** peut être démarrée à tout moment mais apporte plus de valeur après les Tâches 1-5.

```
T1 (nommage) ──┬──> T3 (mensuel) ──> T4 (récupérables) ──> T5 (rendements installation) ──> T6 (cef/cep/eges)
T2 (constantes)┘
T7 (validation)   [indépendant]
T8 (factorisation)[indépendant]
T9 (tests)        [après T1-T5 idéalement]
```

## Priorités

| Priorité | Tâche | Impact |
|----------|-------|--------|
| P1 | T1 — Renommage doctrinal | Correctif : traçabilité règle ↔ doctrine |
| P1 | T3 — Granularité mensuelle | Correctif : les bilans chauffage utilisent les pertes récupérables |
| P1 | T4 — Pertes récupérables | Correctif : manque actuel affecte le calcul des besoins de chauffage |
| P2 | T5 — Rendements installation | Amélioration : cohérence architecturale |
| P2 | T2 — Constantes nommées | Amélioration : lisibilité et auditabilité |
| P2 | T9 — Tests | Amélioration : prévention régressions |
| P3 | T6 — CEF/CEP/GES | Complétude : sorties finales du module |
| P3 | T7 — Validation | Robustesse |
| P3 | T8 — Factorisation | Qualité de code |
