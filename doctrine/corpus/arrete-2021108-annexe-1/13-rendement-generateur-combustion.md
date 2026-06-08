## 13 Rendement de génération des générateurs à combustion

### 13.1 Inserts et poêles

---

**Données d'entrée :**

Type de générateur

Type de cascade

Présence d'une régulation

Type d'émetteur

Type de combustible bois

---

| Type de générateur                                                                             | $Rg$  |
| :--------------------------------------------------------------------------------------------- | :---: |
| Cuisinière, Foyer fermé, Poêle bûche, insert installé avant 1990                               | 0,50  |
| Cuisinière, Foyer fermé, Poêle bûche, insert installé entre 1990 et 2004                       | 0,60  |
| Cuisinière, Foyer fermé, Poêle bûche, insert installé à partir de 2005 sans label flamme verte | 0,65  |
| Cuisinière, Foyer fermé, Poêle bûche, insert installé de 2005 à 2006 avec label flamme verte   | 0,65  |
| Cuisinière, Foyer fermé, Poêle bûche, insert installé de 2007 à 2017 avec label flamme verte   | 0,70  |
| Cuisinière, Foyer fermé, Poêle bûche, insert installé à partir de 2018 avec label flamme verte | 0,75  |
| Poêle à granulés installé avant 2012 ou sans label flamme verte                                | 0,80  |
| Poêle à granulés flamme verte installé entre 2012 et 2019                                      | 0,85  |
| Poêle à granulés flamme verte installé à partir de 2020                                        | 0,87  |
| Poêle fioul, GPL ou charbon                                                                    | 0,72  |

Les poêles à bois bouilleur installés à partir de 2012 sont traités comme des chaudières bois installées entre 2004 et 2012.

Les poêles à bois bouilleur installés avant 2012 sont traités comme des chaudières bois installées entre 1978 et 1994.

### 13.2 Chaudières et autres générateurs à combustion

---

**Données d'entrée :**

Type de générateur

Nombre de générateurs

Département

Type de cascade

Puissance nominale générateur (W)

Présence d'une régulation

Type d'émetteur

Année d'installation des émetteurs

Type de combustible bois

Rendement à pleine charge

Rendement à charge intermédiaire

Type de brûleur

---

Pour les générateurs à combustion, le calcul du rendement conventionnel annuel moyen pour un générateur donné est basé sur la prise en compte de valeurs conventionnelles de profils de charge.

#### 13.2.1 Profil de charge des générateurs

Le profil de charge conventionnel donne pour chaque intervalle de taux de charge le coefficient de pondération correspondant.

##### 13.2.1.1 Profil de charge conventionnel

Pour les bâtiments d'habitation, un profil de charge long est considéré (correspond au type d'horaire d'occupation longue).

Le tableau suivant donne le coefficient de pondération pour un profil de charge correspondant à une occupation longue (ex. : logement).

|        Taux de charge $Tch_x$         | 0–10% | 10–20% | 20–30% | 30–40% | 40–50% | 50–60% | 60–70% | 70–80% | 80–90% | 90–100% |
| :-----------------------------------: | :---: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :----: | :-----: |
| Coeff. de pondération $coeff\_pond_x$ |  0,1  |  0,25  |  0,2   |  0,15  |  0,1   |  0,1   |  0,05  | 0,025  | 0,025  |    0    |

Ce profil de charge est donné sur une période de chauffe et non mensuellement. Le calcul du rendement de génération se fera donc sur toute la saison de chauffe et non mensuellement.

Pour les calculs, les taux de charge sont pris en milieu de classe (5% ; 15% ; 25% ; … ; 85% ; 95%).

Le coefficient de pondération $Coeff\_pond_x$ est associé au taux de charge $Tch_x$ qui correspond à l'intervalle $[Tch_x - 5\% \;;\; Tch_x + 5\%[$.

##### 13.2.1.2 Présence d'un ou plusieurs générateurs à combustion indépendants

Nous considérerons la présence dans la zone au maximum de N générateurs à combustion indépendants.

Les taux de charge doivent être pondérés par un coefficient $Cdimref$ qui permet de prendre en compte les charges partielles.

- Pour un seul générateur à combustion de puissance installée $Pngen$ :

$$Cdimref = \frac{1000 * Pngen}{GV * (Tcons - Tbase)}$$

- Pour N générateurs à combustion :

$$Cdimref = \frac{1000 * (Pngen_1 + Pngen_2 + \cdots + Pngen_N)}{GV * (Tcons - Tbase)}$$

Avec :

- $Pngen\_i$ : puissance installée du générateur à combustion i (kW)
- $GV$ : déperditions totales du bâtiment (W/K)
- $Tbase$ : température extérieure de base (°C)
- $Tcons$ : température de consigne (19°C en comportement conventionnel et 21°C en comportement dépensier)

Les profils de charge conventionnels sont modifiés pour prendre en compte les charges partielles $Cdimref$. Le coefficient $Coeff\_pond_{x\_dim}$ est alors affecté au taux de charge $Tch_{x\_dim}$, on aura :

