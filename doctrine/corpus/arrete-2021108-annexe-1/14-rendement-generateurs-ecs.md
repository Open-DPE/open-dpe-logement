## 14 Rendement des générateurs d'ECS

---

**Données d'entrée :**

Type de production

Puissance nominale

Rendement à pleine charge et à charge intermédiaire

Pertes à l'arrêt

Volume de stockage

Isolation de la distribution

Type de distribution

Température de distribution

Type d'alimentation

---

### 14.1 Générateurs à combustion

La scénarisation conventionnelle de la production d'eau chaude sanitaire suppose une absence de consommation pendant 1 semaine au mois de décembre.

Il est donc considéré dans la suite de façon conventionnelle :

- Nombre annuel d'heures de fonctionnement de l'ECS = 1790h
- Nombre d'heures de vacances = 168h
- Durée de fonctionnement de l'ECS ramenée à la période de vacances = 105h

Les générateurs de production d'ECS ne sont pas maintenus en température.

#### 14.1.1 Production d'ECS seule instantanée par chauffe-eau gaz

Le rendement conventionnel annuel moyen de génération d'ECS a pour expression :

$$Rg = \frac{1}{\dfrac{1}{Rpn} + \left(1790 * \dfrac{QP0}{Becs}\right) + \left(6970 * \dfrac{Pveil}{Becs}\right)}$$

Avec :

- $Becs$ : énergie annuelle à fournir par le générateur pour l'ECS (Wh)
- $Pveil$ : puissance de la veilleuse (W)
- $QP0$ : pertes à l'arrêt du générateur (W)
- $Rpn$ : rendement à pleine charge du générateur

Pour un chauffe-eau gaz, les valeurs de $Pveil$, $QP0$, $Rpn$ sont données dans le tableau suivant :

|            |       |      $Pn \leq 10$ kW      |                                |       $Pn > 10$ kW        |                                |                                        |
| :--------: | :---: | :-----------------------: | :----------------------------: | :-----------------------: | :----------------------------: | :------------------------------------: |
| Ancienneté |       | Rendement (PCI) $Rpn$ (%) | $QP0$ en % puissance nom. $Pn$ | Rendement (PCI) $Rpn$ (%) | $QP0$ en % puissance nom. $Pn$ | Puissance veilleuse (W) (si veilleuse) |
| Avant 1981 |       |          70,0 %           |             4,0 %              |          70,0 %           |             4,0 %              |                  150                   |
| 1981-1989  |       |          75,0 %           |             2,0 %              |          75,0 %           |             2,0 %              |                  120                   |
| 1990-2000  |       |          81,0 %           |             1,2 %              |          82,0 %           |             1,2 %              |                  120                   |
| 2001-2015  |       |          82,0 %           |             1,0 %              |          84,0 %           |             1,0 %              |                  100                   |
| Après 2015 |       |          82,0 %           |             1,0 %              |          84,0 %           |             0,6 %              |                                        |

Les valeurs des bases de données professionnelles peuvent aussi être utilisées pour les équipements récents ou recommandés.

Pour les caractéristiques des autres générateurs, voir le paragraphe sur le rendement des générateurs à combustion.

#### 14.1.2 Production mixte par chaudière gaz, fioul, bois

$$Rg * Rs = \frac{1}{\dfrac{1}{Rpn} + \left(\dfrac{1790 * QP0 + Qg{,}w}{Becs}\right) + \left(6970 * \dfrac{0{,}5 * Pveil}{Becs}\right)}$$

Avec :

- $QP0$ : pertes à l'arrêt de la chaudière (W)
- $Becs$ : énergie annuelle à fournir par le générateur pour l'ECS (Wh)
- $Rpn$ : rendement à 100% de charge
- $Qg{,}w$ : pertes de stockage (Wh)

#### 14.1.3 Accumulateur gaz

$$Rg * Rs = \frac{1}{\dfrac{1}{Rpn} + \dfrac{8592 * QP0 + Qg{,}w}{Becs} + \left(6970 * \dfrac{Pveil}{Becs}\right)}$$

Avec :

- $Rpn$ : rendement à 100% de charge
- $Becs$ : besoin annuel à fournir par le générateur pour l'ECS (Wh)
- $Qg{,}w$ : pertes de stockage (Wh)
- $Pveil$ : puissance de la veilleuse (W)
- $QP0$ : pertes à l'arrêt de la chaudière (W) :

$$QP0 = 1{,}5 * \frac{Pn}{100}$$

Les caractéristiques par défaut peuvent être retrouvées dans le tableau suivant :

| Ancienneté |      Type      | $Rpn$ (rendement PCI à 100% de charge) | $Pveil$ (puissance de la veilleuse) W |
| :--------: | :------------: | :------------------------------------: | :-----------------------------------: |
| Avant 1990 |   Classique    |                  81 %                  |                  200                  |
| 1990-2000  |   Classique    |                  84 %                  |                  150                  |
| Après 2000 |   Classique    |                  84 %                  |                  150                  |
| 1996-2000  | À condensation |                  98 %                  |                  NA                   |
| Après 2000 | À condensation |                  98 %                  |                  NA                   |

### 14.2 Chauffe-eau thermodynamique à accumulation

Les performances des chauffe-eau thermodynamiques sont définies par des COP qui dépendent du type d'installation et de la zone climatique. Le tableau suivant donne les caractéristiques par défaut des chauffe-eau thermodynamiques si les caractéristiques exactes des équipements ne peuvent pas être saisies. Les valeurs tabulées sont des données annuelles.

| COP — Zone H1 et H2                                      | Avant 2010 | 2010-2014 | À partir de 2015 |
| :------------------------------------------------------- | :--------: | :-------: | :--------------: |
| CET sur air extérieur ou ambiant (sur local non chauffé) |    2,0     |    2,2    |       2,5        |
| CET sur air extrait                                      |    2,3     |    2,5    |       2,8        |
| PAC double service                                       |    2,0     |    2,1    |       2,3        |

| COP — Zone H3                                            | Avant 2010 | 2010-2014 | À partir de 2015 |
| :------------------------------------------------------- | :--------: | :-------: | :--------------: |
| CET sur air extérieur ou ambiant (sur local non chauffé) |    2,3     |    2,5    |       2,8        |
| CET sur air extrait                                      |    2,3     |    2,5    |       2,9        |
| PAC double service                                       |    2,3     |    2,4    |       2,6        |

Pour le chauffe-eau thermodynamique, la performance des ballons est prise en compte dans le COP.

Ainsi :

$$Iecs = \frac{1}{Rd * COP}$$

### 14.3 Réseau de chaleur

Les rendements de stockage et de génération sont remplacés par le rendement d'échange de la sous-station :

- si l'installation est isolée : $Rs * Rg = 0{,}9$
- sinon : $Rs * Rg = 0{,}75$
