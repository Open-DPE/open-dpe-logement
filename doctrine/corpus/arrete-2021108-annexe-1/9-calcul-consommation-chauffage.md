## 9 Calcul de la consommation de chauffage (Cch)

---

**Données d'entrée principales :**

Rendement de génération : $Rg$ (sans dimension)

Rendement d'émission : $Re$ (sans dimension)

Rendement de distribution : $Rd$ (sans dimension)

Rendement de régulation : $Rr$ (sans dimension)

Type d'installation de chauffage : avec ou sans solaire ; base + appoint…

Présence d'une ventouse (ou assistance par ventilateur) sur l'équipement

---

### 9.1 Installation de chauffage seule

Une installation de chauffage peut se composer d'un générateur ou de plusieurs générateurs couplés associés à un ou plusieurs émissions, régulations et distributions.

#### 9.1.1 Consommation de chauffage

La consommation de chauffage est calculée pour une consigne de température à 19°C correspondant à un comportement conventionnel (ou 21°C pour un comportement dépensier).

Le besoin de chauffage sur le mois j $Bch_j$ (kWh PCI) est déterminé de la façon suivante :

$$Bch_j = \frac{BV_j * DH_j}{1000} - \frac{Q_{rec\_chauff\_j} + Q_{g,w\_rec\_j} + Q_{gen\_rec\_j}}{1000}$$

Avec :

- $BV_j$ : besoin de chauffage d'un logement par kelvin sur le mois j (W/K) (voir chapitre 2)
- $DH_j$ : degrés heures de chauffage sur le mois j (°Ch) (différents selon le comportement choisi), voir paragraphes 18.2 et 18.3
- $Q_{rec\_chauff\_j}$ : pertes récupérées de distribution d'ECS pour le chauffage sur le mois j (Wh)
- $Q_{g,w\_rec\_j}$ : pertes récupérées de stockage d'ECS pour le chauffage sur le mois j (Wh)
- $Q_{gen\_rec\_j}$ : pertes récupérées de génération pour le chauffage sur le mois j (Wh)

Pertes récupérées de distribution d'ECS pour le chauffage sur le mois j (Wh) :

$$Q_{rec\_chauff\_j} = 0{,}48 * Nref_j * \frac{Q_{d,w\_ind,vc\_j} + Q_{d,w\_col,vc\_j}}{8760}$$

Avec :

- $Q_{d,w\_ind,vc\_j}$ : pertes de la distribution individuelle en volume chauffé pour le mois j (Wh) (voir paragraphe 15.2.3)
- $Q_{d,w\_col,vc\_j}$ : pertes de la distribution collective en volume chauffé pour le mois j (Wh) (voir paragraphe 15.2.3)

Pertes récupérées de stockage d'ECS pour le chauffage sur le mois j (Wh) :

$$Q_{g,w\_rec\_j} = 0{,}48 * Nref_j * \frac{Q_{g,w}}{8760}$$

Avec :

- $Q_{g,w}$ : pertes brutes annuelles de stockage (Wh) (voir paragraphe 14 ou 11.6)

Pertes récupérées de génération pour le chauffage sur le mois j (Wh) :

$$Q_{gen\_rec\_j} = 0{,}48 * Cper * Qp0 * Dper_j$$

Avec :

- $Cper$ : part des pertes par les parois, égale à 0,75 pour les équipements à ventouse ou assistés par ventilateur et 0,5 pour les autres
- $Qp0$ : pertes à l'arrêt du générateur (W)
- $Dper_j$ : durée pendant laquelle les pertes sont récupérées sur le mois j (h) :
  - Pour les générateurs assurant le chauffage uniquement :

$$Dper_j = \min\left(Nref_j \;;\; \frac{1{,}3 * Bchhp\_j}{0{,}3 * Pn}\right)$$

Pour les générateurs assurant l'ECS uniquement :

$$Dper_j = Nref_j * \frac{1790}{8760}$$

