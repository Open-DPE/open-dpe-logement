## 15 Calcul des consommations d'auxiliaires des installations de chauffage (Caux_ch) et d'ECS (Caux_ecs)

Les consommations des auxiliaires des installations de chauffage, de refroidissement et d'ECS sont la somme des consommations des auxiliaires de génération et de distribution.

Consommation des auxiliaires des installations de chauffage :

$$Caux\_ch = Caux\_gen\_ch + Caux\_dist\_ch$$

Avec :

- $Caux\_gen\_ch$ : consommation annuelle des auxiliaires de génération de l'installation de chauffage (Wh) :

$$Caux\_gen\_ch = Qaux\_g\_ch$$

- $Qaux\_g\_ch$ : consommation annuelle des auxiliaires de génération de l'installation de chauffage (Wh)

- $Caux\_dist\_ch$ : consommation annuelle des auxiliaires de distribution de l'installation de chauffage (Wh)

Consommation des auxiliaires des installations d'ECS :

$$Caux\_ecs = Caux\_gen\_ecs + Caux\_dist\_ecs$$

Avec :

- $Caux\_gen\_ecs$ : consommation annuelle des auxiliaires de génération de l'installation d'ECS (Wh) :

$$Caux\_gen\_ecs = Qaux\_g\_ecs$$

- $Qaux\_g\_ecs$ : consommation annuelle des auxiliaires de génération de l'installation d'ECS (Wh)

- $Caux\_dist\_ecs$ : consommation annuelle des auxiliaires de distribution de l'installation d'ECS (Wh) :

$$Caux\_dist\_ecs = Qcir\_b + Qtrac$$

- $Qcir\_b$ : consommation annuelle du circulateur de bouclage (Wh)
- $Qtrac$ : consommation annuelle du traceur (Wh)

Les consommations des auxiliaires de distribution de chauffage et d'ECS sont prises nulles pour les installations individuelles en l'absence d'un circulateur externe au générateur.

Pour les installations de refroidissement, les consommations des auxiliaires de génération sont prises en compte dans le SEER (EER). Seules les consommations des auxiliaires de distribution sont donc à comptabiliser :

$$Caux\_fr = Caux\_dist\_fr$$

Avec :

- $Caux\_dist\_fr$ : consommation annuelle des auxiliaires de distribution de l'installation de refroidissement (Wh)

### 15.1 Consommation des auxiliaires de génération

Les consommations des auxiliaires des générateurs de chauffage et d'ECS sont calculées annuellement.

Détermination des puissances par défaut des auxiliaires :

$$Paux\_g = G + H * Pn \quad \text{(W)}$$

Dans cette équation :

- pour les chaudières gaz ou fioul : si $Pn > 400$ kW alors $Pn = 400$ kW
- pour les générateurs d'air chaud : si $Pn > 300$ kW alors $Pn = 300$ kW
- pour les chaudières bois : si $Pn > 70$ kW alors $Pn = 70$ kW

Avec pour G et H les valeurs tabulées suivantes selon le type d'équipements :

|            Type d'équipement            | G (W) | H (W/kW) |
| :-------------------------------------: | :---: | :------: |
|      Chaudière au gaz ou au fioul       |  20   |   1,6    |
|      Chaudière bois atmosphérique       |   0   |    0     |
| Chaudière bois assistée par ventilateur | 73,3  |   10,5   |
|         Générateurs d'air chaud         |   0   |    4     |
|             Radiateurs gaz              |  40   |    0     |
|             Chauffe-eau gaz             |   0   |    0     |
|            Accumulateur gaz             |   0   |    0     |

Les consommations des auxiliaires de génération sont nulles dans les cas suivants ($Qaux\_g = 0$) :

- Pour les installations avec une production de chaleur (chauffage et/ou ECS) par PAC, les consommations des auxiliaires de génération sont prises en compte dans le SCOP (COP). Elles seront donc ignorées.
- Pour les installations avec une production de chaleur (chauffage et/ou ECS) par un réseau de chaleur urbain, les consommations des auxiliaires de génération sont prises conventionnellement nulles.

#### 15.1.1 Consommation des auxiliaires de génération de chauffage

La consommation annuelle des auxiliaires de génération $Qaux\_g\_ch$ (Wh) est :

$$Qaux\_g\_ch = \frac{Paux\_g\_ch * Bch\_g}{Pn\_ch}$$

Avec :

- $Pn\_ch$ : puissance nominale du générateur de l'installation de chauffage (W)
- $Paux\_g\_ch$ : puissance des auxiliaires de génération de l'installation de chauffage (W)
- $Bch\_g$ : besoin annuel d'énergie assuré par le générateur pour le chauffage (Wh)