$$Coeff\_pond_{x\_dim} = Coeff\_pond_x$$

$$Tch_{x\_dim} = \min\left(\frac{Tch_x}{Cdimref} \;;\; 1\right)$$

Si $\frac{Tch_x}{Cdimref} > 1$, alors sous-dimensionnement de l'installation.

Sauf pour le taux de charge $Tch_{95}$ (correspondant à une charge entre 90% et 100%), on notera :

$$Tch_{95\_dim} = Tch_{95}$$

En présence d'un ou de N générateurs indépendants :

- le taux de charge final x de chaque générateur est : $Tch_{x\_final} = Tch_{x\_dim}$
- le coefficient de pondération final est : $Coeff\_pond_{x\_final} = Coeff\_pond_{x\_dim}$

##### 13.2.1.3 Cascade de deux générateurs à combustion

Ne seront traités que les configurations de cascade à deux générateurs. En présence d'une cascade avec plus de deux générateurs, seuls les deux premiers de la cascade seront pris en compte. Aux deux générateurs seront affectés la puissance totale de l'installation. La répartition des puissances des générateurs non retenus sur les 2 générateurs modélisés dans la cascade se fera de façon à maintenir le même ratio de puissance entre les deux.

- Une donnée d'entrée est la puissance relative du générateur i : $Prel(gen\_i)$
- $Pn(gen\_i)$ : puissance nominale du générateur i (W)

Dans notre cas avec 2 générateurs :

$$Prel(gen\_1) = \frac{Pn(gen\_1)}{Pn(gen\_1) + Pn(gen\_2)}$$

$$Prel(gen\_2) = \frac{Pn(gen\_2)}{Pn(gen\_1) + Pn(gen\_2)}$$

On détermine pour chaque point de fonctionnement x et pour chaque générateur i sa contribution $CTch_{x\_dim}(gen\_i)$ au taux de charge du système $Tch_{x\_dim}$.

###### 13.2.1.3.1 Cascade avec priorité

Dans notre cas avec 2 générateurs en cascade, le générateur 1 sera le plus performant ou à défaut le plus puissant. Il sera considéré comme prioritaire si aucune information complémentaire n'est disponible.

La contribution $CTch_{x\_dim}$ de chaque générateur au taux de charge $Tch_{x\_dim}$ est :

$$CTch_{x\_dim}(gen\_1) = \min(Prel(gen\_1) \;;\; Tch_{x\_dim})$$

$$CTch_{x\_dim}(gen\_2) = \min(Prel(gen\_2) \;;\; Tch_{x\_dim} - CTch_{x\_dim}(gen\_1))$$

Avec le taux de charge final suivant :

$$Tch_{x\_final}(gen\_1) = \min\left(1 \;;\; \frac{CTch_{x\_dim}(gen\_1)}{Prel(gen\_1)}\right)$$

$$Tch_{x\_final}(gen\_2) = \min\left(1 \;;\; \frac{CTch_{x\_dim}(gen\_2)}{Prel(gen\_2)}\right)$$

$$Coeff\_pond_{x\_dim}(gen\_1) = Coeff\_pond_x(gen\_1)$$

$$Coeff\_pond_{x\_dim}(gen\_2) = Coeff\_pond_x(gen\_2)$$

###### 13.2.1.3.2 Cascade sans priorité (même contribution au taux de charge)

Dans ce cas les générateurs contribuent au taux de charge proportionnellement à leur puissance :

$$CTch_{x\_dim}(gen\_1) = Prel(gen\_1) * Tch_{x\_dim}$$

$$CTch_{x\_dim}(gen\_2) = Prel(gen\_2) * Tch_{x\_dim}$$

Avec le taux de charge final suivant :

$$Tch_{x\_final}(gen\_1) = \min\left(1 \;;\; \frac{CTch_{x\_dim}(gen\_1)}{Prel(gen\_1)}\right)$$

$$Tch_{x\_final}(gen\_2) = \min\left(1 \;;\; \frac{CTch_{x\_dim}(gen\_2)}{Prel(gen\_2)}\right)$$

$$Coeff\_pond_{x\_dim}(gen\_1) = Coeff\_pond_x(gen\_1)$$

$$Coeff\_pond_{x\_dim}(gen\_2) = Coeff\_pond_x(gen\_2)$$

Le coefficient de pondération final est :

$$Coeff\_pond_{x\_final}(gen\_1) = \frac{\dfrac{CTch_{x\_dim}(gen\_1)}{Tch_{x\_dim}} * Coeff\_pond_{x\_dim}(gen\_1)}{\dfrac{CTch_{5\_dim}(gen\_1)}{Tch_{5\_dim}} * Coeff\_pond_{5\_dim}(gen\_1) + \cdots + \dfrac{CTch_{95\_dim}(gen\_1)}{Tch_{95\_dim}} * Coeff\_pond_{95\_dim}(gen\_1)}$$