Pour les générateurs assurant le chauffage et l'ECS :

$$Dper_j = \min\left(Nref_j \;;\; \frac{1{,}3 * Bchhp\_j}{0{,}3 * Pn} + Nref_j * \frac{1790}{8760}\right)$$

  Avec :
    - $Pn$ : puissance nominale du générateur (W)
    - $Bchhp\_j$ : besoin de chauffage hors pertes récupérées sur le mois j (kWh) :

$$Bchhp\_j = \frac{BV_j * DH_j}{1000}$$

  Avec $BV_j$ et $DH_j$ définis ci-dessus.

Ce calcul ne s'applique qu'aux générateurs pour lesquels des pertes à l'arrêt $Qp0$ sont prises en compte.

Seules les pertes des générateurs et des ballons de stockage en volume chauffé sont récupérables. Les pertes récupérées des générateurs d'air chaud sont nulles.

Le besoin annuel de chauffage ($Bch$) est égal à la somme des besoins mensuels ($Bch_j$) sur la période de chauffe :

$$Bch = \sum_j Bch_j$$

Les performances des équipements étant données sur une saison de chauffe complète, il n'est possible de calculer la consommation de chauffage $Cch$ (kWh PCI) que sur la saison complète de chauffe (donc sur l'année).

Les émetteurs sont classables en plusieurs catégories selon leur place dans l'installation :

- Émetteurs de base qui sont ceux assurant la plus grande partie du chauffage ;
- Émetteurs d'appoint qui apportent un complément à la base ;
- Émetteurs de salle de bain qui gèrent le chauffage dans les salles de bains.

#### 9.1.2 Installation classique

Ce cas correspond à une installation simple avec un unique rendement de génération, de distribution, d'émission et de régulation pour tout le bâtiment.

$$Cch = Bch * Ich * INT$$

Avec :

- $Bch$ et $Cch$ : respectivement les besoins et consommations annuels de chauffage (kWh PCI)
- $INT$ : facteur d'intermittence
- $Ich$ : inverse du rendement de l'installation :

$$Ich = \frac{1}{Rg * Re * Rd * Rr}$$

$Rg$, $Re$, $Rd$ et $Rr$ sont respectivement le rendement annuel conventionnel du générateur ou le coefficient de performance des pompes à chaleur (COP), le rendement d'émission, le rendement de distribution et le rendement de régulation.

L'émetteur dans ce cas est défini comme un émetteur de base.

#### 9.1.3 Installation avec plusieurs émissions pour un même générateur

Ce cas correspond aux installations centralisées avec plusieurs émetteurs de types différents.

$$Cch = \sum_i \left(\frac{Sh_i}{Sh} * INT_i * Ich_i\right) * Bch$$

La part de la consommation traitée par chaque émetteur est proratisée par le ratio des surfaces habitables.

Par exemple, pour un générateur alimentant un plancher chauffant au rez-de-chaussée et des radiateurs en étage, il faut considérer une installation avec deux émetteurs et éventuellement deux régulations et distributions :

$$Cch = Cch_1 + Cch_2$$

Avec :

$$Cch_1 = \frac{Sh_1}{Sh} * Bch * INT_1 * Ich_1 \qquad Cch_2 = \frac{Sh_2}{Sh} * Bch * INT_2 * Ich_2$$

$$Ich_1 = \frac{1}{Rg * Re_1 * Rd * Rr_1} \qquad Ich_2 = \frac{1}{Rg * Re_2 * Rd * Rr_2}$$

Dans cette configuration, tous les émetteurs sont définis en base car ils sont des émetteurs principaux du chauffage.

Les consommations sont mensualisées de la façon suivante :

$$Cch_j = Cch * \frac{Bch_j}{Bch}$$

$Cch_j$ et $Bch_j$ : respectivement les consommations et besoins de chauffage sur le mois j (kWh PCI).

#### 9.1.4 Installation avec plusieurs générateurs pour une même émission