Par exemple dans les cas où le générateur n'assure pas 100% du besoin, seule la part du besoin qu'il couvre est prise en compte.

#### 15.1.2 Consommation des auxiliaires de génération d'ECS

La consommation annuelle $Qaux\_g\_ecs$ (Wh) des auxiliaires de génération est :

$$Qaux\_g\_ecs = \frac{Paux\_g\_ecs * Becs\_g}{Pn\_ecs}$$

Avec :

- $Pn\_ecs$ : puissance nominale du générateur de l'installation d'ECS (W)
- $Paux\_g\_ecs$ : puissance des auxiliaires de génération de l'installation d'ECS (W)
- $Becs\_g$ : besoin d'énergie annuel assuré par le générateur pour la production d'ECS (Wh)

Par exemple dans les cas où le générateur n'assure pas 100% du besoin, seule la part du besoin qu'il couvre est prise en compte.

### 15.2 Consommation des auxiliaires de distribution

#### 15.2.1 Puissance des circulateurs de chauffage

Pertes de charge du réseau (kPa) :

$$\Delta Pem_{nom} = 0{,}15 * Lem + \Delta Pem$$

Avec :

- $0{,}15$ kPa/m de pertes de charge linéaires
- $Lem$ : la longueur du réseau le plus défavorisé (m)
- $\Delta Pem$ : la perte de charge de l'émetteur (kPa) :

| Type d'émetteur            | ΔPem (en kPa) en chaud          |
| :------------------------- | :------------------------------ |
| Radiateurs                 | 30 si boucle monotube, 10 sinon |
| Plancher/plafond chauffant | 15                              |
| Autres cas                 | 35                              |

Calcul de la longueur du réseau le plus défavorisé :

$$Lem = 5 * Fcot * \left[Niv\_inst\_ch + \left(\frac{Sh}{Niv\_inst\_ch}\right)^{0{,}5}\right]$$

Avec :

- $Niv\_inst\_ch$ : le nombre de niveaux desservis par l'installation de chauffage
- $Sh$ : surface habitable du bâtiment (m²)

| Émetteur | Fcot Chauffage |
| :------: | :------------: |
| Plancher |     0,156      |
|  Autre   |     0,802      |

En présence de plusieurs types d'émetteurs, le coefficient Fcot le plus défavorable sera pris, c'est-à-dire pour l'émetteur « Autre ».

Calcul de la puissance du circulateur (W) :

$$Pcircem = \max\left(30 \;;\; 6{,}44 * \left(\Delta Pem_{nom} * \frac{qvem_{nom}}{\max\left(1 \;;\; \frac{Sh}{400}\right)}\right)^{0{,}676} * \max\left(1 \;;\; \frac{Sh}{400}\right)\right)$$

Avec :

- Le débit nominal du circulateur $qvem_{nom}$ (m³/h) en mode chaud étant donné par les formules ci-dessous :

$$qvem_{nom}(chaud) = \frac{Pnc * rat}{1{,}163 * \delta\theta_{dim}}$$

- $\delta\theta_{dim}$ : chute nominale de température de dimensionnement :

| Température de distribution de chauffage | δθdim |
| :--------------------------------------: | :---: |
|             Moyenne / Basse              | 7,5°C |
|                  Haute                   | 15°C  |

- $rat$ : ratio du besoin couvert par l'équipement
- $Pnc$ : puissance nominale en chaud (kW) :

$$Pnc = 10^{-3} * GV * (20 - Tbase)$$

- $Tbase$ : température de base (°C)
- $GV$ correspond aux déperditions par l'enveloppe définies au paragraphe 3

#### 15.2.2 Consommation des auxiliaires de distribution de chauffage

$$Caux\_dist\_ch = Pcircem\_ch * Nref$$

Avec :

- $Caux\_dist\_ch$ : consommation annuelle des auxiliaires de distribution de chauffage (Wh)
- $Pcircem\_ch$ : puissance du circulateur de l'installation de chauffage (W)
- $Nref$ : nombre d'heures annuel de chauffage (voir paragraphes 18.2 et 18.3)

#### 15.2.3 Consommation des auxiliaires de distribution d'ECS

Les consommations des auxiliaires de distribution pour une installation d'ECS individuelle sont nulles.

Les pertes de distribution (kWh) sont données par :

$$Q_{d,wind,vc,j} = \frac{0{,}5 * Lvc}{Sh} * Becs_j$$

$$Q_{d,wcol,vc,j} = 0{,}112 * Becs_j$$

$$Q_{d,wcol,hvc,j} = 0{,}028 * Becs_j$$

Avec :