$$Coeff\_pond_{x\_final}(gen\_2) = \frac{\dfrac{CTch_{x\_dim}(gen\_2)}{Tch_{x\_dim}} * Coeff\_pond_{x\_dim}(gen\_2)}{\dfrac{CTch_{5\_dim}(gen\_2)}{Tch_{5\_dim}} * Coeff\_pond_{5\_dim}(gen\_2) + \cdots + \dfrac{CTch_{95\_dim}(gen\_2)}{Tch_{95\_dim}} * Coeff\_pond_{95\_dim}(gen\_2)}$$

##### 13.2.1.4 Pertes au point de fonctionnement

- $QP_x$ (kW) : pertes au point de fonctionnement x (taux de charge x = $Tch_{x\_final}$)
- $QP0$ : pertes à l'arrêt (kW)
- $RPn$ et $RPint$ : respectivement les rendements à pleine charge et à charge intermédiaire
- $Pn$ : puissance nominale du générateur (kW)

Dans les paragraphes suivants, les rendements à pleine charge $Rpn$ et à charge intermédiaire $Rpint$ sont donnés dans les tableaux en PCI. Cependant, les calculs des rendements de génération sont effectués en PCS (pour éviter d'avoir des rendements > 100%). Dans les équations pour le calcul du rendement de génération, ils sont donc convertis en PCS (en les divisant par $k_{PCS/PCI}$). Le DPE exprimant les consommations en kWh PCI, les rendements de génération calculés en PCS sont ensuite convertis en PCI pour leur calcul.

De même, les pertes à l'arrêt $QP0$ et les puissances des veilleuses $Pveil$ sont données pour du PCI. Pour les avoir pour du PCS avant de les utiliser dans les calculs, elles doivent être multipliées par le coefficient de conversion $k_{PCS/PCI}$.

Selon les énergies, le coefficient de conversion en PCI/PCS est donné dans le tableau suivant :

|   Énergie   | Coefficient de conversion $k_{PCS/PCI}$ |
| :---------: | :-------------------------------------: |
| Électricité |                    1                    |
| Gaz naturel |                  1,11                   |
|     GPL     |                  1,09                   |
|    Fioul    |                  1,07                   |
|    Bois     |                  1,08                   |
|     RCU     |                    1                    |
|   Charbon   |                  1,04                   |

##### 13.2.1.5 Chaudières basse température et condensation

Pour les chaudières basse température et condensation, le point de fonctionnement w correspond à un fonctionnement à 15% de charge.

Entre 0 et 15% de charge :

$$QP_x = \frac{[QP_{15} - 0{,}15 * QP0] * x}{0{,}15} + 0{,}15 * QP0$$

Entre 15 et 30% de charge :

$$QP_x = \frac{[QP_{30} - QP_{15}] * x}{0{,}15} + QP_{15} - \frac{[QP_{30} - QP_{15}] * 0{,}15}{0{,}15}$$

Entre 30 et 100% de charge :

$$QP_x = \frac{[QP_{100} - QP_{30}] * x}{0{,}7} + QP_{30} - \frac{[QP_{100} - QP_{30}] * 0{,}3}{0{,}7}$$

$$QP_{15} = \frac{QP_{30}}{2}$$

**Pour les chaudières basse température :**

- S'il y a une régulation :

$$QP_{30} = 0{,}3 * Pn * \frac{100 - (RPint + 0{,}1 * (40 - Tfonc_{30}))}{RPint + 0{,}1 * (40 - Tfonc_{30})}$$

- En l'absence de régulation :

$$QP_{30} = 0{,}3 * Pn * \frac{100 - (RPint + 0{,}1 * (40 - Tfonc_{100}))}{RPint + 0{,}1 * (40 - Tfonc_{100})}$$

$$QP_{100} = Pn * \frac{100 - (RPn + 0{,}1 * (70 - Tfonc_{100}))}{RPn + 0{,}1 * (70 - Tfonc_{100})}$$

**Pour les chaudières à condensation :**

- S'il y a une régulation :

$$QP_{30} = 0{,}3 * Pn * \frac{100 - (RPint + 0{,}2 * (33 - Tfonc_{30}))}{RPint + 0{,}2 * (33 - Tfonc_{30})}$$

- En l'absence de régulation :

$$QP_{30} = 0{,}3 * Pn * \frac{100 - (RPint + 0{,}2 * (33 - Tfonc_{100}))}{RPint + 0{,}2 * (33 - Tfonc_{100})}$$

$$QP_{100} = Pn * \frac{100 - (RPn + 0{,}1 * (70 - Tfonc_{100}))}{RPn + 0{,}1 * (70 - Tfonc_{100})}$$

$Tfonc_{100}$ (°C) est la température de fonctionnement de la chaudière à 100% de charge. Elle est donnée dans le tableau suivant en fonction des types d'émetteur et des différentes périodes de leur installation :

| Température de distribution / Type d'émetteur | Avant 1981 | Entre 1981 et 2000 | Après 2000 |
| :-------------------------------------------- | :--------: | :----------------: | :--------: |
| Basse / Plancher ou plafond basse température |     60     |         35         |     35     |
| Moyenne / Radiateur à chaleur douce           |     80     |         70         |     60     |
| Haute / Autres émetteurs                      |     80     |         70         |     70     |

$Tfonc_{30}$ (°C) est la température de fonctionnement de la chaudière à 30% de charge. Elle est donnée dans les tableaux suivants selon le type d'installation.

Pour les chaudières à condensation :

| Température de distribution / Type d'émetteur | Avant 1981 | Entre 1981 et 2000 | Après 2000 |
| :-------------------------------------------- | :--------: | :----------------: | :--------: |
| Basse / Plancher ou plafond basse température |     32     |        24,5        |    24,5    |
| Moyenne / Radiateur à chaleur douce           |     38     |         35         |     32     |
| Haute / Autres émetteurs                      |     38     |         35         |     35     |

Pour les chaudières basse température :

| Température de distribution / Type d'émetteur | Avant 1981 | Entre 1981 et 2000 | Après 2000 |
| :-------------------------------------------- | :--------: | :----------------: | :--------: |
| Basse / Plancher ou plafond basse température |    42,5    |         35         |     35     |
| Moyenne / Radiateur à chaleur douce           |    48,5    |        45,5        |    42,5    |
| Haute / Autres émetteurs                      |    48,5    |        45,5        |    45,5    |

Si un système de génération alimente des réseaux de distribution de températures différentes, la température de fonctionnement est prise égale à la température maximale.

Pour les installations récentes ou recommandées, les caractéristiques réelles des chaudières présentées sur les bases de données professionnelles peuvent être utilisées.

Si l'année d'installation des émetteurs est inconnue, prendre l'année de construction du bâtiment.

##### 13.2.1.6 Chaudières standard

Pour les chaudières standards, le point de fonctionnement w correspond à un fonctionnement à 30% de charge.

Entre 0 et 30% de charge :

$$QP_x = \frac{[QP_{30} - 0{,}15 * QP0] * x}{0{,}3} + 0{,}15 * QP0$$

Entre 30 et 100% de charge :

$$QP_x = \frac{[QP_{100} - QP_{30}] * x}{0{,}7} + QP_{30} - \frac{[QP_{100} - QP_{30}] * 0{,}3}{0{,}7}$$

- S'il y a une régulation :

$$QP_{30} = 0{,}3 * Pn * \frac{100 - (RPint + 0{,}1 * (50 - Tfonc_{30}))}{RPint + 0{,}1 * (50 - Tfonc_{30})}$$

- En l'absence de régulation :

$$QP_{30} = 0{,}3 * Pn * \frac{100 - (RPint + 0{,}1 * (50 - Tfonc_{100}))}{RPint + 0{,}1 * (50 - Tfonc_{100})}$$

$$QP_{100} = Pn * \frac{100 - (RPn + 0{,}1 * (70 - Tfonc_{100}))}{RPn + 0{,}1 * (70 - Tfonc_{100})}$$

Avec :

- $Tfonc_{100}$ (°C) : température de fonctionnement de la chaudière à 100% de charge (voir paragraphe précédent)
- $Tfonc_{30}$ (°C) : température de fonctionnement de la chaudière à 30% de charge, donnée selon le type d'installation dans les tableaux suivants

Pour une chaudière standard jusqu'en 1990 :

| Température de distribution / Type d'émetteur | Avant 1981 | Entre 1981 et 2000 | Après 2000 |
| :-------------------------------------------- | :--------: | :----------------: | :--------: |
| Basse / Plancher ou plafond basse température |     53     |         50         |     50     |
| Moyenne / Radiateur à chaleur douce           |     59     |         56         |     53     |
| Haute / Autres émetteurs                      |     59     |         56         |     56     |

Pour une chaudière standard depuis 1991 :

| Température de distribution / Type d'émetteur | Avant 1981 | Entre 1981 et 2000 | Après 2000 |
| :-------------------------------------------- | :--------: | :----------------: | :--------: |
| Basse / Plancher ou plafond basse température |    49,5    |         45         |     45     |
| Moyenne / Radiateur à chaleur douce           |    55,5    |        52,5        |    49,5    |
| Haute / Autres émetteurs                      |    55,5    |        52,5        |    52,5    |

Si un système de génération alimente des réseaux de distribution de températures différentes, la température de fonctionnement est prise égale à la température maximale.

Pour les installations récentes ou recommandées, les caractéristiques réelles des chaudières présentées sur les bases de données professionnelles peuvent être utilisées.

Si l'année d'installation des émetteurs est inconnue, prendre l'année de construction du bâtiment.

#### 13.2.2 Valeurs par défaut des caractéristiques des chaudières gaz et fioul

**CHAUDIÈRES GAZ (valeurs par défaut $Rpn$, $Rpint$ et $QP0$)**

|     Type     |               Ancienneté                | Puissance nominale $Pn$ (kW) |         $Rpn$ (PCI) %          |     $Rpint$ (PCI) %     | $QP0$ en % de $Pn$ | Veilleuse (W) |
| :----------: | :-------------------------------------: | :--------------------------: | :----------------------------: | :---------------------: | :----------------: | :-----------: |
|  Classique   |               Avant 1980                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         4%         |      240      |
|  Classique   |                1981–1985                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         2%         |      150      |
|  Classique   |                1986–1990                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |        1,5%        |      150      |
|   Standard   |                1991–2000                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |        1,2%        |      120      |
|   Standard   |                2001–2015                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         1%         |               |
|   Standard   |            À partir de 2016             |             $Pn$             | $Pn * (E + F * \log Pn) / 100$ |                         |                    |               |
| Basse temp.  |                1991–2000                |             $Pn$             |    $87{,}5 + 1{,}5\log Pn$     | $87{,}5 + 1{,}5\log Pn$ |        1,2%        |      120      |
| Basse temp.  |                2001–2015                |             $Pn$             |    $87{,}5 + 1{,}5\log Pn$     | $87{,}5 + 1{,}5\log Pn$ |         1%         |               |
| Basse temp.  |            À partir de 2016             |             $Pn$             | $Pn * (E + F * \log Pn) / 100$ |                         |                    |               |
| Condensation |                1981–1985                |             $Pn$             |         $91 + \log Pn$         |     $97 + \log Pn$      |         1%         |      150      |
| Condensation |                1986–2000                |             $Pn$             |         $91 + \log Pn$         |     $97 + \log Pn$      |         1%         |      120      |
| Condensation |                2001–2015                |             $Pn$             |         $91 + \log Pn$         |     $97 + \log Pn$      |         1%         |               |
| Condensation |    À partir de 2016, $Pn \leq 70$ kW    |             $Pn$             |        $91 + 3\log Pn$         |  $103 + 2{,}5\log Pn$   |        0,5%        |               |
| Condensation | À partir de 2016, $70 < Pn \leq 400$ kW |             $Pn$             |         $94 + \log Pn$         |  $105 + 0{,}5\log Pn$   |        0,3%        |               |
| Condensation |     À partir de 2016, $Pn > 400$ kW     |             $Pn$             |              96,6              |          106,3          |                    |               |

**CHAUDIÈRES FIOUL (valeurs par défaut $Rpn$, $Rpint$ et $QP0$)**

|     Type     |               Ancienneté                | Puissance nominale $Pn$ (kW) |         $Rpn$ (PCI) %          |     $Rpint$ (PCI) %     | $QP0$ en % de $Pn$ |
| :----------: | :-------------------------------------: | :--------------------------: | :----------------------------: | :---------------------: | :----------------: |
|  Classique   |               Avant 1970                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         4%         |
|  Classique   |                1970–1975                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         3%         |
|  Classique   |                1976–1980                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         2%         |
|  Classique   |                1981–1990                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         1%         |
|   Standard   |                1991–2015                |             $Pn$             |        $84 + 2\log Pn$         |     $80 + 3\log Pn$     |         1%         |
|   Standard   |            À partir de 2016             |             $Pn$             | $Pn * (E + F * \log Pn) / 100$ |                         |                    |
| Basse temp.  |                1991–2015                |             $Pn$             |    $87{,}5 + 1{,}5\log Pn$     | $87{,}5 + 1{,}5\log Pn$ |         1%         |
| Basse temp.  |            À partir de 2016             |             $Pn$             | $Pn * (E + F * \log Pn) / 100$ |                         |                    |
| Condensation |                1996–2015                |             $Pn$             |         $91 + \log Pn$         |     $97 + \log Pn$      |         1%         |
| Condensation |    À partir de 2016, $Pn \leq 70$ kW    |             $Pn$             |        $91 + 3\log Pn$         |     $98 + 3\log Pn$     |        0,5%        |
| Condensation | À partir de 2016, $70 < Pn \leq 400$ kW |             $Pn$             |         $94 + \log Pn$         |     $100 + \log Pn$     |        0,6%        |
| Condensation |     À partir de 2016, $Pn > 400$ kW     |             $Pn$             |              96,6              |          102,6          |        0,3%        |

Avec :

|                                                                                                               |   E   |   F   |
| :------------------------------------------------------------------------------------------------------------ | :---: | :---: |
| Chaudières à combustible liquide ou gazeux — absence de ventilateur ou dispositif de circulation d'air/fumée  |  2,5  | −0,8  |
| Chaudières à combustible liquide ou gazeux — présence de ventilateur ou dispositif de circulation d'air/fumée | 1,75  | −0,55 |

##### 13.2.2.1 Générateurs d'air chaud

Pour les générateurs d'air chaud standard, le point de fonctionnement w correspond à un fonctionnement à 50% de charge.

Entre 0 et 50% de charge :

$$QP_x = \frac{[QP_{50} - 0{,}15 * QP0] * x}{0{,}5} + 0{,}15 * QP0$$

Entre 50 et 100% de charge :

$$QP_x = \frac{[QP_{100} - QP_{50}] * x}{0{,}5} + 2 * QP_{50} - QP_{100}$$

$$QP_{50} = 0{,}5 * Pn * \frac{100 - RPint}{RPint}$$

$$QP_{100} = Pn * \frac{100 - RPn}{RPn}$$

$$QP0 = \frac{Pn * (1{,}75 - 0{,}55 * \log Pn)}{100}$$

L'expression de $QP0$ est valable pour une puissance nominale inférieure ou égale à 300 kW. On conservera les valeurs pour $Pn = 300$ kW si $Pn > 300$ kW.

- Si les équipements sont anciens (avant 2006) : $Rpn = 77\%$ — $Rpint = 74\%$
- Si les équipements sont neufs (à partir de 2006) :
  - Pour un générateur standard : $Rpn = 84\%$ — $Rpint = 77\%$
  - Pour un générateur à condensation : $Rpn = 90\%$ — $Rpint = 83\%$

Pour les installations récentes ou recommandées, les caractéristiques réelles des générateurs à air chaud sur les bases de données professionnelles peuvent être utilisées.

##### 13.2.2.2 Radiateurs à gaz

$$QP_x = 1{,}04 * \frac{100 - RPn}{RPn} * Pn * x$$

- Pour les radiateurs à gaz neufs (à partir de 2006) :
  - Si $Pn < 5$ kW : $Rpn = 80\%$
  - Si $Pn \geq 5$ kW : $Rpn = 82\%$
- Pour les radiateurs à gaz anciens (avant 2006) :
  - Si $Pn < 5$ kW : $Rpn = 70\%$
  - Si $Pn \geq 5$ kW : $Rpn = 73\%$

##### 13.2.2.3 Chaudières bois

Les chaudières au charbon sont traitées comme des chaudières bois bûche.

Le point de fonctionnement w des chaudières bois correspond à 50% de charge.

Entre 0 et 50% de charge :

$$QP_x = \frac{[QP_{50} - 0{,}15 * QP0] * x}{0{,}5} + 0{,}15 * QP0$$

Entre 50 et 100% de charge :

$$QP_x = \frac{[QP_{100} - QP_{50}] * x}{0{,}5} + 2 * QP_{50} - QP_{100}$$

$$QP_{50} = 0{,}5 * Pn * \frac{100 - RPint}{RPint}$$

$$QP_{100} = Pn * \frac{100 - RPn}{RPn}$$

Le tableau suivant donne les caractéristiques $Rpn$, $Rpint$ et $QP0$ en fonction des années de fabrication du générateur.

| Générateur                               | Critère $Pn$ (kW)  |  $Rpn$ (PCI) %  | $Rpint$ (PCI) % |          $QP0$ (kW)          |
| :--------------------------------------- | :----------------: | :-------------: | :-------------: | :--------------------------: |
| Chaudière bois bûche/plaquette < 1978    |    $Pn \leq 70$    | $47 + 6\log Pn$ | $48 + 6\log Pn$ | $0{,}08 * Pn * Pn^{-0{,}27}$ |
|                                          | $70 < Pn \leq 400$ |       58        |       59        |             1,8              |
|                                          |     $Pn > 400$     |       58        |       59        |             1,1              |
| Chaudière bois bûche/plaquette 1978–1994 |    $Pn \leq 70$    | $47 + 6\log Pn$ | $48 + 6\log Pn$ | $0{,}07 * Pn * Pn^{-0{,}3}$  |
|                                          | $70 < Pn \leq 400$ |       58        |       59        |             1,4              |
|                                          |     $Pn > 400$     |       58        |       59        |             0,8              |
| Chaudière bois bûche/plaquette 1995–2003 |    $Pn \leq 70$    | $47 + 6\log Pn$ | $48 + 6\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       58        |       59        |             1,1              |
|                                          |     $Pn > 400$     |       58        |       59        |             0,5              |
| Chaudière bois bûche/plaquette 2004–2012 |    $Pn \leq 70$    | $57 + 6\log Pn$ | $58 + 6\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       68        |       69        |             1,1              |
|                                          |     $Pn > 400$     |       68        |       69        |             0,5              |
| Chaudière bois bûche/plaquette 2013–2017 |    $Pn \leq 70$    | $67 + 6\log Pn$ | $68 + 6\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       78        |       79        |             1,1              |
|                                          |     $Pn > 400$     |       78        |       79        |             0,5              |
| Chaudière bois bûche/plaquette 2018–2019 |    $Pn \leq 70$    | $80 + 2\log Pn$ | $77 + 3\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       84        |       83        |             1,1              |
|                                          |     $Pn > 400$     |       84        |       83        |             0,5              |
| Chaudière bois bûche/plaquette > 2019    |    $Pn \leq 20$    | $89 + 2\log Pn$ | $84 + 2\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $20 < Pn \leq 70$  | $90 + 2\log Pn$ | $85 + 2\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       94        |       89        |             1,1              |
|                                          |     $Pn > 400$     |       94        |       89        |             0,5              |
| Chaudière bois granulés < 1978           |    $Pn \leq 70$    | $47 + 6\log Pn$ | $48 + 6\log Pn$ | $0{,}08 * Pn * Pn^{-0{,}27}$ |
|                                          | $70 < Pn \leq 400$ |       58        |       59        |             1,8              |
|                                          |     $Pn > 400$     |       58        |       59        |             1,1              |
| Chaudière bois granulés 1978–1994        |    $Pn \leq 70$    | $47 + 6\log Pn$ | $48 + 6\log Pn$ | $0{,}07 * Pn * Pn^{-0{,}3}$  |
|                                          | $70 < Pn \leq 400$ |       58        |       59        |             1,4              |
|                                          |     $Pn > 400$     |       58        |       59        |             0,8              |
| Chaudière bois granulés 1995–2003        |    $Pn \leq 70$    | $57 + 6\log Pn$ | $58 + 6\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       68        |       69        |             1,1              |
|                                          |     $Pn > 400$     |       68        |       69        |             0,5              |
| Chaudière bois granulés 2004–2012        |    $Pn \leq 70$    | $67 + 6\log Pn$ | $68 + 6\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       78        |       79        |             1,1              |
|                                          |     $Pn > 400$     |       78        |       79        |             0,5              |
| Chaudière bois granulés 2013–2019        |    $Pn \leq 70$    | $80 + 2\log Pn$ | $77 + 3\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       84        |       83        |             1,1              |
|                                          |     $Pn > 400$     |       84        |       83        |             0,5              |
| Chaudière bois granulés > 2019           |    $Pn \leq 20$    | $91 + 2\log Pn$ | $88 + 2\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $20 < Pn \leq 70$  | $92 + 2\log Pn$ | $89 + 2\log Pn$ | $0{,}085 * Pn * Pn^{-0{,}4}$ |
|                                          | $70 < Pn \leq 400$ |       96        |       93        |             1,1              |
|                                          |     $Pn > 400$     |       96        |       93        |             0,5              |

Si l'année d'installation de la chaudière bois n'est pas connue, elle sera considérée par défaut correspondre à l'année de construction du bâtiment.

Les valeurs des bases de données professionnelles peuvent aussi être utilisées pour les chaudières récentes ou recommandées.

##### 13.2.2.4 Calcul des puissances nominales

Lorsque les puissances des générateurs à combustion individuels ne sont pas connues et pour les recommandations, il est possible d'en faire une estimation selon la méthode suivante :

$$Pch = \frac{1{,}2 * GV * (19 - Tbase)}{1000 * 0{,}953}$$

Avec :

- $Pch$ : puissance nominale du générateur pour le chauffage (kW)
- $Tbase$ : température extérieure de base selon la zone climatique et l'altitude (°C) (voir paragraphe 18.1)
- $GV$ : déperditions à travers l'enveloppe et par renouvellement d'air (W/K)

Dans le cas de la réalisation d'un DPE à l'échelle de l'appartement, et lorsque celui-ci est alimenté par une installation collective, le calcul de la puissance nominale du générateur collectif $Pch_{immeuble}$ (kW) est :

$$Pch_{immeuble} = \frac{1{,}2 * GV_{immeuble} * (19 - Tbase)}{1000 * 0{,}953}$$

Avec :

- $GV_{immeuble}$ : déperditions à travers l'enveloppe et par renouvellement d'air pour l'immeuble (W/K) :

$$GV_{immeuble} = GV_{appartement} * \frac{Sh_{immeuble}}{Sh_{appartement}}$$

- $Tbase$ : température extérieure de base selon la zone climatique et l'altitude (°C) (voir paragraphe 18.1)

Dans le cas de la réalisation d'un DPE à l'échelle de l'appartement à partir des données de l'immeuble (voir §17.2.2), et lorsque le chauffage est individuel et géré de manière homogène, le calcul de la puissance nominale du générateur de chaque appartement $Pch$ (kW) est :

$$Pch = \frac{1{,}2 * \dfrac{GV}{N} * (19 - Tbase)}{1000 * 0{,}953}$$

Avec :

- $Pch$ : puissance nominale du générateur pour le chauffage (kW)
- $Tbase$ : température extérieure de base selon la zone climatique et l'altitude (°C) (voir paragraphe 18.1)
- $GV$ : déperditions à travers l'enveloppe et par renouvellement d'air (W/K)
- $N$ : nombre de logements dans l'immeuble

Si le générateur n'alimente qu'une partie du logement, il est nécessaire de proratiser cette puissance $Pch$.

Dans le cas de 2 générateurs alimentant pour le premier une surface $Sh_1$ et pour le second une surface $Sh_2$ ($Sh_1 + Sh_2 = Sh$ avec $Sh$ la surface du logement) :

$$Pch_1 = \frac{Sh_1}{Sh_{tot}} * \frac{1{,}2 * GV * (19 - Tbase)}{1000 * 0{,}953}$$

$$Pch_2 = \frac{Sh_2}{Sh_{tot}} * \frac{1{,}2 * GV * (19 - Tbase)}{1000 * 0{,}953}$$

Avec :

- $Pch_1$ : puissance nominale du générateur pour le chauffage (kW) pour la surface $Sh_1$
- $Pch_2$ : puissance nominale du générateur pour le chauffage (kW) pour la surface $Sh_2$

La puissance nécessaire pour la production d'eau chaude sanitaire ($Pecs$) dépend du type de production et donc du volume de stockage :

| Type de production d'ECS | Volume de stockage (L) |     Puissance de dimensionnement (kW)      |
| :----------------------: | :--------------------: | :----------------------------------------: |
|       Instantanée        |        $Vs = 0$        |                $Pecs = 21$                 |
|     Semi-instantanée     |    $0 < Vs \leq 20$    |          $Pecs = 21 - 0{,}8 * Vs$          |
|    Semi-accumulation     |   $20 < Vs \leq 150$   | $Pecs = 5 - 1{,}751 * \dfrac{Vs - 20}{65}$ |
|       Accumulation       |       $150 < Vs$       |  $Pecs = \dfrac{7{,}14 * Vs + 428}{1000}$  |

La puissance de dimensionnement du générateur est :

$$Pdim = \max(Pch \;;\; Pecs)$$

La puissance nominale $Pn$ (kW) des chaudières est déterminée à partir de $Pdim$ :

|  $Pdim$ (kW)   | $Pn$ — chaudières murales installées avant 2005 ou chaudières sur sol (kW) |        $Pn$ — chaudières murales installées à partir de 2006 (kW)        |
| :------------: | :------------------------------------------------------------------------: | :----------------------------------------------------------------------: |
|    $\leq 5$    |                                     18                                     |                                    5                                     |
| $5 < \leq 10$  |                                     18                                     |                                    10                                    |
| $10 < \leq 13$ |                                     18                                     |                                    13                                    |
| $13 < \leq 18$ |                                     18                                     |                                    18                                    |
| $18 < \leq 24$ |                                     24                                     |                                    24                                    |
| $24 < \leq 28$ |                                     28                                     |                                    28                                    |
| $28 < \leq 32$ |                                     32                                     |                                    32                                    |
| $32 < \leq 40$ |                                     40                                     |                                    40                                    |
|     $> 40$     |  $\left(\text{Partie entière}\left(\dfrac{Pdim}{5}\right) + 1\right) * 5$  | $\left(\text{Partie entière}\left(\dfrac{Pdim}{5}\right) + 1\right) * 5$ |

Dans le cas d'un logement chauffé avec n radiateurs gaz, la puissance de chaque radiateur gaz est $Pn$ (kW) tel que :

$$Pn = \frac{Pch}{n}$$

#### 13.2.3 Puissances moyennes fournies et consommées

On calcule les puissances fournies et consommées $Pfou_{x-fonc}$ et $Pcons_{x-fonc}$ (en kW) par un générateur au point de fonctionnement x de la façon suivante :

$$Pfou_{x-fonc} = Px * coeff\_pond_{x\_final}$$

$$Pcons_{x-fonc} = Pfou_{x-fonc} * \frac{Px + QPx}{Px}$$

$$Px = Pn * Tch_{x\_final}$$

Les puissances moyennes fournies et consommées par un générateur s'expriment de la façon suivante :

$$Pmfou = \sum_{x=0\%}^{x=100\%} Pfou_{x-fonc}$$

$$Pmfou = P5 * Coeff\_pond_{5\_final} + P15 * Coeff\_pond_{15\_final} + \cdots + P95 * Coeff\_pond_{95\_final}$$

$$Pmcons = \sum_{x=0\%}^{x=100\%} Pcons_{x-fonc}$$

$$Pmcons = P5 * Coeff\_pond_{5\_final} * \frac{P5 + QP5}{P5} + P15 * Coeff\_pond_{15\_final} * \frac{P15 + QP15}{P15} + \cdots + P95 * Coeff\_pond_{95\_final} * \frac{P95 + QP95}{P95}$$

#### 13.2.4 Rendement conventionnel annuel moyen de génération de chauffage

Une chaudière standard avec un condenseur sur ses fumées est traitée comme une chaudière condensation de même ancienneté :

$$Rgch_{PCS} = \frac{Pmfou}{Pmcons + 0{,}45 * QP0 + Pveil}$$

Avec :

- $Pveil$ : puissance de la veilleuse (kW)
- $QP0$ : pertes à l'arrêt (kW)

Pour le calcul des consommations, la conversion en PCI du rendement donne :

$$Rgch_{PCI} = k_{PCS/PCI} * Rgch_{PCS}$$

Avec :

- $k_{PCS/PCI}$ : coefficient de conversion en PCI/PCS (défini au §13.2.1.4)