En présence de plusieurs émissions, les consommations assurées par chaque générateur doivent être proratisées selon les règles du paragraphe précédent.

##### 9.1.4.1 Installation de chauffage avec une chaudière ou une PAC en relève d'une chaudière bois

Cette installation correspond à une chaudière bois assurant principalement le chauffage sauf par temps doux ou en mi-saison où une PAC ou chaudière prend le relais.

$$Cch_1 = 0{,}75 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}25 * Bch * INT_2 * Ich_2$$

Dans cette configuration, les générateurs sont multiples et couplés, les émetteurs sont de base et peuvent aussi être multiples.

##### 9.1.4.2 Installation de chauffage avec chaudière en relève de PAC

Cette installation correspond à une PAC assurant principalement le chauffage sauf par temps de grand froid où la PAC s'arrête pour laisser le relais à la chaudière.

$$Cch_1 = 0{,}8 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}2 * Bch * INT_2 * Ich_2$$

Dans cette configuration, les générateurs sont multiples et couplés, les émetteurs sont de base et peuvent aussi être multiples.

##### 9.1.4.3 Les pompes à chaleur hybrides

Une pompe à chaleur (PAC) hybride est l'association d'une chaudière à condensation (gaz ou fioul) et d'une PAC air/eau ou eau/eau. La modélisation correspond à une répartition du besoin de chauffage selon le tableau suivant :

| Zone  | PAC (%) | Chaudière (%) |
| :---: | :-----: | :-----------: |
|  H1   |   80    |      20       |
|  H2   |   83    |      17       |
|  H3   |   88    |      12       |

La fourniture d'ECS est considérée assurée à 100% par la chaudière.

Dans cette configuration, tous les émetteurs associés au générateur sont de base.

### 9.2 Installation de chauffage avec du chauffage solaire

Cette installation est valable seulement pour les maisons individuelles. Une partie de l'énergie destinée au chauffage est apportée par une installation de panneaux solaires thermiques.

$$Cch = Bch * INT * (1 - Fch) * Ich$$

Avec :

- $Bch$ : le besoin annuel de chauffage (kWh PCI)
- $Fch$ : facteur de couverture solaire pour le chauffage, déterminé à partir du tableau du paragraphe 18.4
- $Ich$ : inverse du rendement de l'installation

Dans cette configuration, tous les émetteurs sont définis en base. L'appoint apporté par le solaire se fait en amont de l'émission.

En présence de plusieurs générateurs et émetteurs, la part de la consommation de chauffage assurée par l'installation est calculée en appliquant les règles du paragraphe 9.1. En présence de plusieurs émissions, les consommations assurées par chaque générateur doivent être proratisées selon les règles du paragraphe 9.1.3.

### 9.3 Installation de chauffage avec insert ou poêle bois en appoint

Configuration correspondant à un insert ou à un poêle en appoint dans le logement en plus d'un système principal chauffant tout le logement.

$$Cch_1 = 0{,}75 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}25 * Bch * INT_2 * Ich_2$$

Avec :

- $Ich_i$ : inverse du rendement de l'installation alimentée par l'équipement i (voir partie 9.1)

L'émetteur de base est celui associé au chauffage principal. L'émetteur traité en appoint est le poêle bois ou l'insert.

Le poêle bois ou l'insert peuvent être traités en émetteur de base dans les situations où ce sont les seuls équipements de chauffage du local.

### 9.4 Installation de chauffage par insert, poêle bois (ou biomasse) avec un chauffage électrique dans la salle de bains

Dans cette configuration, valable que pour les maisons individuelles, tout le bâtiment est chauffé par un poêle bois. Seule la salle de bains est chauffée par un système électrique.

$$Cch_1 = 0{,}9 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}1 * Bch * INT_2 * Ich_2$$

L'émetteur poêle bois ou insert est traité comme un émetteur de base. Le chauffage électrique dans la salle de bain est saisi comme un émetteur de salle de bain.

