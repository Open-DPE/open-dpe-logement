## 11 Calcul de la consommation d'ECS (Cecs)

---

**Données d'entrée :**

Température d'eau froide

Type de bâtiment

Surface habitable

Nombre de logements d'un immeuble collectif

---

### 11.1 Calcul du besoin d'ECS

Les besoins journaliers moyens par personne (adulte équivalent) sur une année sont en moyenne de 56 ± 23 litres à 40°C. Le scénario d'utilisation conventionnel du DPE s'appuie sur un comportement conventionnel, qui correspond à une consommation de 56 l/j.pers d'eau chaude à 40°C, contre 79 l/j.pers pour un comportement dépensier. Cela correspond environ à une variation du besoin de +40% entre le profil conventionnel de consommation et le profil dépensier.

On considère conventionnellement que le logement est inoccupé 7 jours par an (du 24 au 30 décembre inclus).

Pour les logements individuels et les logements collectifs, le nombre d'adultes équivalent est déterminé selon le coefficient d'occupation maximal ($Nmax$) de la façon suivante :

La quantité de chaleur $Becs_j$ (Wh) nécessaire sur le mois j pour préparer l'eau chaude sanitaire est obtenue selon la formule suivante :

- Pour un comportement conventionnel :

$$Becs_j = 1.163 * Nadeq * 56 * (40 - Tefs_j) * njj$$

- Pour un comportement dépensier :

$$Becs_j = 1.163 * Nadeq * 79 * (40 - Tefs_j) * njj$$

Avec :

- $Tefs\_j$ : température moyenne d'eau froide sanitaire sur le mois j (°C). La température d'eau froide est une donnée climatique mensuelle pour chacune des 8 zones climatiques (voir parties 18.2 et 18.3)
- $njj$ : nombre de jours d'occupation sur le mois j :

|   Mois    | $njj$ |
| :-------: | :---: |
|  Janvier  |  31   |
|  Février  |  28   |
|   Mars    |  31   |
|   Avril   |  30   |
|    Mai    |  31   |
|   Juin    |  30   |
|  Juillet  |  31   |
|   Août    |  31   |
| Septembre |  30   |
|  Octobre  |  31   |
| Novembre  |  30   |
| Décembre* |  24   |

*Dans l'approche conventionnelle, une absence d'une semaine est comptée en décembre.

Le besoin annuel d'eau chaude sanitaire $Becs$ est la somme des besoins mensuels d'ECS (Wh) :

$$Becs = \sum_j Becs_j$$

#### Logements individuels

On définit la surface habitable moyenne d'un logement (m²) comme suit :

$$Sh_{moy} = \frac{Sh}{Nblgt}$$

Avec :