- $Q_{d,wind,vc,j}$ : pertes de distribution individuelle en volume chauffé pour le mois j (Wh)
- $Q_{d,wcol,vc,j}$ : pertes de distribution collective en volume chauffé pour le mois j (Wh)
- $Q_{d,wcol,hvc,j}$ : pertes de distribution collective hors volume chauffé pour le mois j (Wh)
- $Becs_j$ : besoin annuel d'eau chaude sanitaire pour le mois j (Wh)
- $Lvc$ : longueur du réseau d'ECS en volume chauffé :

$$Lvc = 0{,}2 * Sh * Ratecs$$

- $Ratecs$ : part du besoin d'eau chaude assurée par le générateur :
  - Si 2 systèmes de production d'ECS sont considérés (voir paragraphe 11.4) : $Ratecs = 0{,}5$
  - Sinon : $Ratecs = 1$

Pour une installation d'ECS collective, aux consommations d'auxiliaires du générateur, il faut ajouter celles éventuelles du bouclage ou du traçage de l'ECS :

- La prise en compte du bouclage pour l'ECS se fait toujours à l'échelle de l'immeuble pour une installation collective. Dans le cas d'un appartement alimenté par une installation collective d'ECS, les pertes de distribution de l'immeuble nécessaires au calcul des consommations de bouclage sont obtenues en multipliant les pertes de distribution de l'appartement par le rapport de la SHAB de l'immeuble à la SHAB de l'appartement.

Débit au départ de la boucle (m³/h) pour une chute de température de 5°C pour le mois j :

$$q_{d,w,j} = \frac{Q_{d,w,j}}{5{,}815 * Nhpuisage_j}$$

Avec :

- $Nhpuisage_j$ : nombre d'heures de puisage pour le mois j (h) :

$$Nhpuisage_j = njj * 5$$

On a en effet puisage d'eau chaude sanitaire entre 7h et 9h ; 18h et 19h ; 20h et 22h, soit 5h par jour.

- $njj$ : Nombre de jours d'occupation sur le mois j (voir paragraphe 11.1)

- $Q_{d,w,j}$ : pertes de distribution pour le mois j (Wh) :

$$Q_{d,w,j} = Q_{d,wind,vc,j} + Q_{d,wcol,vc,j} + Q_{d,wcol,hvc,j}$$

La longueur par défaut du bouclage d'ECS $Lb$ (en m) est donnée par :

$$Lb = 4 * \sqrt{\frac{Sh}{Niv\_inst\_ecs}} + 6 * (Niv\_inst\_ecs - 0{,}5)$$

Avec :

- $Niv\_inst\_ecs$ : nombre de niveaux entre la génération et l'appartement le plus haut desservi
- $Sh$ : surface habitable des logements desservis par l'installation d'ECS

La perte de charge dans le bouclage (kPa) est alors :

$$\Delta p_b = 0{,}2 * Lb + 10$$

La puissance hydraulique du bouclage pour le mois j (W) est :

$$Phyd_j = \frac{q_{d,w,j} * \Delta p_b}{3{,}6}$$

L'efficacité du circulateur pour le mois j est :

$$Effcirb_j = \frac{Phyd_j^{0{,}324}}{15{,}3}$$

La puissance électrique du circulateur pour le mois j (W) est :

$$Pcirb_j = \max\left(20 \;;\; \frac{Phyd_j}{Effcirb_j}\right)$$

La consommation électrique des circulateurs sur une heure (Wh/h) pour le mois j est :

$$Qcirb_j = Pcirb_j$$

La consommation mensuelle du circulateur de bouclage (Wh) est donnée par :

$$Qcirb_j = Nhpuisage_j * Pcirb_j + (Nhmois_j - Nhpuisage_j) * 20$$

Avec :

- $Nhmois_j$ : nombre d'heure dans le mois j (h)
- $20$ W la puissance appelée lorsqu'il n'y a pas puisage d'eau chaude sanitaire

$$Nhmois_j = njj * 24$$

La consommation annuelle du circulateur de bouclage (Wh) est donnée par :

$$Qcirb = \sum_j Qcirb_j$$

Dans le cas d'un DPE appartement, la consommation annuelle du circulateur de bouclage pour l'appartement est obtenue en multipliant la consommation annuelle du circulateur de bouclage de l'immeuble par le rapport de la SHAB de l'appartement à la SHAB de l'immeuble.

- Prise en compte du traçage pour l'ECS :

$$Qtrac = \sum_j Q_{d,wcol,vc,j} + Q_{d,wcol,hvc,j}$$

La consommation annuelle du traceur (Wh) est :

$$Qtrac = 0{,}14 * Becs$$

Avec :

- $Becs$ : besoin annuel d'eau chaude sanitaire (Wh)

Les auxiliaires des installations d'ECS solaire ne sont pas pris en compte.