En présence de deux salles de bains de surface $Sh_{sdb1}$ et $Sh_{sdb2}$ avec un chauffage électrique différent :

$$Cch_{2sbd1} = 0{,}1 * \frac{Sh_{sdb1}}{Sh_{sdb1} + Sh_{sdb2}} * Bch * INT_{sdb1} * Ich_{sdb1}$$

$$Cch_{2sbd2} = 0{,}1 * \frac{Sh_{sdb2}}{Sh_{sdb1} + Sh_{sdb2}} * Bch * INT_{sdb2} * Ich_{sdb2}$$

$$Cch_2 = Cch_{2sdb1} + Cch_{2sdb2}$$

### 9.5 Installation de chauffage avec en appoint un insert ou poêle bois et un chauffage électrique dans la salle de bains (différent du chauffage principal)

Configuration valable que pour les maisons individuelles : insert ou poêle en appoint en plus d'un système principal, la salle de bains étant chauffée uniquement par un équipement électrique.

$$Cch_1 = 0{,}75 * 0{,}9 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}25 * 0{,}9 * Bch * INT_2 * Ich_2$$

$$Cch_3 = 0{,}1 * Bch * INT_3 * Ich_3$$

L'émetteur de base est celui associé au chauffage principal. L'émetteur traité en appoint est le poêle bois ou l'insert. Le chauffage électrique dans la salle de bain est saisi comme un émetteur de salle de bain.

En présence de plusieurs salles de bain avec un chauffage électrique différent, la part de la consommation apportée par l'appoint est répartie entre les deux équipements par un prorata de surface habitable.

### 9.6 Installation de chauffage avec chauffage solaire et insert ou poêle bois en appoint

Cette configuration, valable seulement pour les maisons individuelles, correspond à un insert ou à un poêle en appoint en plus d'un système général composé d'un équipement principal accompagné par du chauffage solaire.

$$Cch_1 = 0{,}75 * Bch * INT_1 * (1 - Fch) * Ich_1$$

$$Cch_2 = 0{,}25 * Bch * INT_2 * (1 - Fch) * Ich_2$$

La production annuelle de chauffage solaire $Prodchauff\_sol$ (kWh PCI) est donnée par la formule :

$$Prodchauff\_sol = Bch * Fch * (0{,}75 * INT_1 * Ich_1 + 0{,}25 * INT_2 * Ich_2)$$

L'émetteur traité en appoint est le poêle bois ou l'insert.

### 9.7 Installation de chauffage avec chaudière en relève de PAC avec insert ou poêle bois en appoint

Cette installation correspond à une PAC assurant principalement le chauffage sauf par temps de grand froid où la PAC s'arrête pour laisser le relais à la chaudière, avec un poêle bois ou un insert utilisé de temps en temps en remplacement du système principal.

$$Cch_1 = 0{,}8 * 0{,}75 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}2 * 0{,}75 * Bch * INT_2 * Ich_2$$

$$Cch_3 = 0{,}25 * Bch * INT_3 * Ich_3$$

Dans cette configuration, les générateurs sont multiples et couplés, les émetteurs sont de base et peuvent aussi être multiples. L'émetteur traité en appoint est le poêle bois ou l'insert.

### 9.8 Installation de chauffage collectif avec base + appoint

La base fonctionne seule tant que la température extérieure est supérieure à une température de dimensionnement $T$ (°C). À cette température $T$, le besoin instantané du bâtiment est égal à la puissance utile du générateur en base :

$$T = 14 - \frac{Pe * DH_{14}}{Bch}$$

Avec :

- $DH_{14}$ : degrés heures de base 14 sur la saison de chauffe complète (°Ch) (voir paragraphes 18.2 et 18.3)
- $Pe$ : puissance émise utile par le générateur en base (kW) :

$$Pe = Pn * Rd * Rr * Re$$

Avec :