- $Sh$ : surface habitable totale de la maison individuelle (m²)
- $Nblgt$ : nombre de logements (= 1 pour le traitement d'une maison individuelle contenant un seul logement)

- Calcul du coefficient d'occupation maximal $Nmax$ :

Si $Sh_{moy} < 30$ m² :

$$Nmax = 1$$

Si $30 \text{ m²} \leq Sh_{moy} < 70$ m² :

$$Nmax = 1.75 - 0.01875 * (70 - Sh_{moy})$$

Si $Sh_{moy} \geq 70$ m² :

$$Nmax = 0.025 * Sh_{moy}$$

**Calcul du nombre d'adultes équivalent $Nadeq$ :**

Si $Nmax < 1.75$ :

$$Nadeq = Nblgt * Nmax$$

Si $Nmax \geq 1.75$ :

$$Nadeq = Nblgt * (1.75 + 0.3 * (Nmax - 1.75))$$

Avec :

- $Nblgt$ : nombre de logements

#### Logements collectifs

On définit la surface habitable moyenne d'un logement (m²) comme suit :

$$Sh_{moy} = \frac{Sh}{Nblgt}$$

Avec :

- $Sh$ : surface habitable totale de l'immeuble (m²)
- $Nblgt$ : nombre de logements (= 1 pour le traitement d'un appartement)

Cette surface moyenne permet de déterminer le $Nmax$ pour un logement moyen :

Si $Sh_{moy} < 10$ m² :

$$Nmax = 1$$

Si $10 \text{ m²} \leq Sh_{moy} < 50$ m² :

$$Nmax = 1.75 - 0.01875 * (50 - Sh_{moy})$$

Si $Sh_{moy} \geq 50$ m² :

$$Nmax = 0.035 * Sh_{moy}$$

**Calcul du nombre d'adultes équivalent $Nadeq$ :**

Si $Nmax < 1.75$ :

$$Nadeq = Nblgt * Nmax$$

Si $Nmax \geq 1.75$ :

$$Nadeq = Nblgt * (1.75 + 0.3 * (Nmax - 1.75))$$

### 11.2 Calcul des consommations d'ECS

---

**Données d'entrée :**

Rendement de génération : $Rg$ (sans dimension)

Rendement de distribution : $Rd$ (sans dimension)

Rendement de stockage : $Rs$ (sans dimension)

Type d'installation d'ECS : avec ou sans solaire ; base + appoint…

Puissance nominale des générateurs : $Pn$ (W)

---

La consommation annuelle d'eau chaude sanitaire $Cecs$ (kWh PCI) s'exprime de la manière suivante :

$$Cecs = Becs * Iecs$$

Avec :

- $Becs$ : besoin annuel d'ECS (kWh)
- $Iecs$ : inverse du rendement de l'installation :

$$Iecs = \frac{1}{Rs * Rd * Rg}$$

- $Rs$ : rendement de stockage
- $Rd$ : rendement de distribution
- $Rg$ : rendement de génération

La consommation d'ECS sur un mois j peut être déduite de la consommation annuelle :

$$Cecs_j = \frac{Becs_j}{Becs} * Cecs$$

### 11.3 Un seul système d'ECS avec solaire

Dans le cas où un seul système de production d'ECS solaire est installé, la consommation d'ECS $Cecs$ (kWh PCI) s'exprime de la manière suivante :

$$Cecs = Becs * (1 - Fecs) * Iecs$$

Avec :

- $Becs$ : besoin en eau chaude sanitaire (kWh)
- $Fecs$ : facteur de couverture solaire, déterminé à partir du tableau du paragraphe 18.4
- $Iecs$ : inverse du produit des rendements

La production d'ECS solaire $Prodecs\_solaire$ (kWh PCI) s'écrit alors :

$$Prodecs\_solaire = Becs * Fecs * Iecs$$

### 11.4 Plusieurs systèmes d'ECS (limité à 2 systèmes différents par logement)

Dans le cas où plusieurs systèmes sont installés, on reprendra le raisonnement avec :

$$Cecs_1 = 0.5 * Becs * Iecs_1 \qquad Cecs_2 = 0.5 * Becs * Iecs_2$$

### 11.5 Rendement de distribution de l'ECS

---

**Données d'entrée secondaires :**

Type d'installation

Localisation de la production

Configuration des logements

Isolation du réseau collectif

---

Les rendements de distribution sont donnés pour une année complète.

#### 11.5.1 Installation individuelle

| Production en volume habitable | Production hors volume habitable |       |
| :----------------------------: | :------------------------------: | :---: |
|  Pièces alimentées contiguës   | Pièces alimentées non contiguës  |       |
|              0,93              |               0,87               | 0,83  |

Les pièces considérées sont les salles de bain et les cuisines. S'il existe plusieurs salles de bain en plus de la cuisine, il faut vérifier leur contigüité verticale ou horizontale.

Les pièces alimentées sont considérées contiguës lorsqu'elles ont une paroi mitoyenne (mur, plafond, plancher).

#### 11.5.2 Installation collective

| Rendement de distribution $Rd$      | Pièces alimentées contiguës | Pièces alimentées non contiguës |
| :---------------------------------- | :-------------------------: | :-----------------------------: |
| Réseau collectif non isolé          |            0,28             |              0,26               |
| Réseau collectif isolé sans traçage |            0,55             |              0,52               |
| Réseau collectif isolé avec traçage |            0,83             |                                 |

### 11.6 Rendement de stockage de l'ECS

---

**Données d'entrée secondaires :**

Volume des ballons

Type de ballon

Catégorie des ballons

Type d'alimentation du ballon

---

L'ensemble de ce paragraphe ne s'applique pas aux chauffe-eau thermodynamiques, traités en partie 14.2.

Le rendement de stockage est calculé annuellement.

S'il n'y a pas de stockage : $Qg.w = 0$

#### 11.6.1 Pertes de stockage des ballons d'accumulation

La présence d'un ballon de préparation de l'ECS est responsable de pertes de stockage $Qg.w$ (Wh) :

$$Qg.w = 67662 * Vs^{0.55}$$

Avec :

- $Vs$ : volume du ballon de stockage (litres)

#### 11.6.2 Pertes des ballons électriques

Les pertes de stockage des ballons électriques (Wh) sont données par la relation suivante :

$$Qg.w = 8592 * \frac{45}{24} * Vs * Cr$$

Avec :

- $Vs$ : volume du ballon de stockage (litres)
- $Cr$ : coefficient de perte du ballon de stockage (Wh/l.°C.jour) :

|                        |                          | Volume du ballon (litres) |                  |                  |         |
| :--------------------- | :----------------------- | :-----------------------: | :--------------: | :--------------: | :-----: |
|                        |                          |        $\leq 100$         | $100 < \leq 200$ | $200 < \leq 300$ | $> 300$ |
| Chauffe-eau horizontal |                          |           0,39            |       0,33       |       0,30       |  0,30   |
| Chauffe-eau vertical   | Autres ou inconnue       |           0,32            |       0,23       |       0,22       |  0,22   |
|                        | Catégorie B ou 2 étoiles |           0,27            |       0,22       |       0,20       |  0,18   |
|                        | Catégorie C ou 3 étoiles |           0,25            |       0,20       |       0,18       |  0,16   |

#### 11.6.3 Rendement de stockage

- Pour les ballons électriques verticaux de catégorie C ou 3* :

$$Rs = \frac{1.08}{1 + \dfrac{Qg.w * Rd}{Becs}}$$

- Pour les autres ballons électriques :

$$Rs = \frac{1}{1 + \dfrac{Qg.w * Rd}{Becs}}$$

Avec :

- $Qg.w$ : pertes de stockage (Wh)
- $Rd$ : rendement de distribution
- $Becs$ : besoin annuel d'ECS (Wh)