- $Pn$ : puissance nominale du générateur en base (kW)
- $Rd$, $Rr$ et $Re$ : respectivement les rendements annuels de distribution, de régulation et d'émission de l'installation de chauffage de base

Le besoin de chauffage assuré par la base $Bch\_base_j$ (kWhef) est calculé pour le mois j par :

$$Bch\_base_j = Bch_j * \left(1 - \frac{DHT_j}{DH14_j}\right)$$

Avec :

- $DHT_j$ : degré heure base T sur le mois j :

$$DHT_j = Nref_j * (Text_j - Tbase) * X_j^5 * (14 - 28 * X_j + 20 * X_j^2 - 5 * X_j^3)$$

$$X_j = 0{,}5 * \frac{T - Tbase}{Text_j - Tbase}$$

Avec :

- $Nref_j$ : nombre d'heures de chauffage sur le mois j
- $Tbase$ : température extérieure de base dans la zone climatique (°C)
- $Text_j$ : température extérieure moyenne dans la zone climatique sur le mois j (°C)

Le besoin annuel est la somme des besoins mensuels :

$$Bch\_base = \sum_j Bch\_base_j$$

La consommation annuelle de chauffage $Cch_1$ liée à la base (kWhef PCI) est :

$$Cch_1 = Bch\_base * INT_1 * Ich_1$$

La consommation annuelle de chauffage $Cch_2$ liée à l'appoint (kWhef PCI) est :

$$Cch_2 = (Bch - Bch\_base) * INT_2 * Ich_2$$

L'appoint est supposé être dimensionné pour assurer 50% du besoin.

### 9.9 Convecteur bi-jonction

La base et l'appoint sont assurés par un même convecteur disposant d'un circuit collectif alimentant la base et un circuit individuel pour l'appoint.

$$Cch_1 = 0{,}6 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}4 * Bch * INT_2 * Ich_2$$

### 9.10 Chauffage avec plusieurs installations différentes et indépendantes

Une installation de chauffage correspond à un générateur avec les émissions, distributions et régulations associées.

$$Cch = \sum_i \left(\frac{Sh_i}{Sh} * INT_i * Ich_i\right) * Bch$$

Soit :

$$Cch_1 = \frac{Sh_1}{Sh} * Bch * INT_1 * Ich_1 \quad Cch_2 = \frac{Sh_2}{Sh} * Bch * INT_2 * Ich_2 \quad Cch_3 = \frac{Sh_3}{Sh} * Bch * INT_3 * Ich_3$$

$$Cch_4 = \frac{Sh_4}{Sh} * Bch * INT_4 * Ich_4 \quad Cch_5 = \frac{Sh_5}{Sh} * Bch * INT_5 * Ich_5 \quad Cch_6 = \frac{Sh_6}{Sh} * Bch * INT_6 * Ich_6$$

L'intermittence sera déterminée pour chaque installation i associée à la surface $Sh_i$.

Dans le cas particulier où plusieurs équipements différents cohabitent dans une même pièce j de surface $Sh_j$ avec N équipements de puissance $P_i$ (W), la consommation devient :

$$Cch_j = \sum_{i=1}^{N} \frac{P_i}{\sum_i P_i} * Ich_i * INT_i * \frac{Sh_j}{Sh} * Bch$$

Dans le cas où les puissances $P_i$ ne sont pas connues :

$$Cch_j = \sum_{i=1}^{N} \frac{1}{N} * Ich_i * INT_i * \frac{Sh_j}{Sh} * Bch$$

Dans cette configuration, tous les émetteurs associés aux différents générateurs sont de base.

### 9.11 Installation de chauffage avec un générateur bi-énergie

Pour les générateurs pouvant fonctionner avec deux énergies différentes, il est considéré que chaque énergie couvre 50% du besoin.

$$Cch_1 = 0{,}5 * Bch * INT_1 * Ich_1$$

$$Cch_2 = 0{,}5 * Bch * INT_2 * Ich_2$$

Dans cette configuration, tous les émetteurs associés au générateur sont de base.
