## 17 DPE dans le collectif

### 17.1 Génération d'un DPE à l'immeuble collectif d'habitation

#### 17.1.1 Collecte des données d'entrée

##### 17.1.1.1 Règles d'échantillonnage

La réalisation d'un DPE sur un immeuble collectif d'habitation nécessite la visite de l'ensemble des logements du bâtiment pour la détermination des caractéristiques des installations dans chaque logement.

À défaut de pouvoir visiter l'ensemble des appartements, le diagnostiqueur établit le DPE de l'immeuble sur la base de la visite d'un échantillon de logements. La description de l'enveloppe et des équipements au niveau de l'immeuble sera obtenue par extrapolation à partir des données relevées dans l'échantillon.

Il est obligatoire que soient visités a minima :

- un logement de chaque typologie (T1, T2, T3…) ;
- un logement sur chaque type de plancher (sous-sol, vide sanitaire, terre-plein…) ;
- un logement en étage intermédiaire ;
- un logement sous chaque type de toiture (combles perdus, toiture terrasse, combles aménagés…).

La visite de ces logements permet de déterminer les dimensions de chaque format de menuiseries. Si sur certains formats de menuiseries les caractéristiques sont différentes, alors le ratio de chaque type de menuiseries de ce format sera extrapolé à l'ensemble des menuiseries de l'immeuble ayant le même format.

En plus de l'application des règles ci-dessus, pour un immeuble de plus de 30 logements, le nombre d'appartements visités doit être :

- Pour un immeuble de 31 à 100 logements : au minimum un nombre de logements supérieur ou égal à 10% du nombre total d'appartements de l'immeuble ;
- Pour un immeuble de plus de 100 logements : au minimum 10 logements et un nombre de logements supérieur ou égal à 5% du nombre total d'appartements de l'immeuble.

À des fins de traçabilité, les logements visités seront précisés dans la fiche technique du DPE. Ils constituent un échantillon considéré représentatif du bâtiment.

Le diagnostiqueur vérifiera sur cet échantillon la cohérence des informations communiquées par le propriétaire ou le syndic de copropriété. Si le descriptif communiqué est validé par les relevés faits sur l'échantillon, le diagnostiqueur pourra l'utiliser pour la réalisation du DPE sur l'immeuble. En cas d'inexactitudes sur certaines données dans un logement, le diagnostiqueur devra visiter deux autres logements de même type, afin de s'assurer de la représentativité de l'échantillon.

Le recours à l'échantillonnage est nécessaire en l'absence de visite de tous les appartements pour déterminer les équipements des logements et éventuellement les caractéristiques des menuiseries.

##### 17.1.1.2 Cas particulier : immeuble détenu par un propriétaire unique certifiant que tous les appartements font l'objet d'une gestion homogène

On entend par immeuble géré de manière homogène :

- un immeuble appartenant à un propriétaire unique attestant de la présence de systèmes (installations de chauffage, de refroidissement, de production d'ECS et de ventilation) et menuiseries similaires dans l'ensemble des logements ;
- la puissance des équipements ne fait pas partie du critère d'homogénéité.

Dans le cas d'un immeuble géré de manière homogène :

- les données d'entrée déclarées par le propriétaire peuvent être directement utilisées pour le calcul ;
- le diagnostiqueur doit toutefois vérifier l'exactitude des données déclarées par le propriétaire par les relevés effectués sur l'échantillon de logements visités.

En cas de non-conformité constatée par le diagnostiqueur, le descriptif fourni par le propriétaire devra être corrigé et l'échantillon d'appartements visités sera élargi (visite d'au moins 2 appartements supplémentaires de même typologie que l'appartement sur lequel a été relevée l'anomalie).

##### 17.1.1.3 Caractérisation des espaces communs en volume chauffé ou non chauffé

Pour caractériser les espaces communs (couloirs, escaliers, …) en volume chauffé ou en volume non chauffé, les règles suivantes doivent être appliquées :

Un « volume intérieur » est un local horizontal ou vertical, dépourvu de parois donnant sur l'extérieur à l'exception de celles ayant le même niveau d'isolation que les parois de même type du bâtiment, et dont le linéaire donnant sur l'extérieur ou sur des locaux non chauffés (c+d) est inférieure à celui donnant sur des locaux chauffés (a+b).

Dans le cas où (c+d) n'est pas isolé, ou dans le cas où les planchers bas ou hauts des espaces communs donnent sur l'extérieur, ces espaces seront considérés hors « volume intérieur ».

- Sont considérés comme **chauffés**, les « volumes intérieurs » qui ne possèdent pas d'ouvertures permanentes sur l'extérieur (trappe, gaine de désenfumage) et dont les accès vers l'extérieur et vers des locaux non chauffés ou à occupation discontinue sont respectivement munis de sas et de dispositifs de fermeture automatique, ainsi que les espaces équipés d'émetteurs ;
- Sont considérés comme **non chauffés**, les « volumes intérieurs » ne répondant pas au moins à une des conditions ci-dessus.

Si l'isolation n'est pas connue, et que le bâtiment a été construit avant 1974, il faut considérer que (c+d) n'est pas isolé, et donc que les espaces communs ne sont pas intégrés au « volume intérieur ».

#### 17.1.2 Définition d'un appartement « moyen »

L'exploitation des données issues de l'échantillonnage passe par la définition d'un appartement moyen de l'immeuble de surface $Sh_{moy}$ :

$$Sh_{moy} = \frac{Sh}{Nblgt}$$

Avec :

- $Sh$ : surface habitable totale de l'immeuble (m²)
- $Nblgt$ : nombre de logements de l'immeuble

La surface de cet appartement ne dépend pas de la taille des appartements visités. Cet appartement « moyen » sera par la suite utilisé dans le cas où le chauffage, le refroidissement ou l'ECS est produit individuellement.

La réalisation de l'échantillonnage permet après extrapolation de connaître le nombre d'appartements « moyens » équipés d'un type d'installation. Ces appartements « moyens » équipés d'un même type d'installation sont appelés sous-ensemble de l'immeuble.

Les caractéristiques des équipements ($Pn$, $QP0$, $RPn$, $RPint$, $Pveil$, $Paux$, …) font l'objet d'une moyenne pondérée, puis multipliée au rapport de la surface de l'appartement « moyen » sur la surface moyenne des appartements de l'échantillon équipés de ce type de système :

$$Pn_{pond\_systeme\_i} = \frac{\sum_j Pn_{systeme\_i,appartement\_j} * Sh_{systeme\_i,appartement\_j}}{\sum_j Sh_{systeme\_i,appartement\_j}}$$

$$Pn_{moy\_systeme\_i} = Pn_{pond\_systeme\_i} * \frac{Sh_{moy}}{Sh_{moy\_systeme\_i}}$$

Avec :

- $Pn_{moy\_systeme\_i}$ : puissance nominale de l'appartement moyen équipé du système i
- $Pn_{pond\_systeme\_i}$ : puissance nominale pondérée pour le système i de l'échantillon
- $Pn_{systeme\_i,appartement\_j}$ : puissance du système i installé dans l'appartement j
- $Sh_{systeme\_i,appartement\_j}$ : surface habitable de l'appartement j équipé du système i
- $Sh_{moy\_systeme\_i}$ : surface habitable moyenne des appartements de l'échantillon équipés d'un système i :

$$Sh_{moy\_systeme\_i} = \frac{\sum_j Sh_{systeme\_i,appartement\_j}}{Nblgt\_systeme\_i}$$

- $Nblgt\_systeme\_i$ : nombre de logements de l'échantillon visité équipés du système i

#### 17.1.3 Calcul des consommations d'ECS

##### 17.1.3.1 Calcul du besoin d'ECS de l'immeuble

Le calcul du besoin d'ECS s'effectue à l'échelle de l'immeuble, à partir de la surface habitable totale et du nombre d'appartements de l'immeuble (voir paragraphe 11.1).

##### 17.1.3.2 Calcul des consommations d'ECS

Le calcul des consommations d'ECS dépend du type d'installation (individuelle ou collective).

**Si le système de production d'ECS est collectif :**

La consommation d'ECS totale de l'immeuble est calculée à partir du besoin d'ECS de l'immeuble et des caractéristiques de l'installation collective (voir paragraphe 11.2).

**Si le système de production d'ECS est individuel :**

Le calcul des consommations d'ECS est effectué sur la base d'un appartement « moyen », défini au paragraphe 17.1.2.

Les consommations d'ECS sont calculées à partir du besoin d'ECS de l'appartement « moyen » (obtenu en divisant le besoin d'ECS de l'immeuble par le nombre de logements $Nblgt$) et des caractéristiques de l'installation individuelle considérée.

Les consommations obtenues pour chaque appartement « moyen » sont ensuite multipliées par le nombre d'appartements équipés du type de système considéré dans l'immeuble, puis additionnées afin d'obtenir la consommation totale d'ECS de l'immeuble.

#### 17.1.4 Calcul des consommations de chauffage

##### 17.1.4.1 Calcul du besoin de chauffage de l'immeuble (hors pertes récupérées)

Le calcul du besoin de chauffage BV (hors pertes récupérées) s'effectue à l'échelle de l'immeuble :

- L'enveloppe globale de l'immeuble est considérée pour le calcul, en tenant compte ou non des espaces communs dans le volume chauffé (voir paragraphe 17.1.1.3) ;
- Les caractéristiques des menuiseries observées sur l'échantillon des appartements visités sont extrapolées à l'immeuble : pour un motif donné (dimensions) de menuiserie, le ratio des caractéristiques différentes observées sur l'échantillon est extrapolé à l'ensemble des fenêtres de même motif de l'immeuble ;
- Le calcul des apports solaires s'effectue à l'échelle de l'immeuble.

##### 17.1.4.2 Calcul des pertes récupérées pour le chauffage et de la consommation de chauffage

La connaissance des GV et des pertes récupérées permet de calculer le besoin de chauffage et de refroidissement à l'échelle de l'immeuble. Le calcul des pertes récupérées pour le chauffage dépend du type de chauffage et de production d'ECS.

**Si le chauffage est collectif et la production d'ECS est collective :**

Les pertes de génération de chauffage et les pertes de stockage d'ECS ne sont pas récupérées pour le chauffage. Le calcul des pertes de distribution d'ECS récupérées pour le chauffage est réalisé pour l'immeuble. La consommation de chauffage totale de l'immeuble est calculée à partir du besoin de chauffage de l'immeuble et des caractéristiques de l'installation collective.

**Si le chauffage est collectif et la production d'ECS est individuelle :**

Les pertes de génération de chauffage ne sont pas récupérées pour le chauffage. Le calcul des pertes de stockage d'ECS et de distribution d'ECS récupérées pour le chauffage est réalisé à l'immeuble. La consommation de chauffage totale de l'immeuble est calculée à partir du besoin de chauffage de l'immeuble et des caractéristiques de l'installation collective.

**Si le chauffage est individuel et la production d'ECS est collective :**

Les pertes de stockage d'ECS ne sont pas récupérées pour le chauffage. Le calcul des pertes de distribution d'ECS récupérées pour le chauffage est effectué à l'échelle de l'immeuble.

Le calcul des pertes de génération de chauffage récupérées pour le chauffage est réalisé à l'échelle d'un appartement « moyen », puis multiplié par le nombre d'appartements équipés du type de système :

$$Q_{gen\_rec\_j\_immeuble} = \sum_{syst\_i} Q_{gen\_rec\_j\_syst\_i} * Nblgt\_syst\_i\_immeuble$$

Avec :

- $Q_{gen\_rec\_j\_immeuble}$ : pertes de génération de chauffage de l'immeuble
- $Q_{gen\_rec\_j\_syst\_i}$ : pertes de génération de chauffage liées au système i pour un appartement « moyen »
- $Nblgt\_syst\_i\_immeuble$ : nombre d'appartements « moyens » équipés du système i dans l'immeuble (voir paragraphe 17.1.2)

Le calcul des consommations de chauffage est ensuite effectué sur la base d'un appartement « moyen », à partir du besoin de chauffage de l'appartement « moyen » (besoin de chauffage $Bch$ de l'immeuble divisé par $Nblgt$) et des caractéristiques de l'installation individuelle considérée. Les consommations obtenues sont ensuite multipliées par le nombre d'appartements équipés du type de système, puis additionnées.

**Si le chauffage est individuel et la production d'ECS est individuelle :**

Le calcul des pertes de stockage d'ECS et des pertes de distribution d'ECS récupérées pour le chauffage est effectué à l'échelle de l'immeuble. Le calcul des pertes de génération de chauffage récupérées est réalisé à l'échelle d'un appartement « moyen », de la même manière que dans le cas précédent.

Le calcul des consommations de chauffage est effectué sur la base d'un appartement « moyen », à partir du besoin de chauffage de l'appartement « moyen » (besoin de chauffage $Bch$ de l'immeuble divisé par $Nblgt$) et des caractéristiques de l'installation individuelle considérée. Les consommations obtenues sont ensuite multipliées par le nombre d'appartements équipés du type de système, puis additionnées.

#### 17.1.5 Calcul des consommations de refroidissement

Les modalités de calcul des consommations de refroidissement sont identiques aux modalités de calcul des consommations de chauffage.

#### 17.1.6 Calcul des consommations d'éclairage

La consommation d'éclairage totale de l'immeuble est calculée en fonction de la zone climatique et de la surface habitable de l'immeuble.

#### 17.1.7 Calcul des consommations d'auxiliaires

##### 17.1.7.1 Auxiliaires de chauffage, de refroidissement ou d'ECS

**Pour un système collectif :**

La consommation d'auxiliaires d'un système collectif est calculée directement à l'échelle de l'immeuble.

**Pour un système individuel :**

Le calcul des consommations d'auxiliaires des systèmes individuels est effectué sur la base d'un appartement « moyen » (voir paragraphe 17.1.2). Les consommations d'auxiliaires obtenues pour chaque appartement « moyen » sont ensuite multipliées par le nombre d'appartements équipés du type de système considéré dans l'immeuble, puis additionnées afin d'obtenir les consommations d'auxiliaires totales de l'immeuble.

##### 17.1.7.2 Autres auxiliaires

Le calcul des auxiliaires autres que ceux de chauffage et d'ECS est effectué à l'échelle de l'immeuble.

### 17.2 Génération d'un DPE à l'appartement

Deux possibilités sont offertes, selon les cas :

- Réalisation d'un DPE à l'appartement (exemple type : copropriétaire souhaitant mettre son appartement en vente ou en location) ;
- Lors de la réalisation d'un DPE à l'immeuble, génération des DPE des appartements à partir des données de l'immeuble (exemple type : bailleur social souhaitant renouveler l'ensemble des DPE de son parc de logements).

#### 17.2.1 Génération d'un DPE à l'appartement

##### 17.2.1.1 Calcul des consommations de chauffage, de refroidissement, d'ECS et d'auxiliaires

Le calcul des besoins de chauffage, de refroidissement et d'ECS s'effectue toujours à l'échelle de l'appartement. Le calcul du besoin de chauffage s'appuie sur l'enveloppe de l'appartement, en considérant ou non les espaces communs comme des espaces chauffés.

**Traitement des usages individuels :**

En cas de système individuel de chauffage, de refroidissement et/ou d'ECS, le calcul des consommations est réalisé à partir du besoin de l'appartement et des caractéristiques du système individuel, selon la méthode développée dans les chapitres précédents.

**Traitement des usages collectifs :**

En cas de système collectif de chauffage, de refroidissement et/ou d'ECS, les deux cas suivants sont à distinguer :

- Dans le cas des **générateurs autres qu'à combustion**, les consommations de l'appartement sont calculées à partir des caractéristiques du générateur de l'immeuble (effet joule, PAC, réseau de chaleur) ;
- Dans le cas des **générateurs à combustion**, les consommations de l'appartement sont calculées en considérant un générateur individuel virtuel, appelé « générateur équivalent », identique au générateur collectif mais avec des caractéristiques pondérées par le ratio $a = \dfrac{Sh\_appartement}{Sh}$.

Le tableau ci-dessous récapitule la valeur à retenir pour chacune des caractéristiques de l'installation individuelle équivalente :

| Caractéristiques de l'installation individuelle équivalente           | Valeur                                                                                                                                                                               |
| :-------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Puissance nominale                                                    | $Pe = a \times Pn$ du générateur collectif                                                                                                                                           |
| Rendement à pleine charge                                             | $Rpn$ = $Rpn$ du générateur collectif                                                                                                                                                |
| Rendement à charge intermédiaire                                      | $Rpint$ = $Rpint$ du générateur collectif                                                                                                                                            |
| Puissance de la veilleuse                                             | $Pveil = a \times Pveil$ du générateur collectif                                                                                                                                     |
| Pertes à l'arrêt $QP0$                                                | Calcul à partir de la puissance nominale $Pe$ du générateur équivalent                                                                                                               |
| Pertes de stockage du ballon d'ECS                                    | $Qg{,}w = a \times Qg{,}w$ du ballon d'ECS collectif                                                                                                                                 |
| Pertes de génération de chauffage $Q_{gen\_rec\_j}$                   | = 0 (les installations collectives étant positionnées dans des espaces non chauffés, les pertes de stockage d'ECS et de génération de chauffage ne sont pas récupérées)              |
| Pertes de stockage d'ECS $Q_{g,w\_rec\_j}$                            | = 0 (voir ci-dessus)                                                                                                                                                                 |
| Pertes de distribution d'ECS $Q_{rec\_chauff\_j}$                     | À calculer (récupérées)                                                                                                                                                              |
| Rendement de génération $Rg$                                          | Calcul à partir des caractéristiques de l'installation individuelle équivalente                                                                                                      |
| Rendement d'émission $Re$                                             | Calcul à partir des caractéristiques de l'installation individuelle équivalente                                                                                                      |
| Rendement de régulation $Rr$                                          | Calcul à partir des caractéristiques de l'installation individuelle équivalente                                                                                                      |
| Rendement de distribution $Rd$                                        | = $Rd$ de l'installation collective                                                                                                                                                  |
| Intermittence $INT$                                                   | = $INT$ de l'installation collective                                                                                                                                                 |
| Consommation des auxiliaires de génération de chauffage (resp. d'ECS) | Calcul à partir des puissances nominales $Pn$ et des puissances des auxiliaires de génération de l'installation collective, et du besoin de chauffage (resp. d'ECS) de l'appartement |
| Consommation des auxiliaires de distribution de chauffage             | $= a \times$ consommation des auxiliaires de distribution de chauffage calculée à l'échelle de l'immeuble                                                                            |
| Consommation des auxiliaires de distribution d'ECS                    | Calcul à l'immeuble avec le besoin d'ECS de l'appartement                                                                                                                            |
| Consommation des auxiliaires de ventilation                           | $= a \times$ consommation des auxiliaires de ventilation calculée à l'échelle de l'immeuble                                                                                          |

En présence d'une installation de production collective de chauffage et d'ECS, si aucune information n'est communiquée sur les équipements collectifs, un calcul par défaut se fera avec une chaudière atmosphérique mixte standard datant de la construction du bâtiment. L'énergie utilisée par le système sera du fioul. Le réseau de distribution sera non isolé pour le chauffage et l'ECS. Le réseau de distribution d'ECS sera bouclé. Pour les bâtiments construits avant 2003, les chaudières auront une veilleuse. Un ballon de stockage de 50 l par logement sera pris.

##### 17.2.1.2 Calcul des consommations de ventilation

En présence d'une installation mécanique collective pour la ventilation d'un appartement, le calcul des consommations d'auxiliaires se fait à partir des données sur cette installation collective. La puissance des auxiliaires est proratisée sur les surfaces habitables (la puissance d'auxiliaires de ventilation attribuée à l'appartement est celle de l'immeuble multipliée par le rapport de la surface de l'appartement à celle de l'immeuble).

En présence d'une installation mécanique individuelle dans un appartement, l'approche est identique à celle réalisée en maison individuelle.

#### 17.2.2 Génération des DPE des appartements à partir des données de l'immeuble

Lors de la réalisation du DPE d'un immeuble d'habitation collectif, le diagnostiqueur a la possibilité d'établir les DPE individuels de l'ensemble des appartements le constituant. Ces DPE individuels sont établis à partir des informations collectées ou calculées pour la réalisation du DPE de l'immeuble, éventuellement complétées d'informations accessibles depuis l'extérieur des appartements, dans le cas où a minima les menuiseries, les systèmes de ventilation ainsi que les systèmes de chauffage sont similaires.

##### 17.2.2.1 Détermination de la méthode applicable

Les modalités de calcul des consommations de chauffage et des consommations d'ECS des appartements sont déterminées selon l'arbre de décision suivant :

- **Chauffage collectif** → Individualisation des frais de chauffage ?
  - Non → Consommation de chauffage : **méthode 1** (prorata surface habitable)
  - Oui → Consommation de chauffage : **méthode 2** (prorata besoin de chauffage + coef. IFC)
- **Chauffage individuel** → Gestion homogène ?
  - Oui → Consommation de chauffage : **méthode 2**
  - Non → Visite de tous les appartements : méthode « classique » du DPE à l'appartement
- **Production d'ECS** (dans les cas méthode 2) → Gérée de manière homogène ?
  - Oui → Consommation d'ECS : **méthode 1** (prorata besoin d'ECS)
  - Non → Consommation d'ECS : **méthode 2** (système par défaut = moins performant de l'échantillon)

##### 17.2.2.2 Calcul des consommations de chauffage et d'auxiliaires de chauffage

###### 17.2.2.2.1 Chauffage collectif sans individualisation des frais de chauffage (méthode 1)

Dans le cas d'un immeuble avec chauffage collectif et en l'absence d'individualisation des frais de chauffage, les consommations de chauffage des appartements sont calculées à partir de la consommation de chauffage du DPE de l'immeuble, au prorata de la surface habitable. De la même manière, les consommations d'auxiliaires de chauffage de l'immeuble sont réparties entre les appartements au prorata de la surface habitable.

###### 17.2.2.2.2 Chauffage collectif avec individualisation des frais de chauffage OU chauffage individuel et gestion « homogène » (méthode 2)

Les consommations de chauffage de l'immeuble sont réparties entre les appartements en fonction :

- d'une clé de répartition ($Clé\_ap\_i$) égale au rapport du besoin de chauffage de l'appartement sur le besoin de l'immeuble ;
- du coefficient de répartition des frais de chauffage ($coef\_IFC$).

$$Cch\_ap\_i = (1 - coef\_IFC) * \frac{Sh_{ap\_i}}{Sh} * Cch + coef\_IFC * Clé\_ap\_i * Cch$$

$$Caux\_ch\_ap\_i = (1 - coef\_IFC) * \frac{Sh_{ap\_i}}{Sh} * Caux\_ch + coef\_IFC * Clé\_ap\_i * Caux\_ch$$

Avec :

- $Sh_{ap\_i}$ : surface habitable de l'appartement i
- $Sh$ : surface habitable totale de l'immeuble
- $Cch$ : consommation annuelle de chauffage totale de l'immeuble
- $Caux\_ch$ : consommation annuelle des auxiliaires de chauffage totale de l'immeuble
- $coef\_IFC$ : coefficient d'individualisation des frais de chauffage :
  - En cas de chauffage individuel : $coef\_IFC = 1$
  - Valeur par défaut si non disponible : $coef\_IFC = 0{,}7$
- $Clé\_ap\_i$ : clé de répartition basée sur le besoin de chauffage :

$$Clé\_ap\_i = \frac{Bch\_ap\_i}{\sum_i Bch\_ap\_i}$$

Le besoin de chauffage de chaque appartement est estimé selon une méthode de calcul simplifiée s'appuyant uniquement sur la surface habitable de l'appartement et sa position dans l'immeuble. À partir des surfaces de parois déperditives connues à l'échelle de l'immeuble (murs, planchers bas, planchers hauts, menuiseries par orientation), les surfaces par m² de surface habitable des appartements concernés sont calculées. Il est alors possible d'estimer pour chaque appartement les surfaces déperditives opaques et des baies avec leur orientation, et d'en déduire le besoin de chauffage (en négligeant les masques solaires et les pertes récupérées).

###### 17.2.2.2.3 Chauffage individuel et gestion « hétérogène » (méthode « classique » du DPE à l'appartement)

Dans le cas d'un immeuble équipé de systèmes de chauffage individuels, non géré de manière homogène (ex. : copropriété), le calcul des consommations de chauffage et des auxiliaires de chauffage des appartements doit être effectué pour chacun des appartements, selon la méthode de calcul utilisée pour la réalisation d'un DPE à l'appartement (voir paragraphe 17.2.1).

Le diagnostiqueur doit donc visiter l'ensemble des appartements. Si certains logements ne sont pas accessibles, le diagnostiqueur ne pourra pas établir les DPE de ces appartements.

##### 17.2.2.3 Calcul des consommations d'ECS

Les modalités de calcul des consommations d'ECS des appartements sont déterminées selon l'arbre de décision présenté au paragraphe 17.2.2.1.

###### 17.2.2.3.1 Production homogène d'ECS — méthode 1

Dans le cas d'un immeuble équipé d'un système collectif de production d'ECS, ou dans le cas d'un immeuble équipé de systèmes individuels de production d'ECS détenu par un propriétaire unique attestant une gestion homogène, les consommations d'ECS de l'immeuble ($Cecs$) sont réparties entre les appartements au prorata du besoin d'ECS :

$$Cecs\_ap\_i = Cecs * \frac{Becs\_ap\_i}{Becs}$$

Le calcul du besoin d'ECS d'un appartement ne dépendant que de sa surface habitable, aucune donnée d'entrée complémentaire n'est nécessaire.

###### 17.2.2.3.2 Production hétérogène de l'ECS — méthode 2

Dans le cas d'un immeuble équipé de systèmes individuels de production d'ECS, non géré de manière homogène (ex. : copropriété), le calcul des consommations d'ECS des appartements doit être effectué pour chacun des appartements, selon la méthode de calcul utilisée pour la réalisation d'un DPE à l'appartement.

Si le chauffage est collectif, le diagnostiqueur ne dispose pas des caractéristiques des installations individuelles de production d'ECS de l'ensemble des logements. Pour les appartements non visités, un calcul par défaut est effectué avec les caractéristiques du système le moins performant observé dans l'échantillon (pondérées par la surface habitable). Sur les DPE ainsi générés, il est précisé que cette donnée par défaut est issue de l'échantillonnage et peut être différente du système réellement installé.

##### 17.2.2.4 Calcul des consommations de refroidissement

Les modalités de calcul des consommations de refroidissement des appartements s'appuient sur les modalités de calcul des consommations de chauffage (voir paragraphe 17.2.2.1), sans tenir compte du critère relatif à l'individualisation des frais de chauffage.

Dans le cas d'un immeuble avec refroidissement collectif ou dans le cas d'un immeuble avec refroidissement individuel détenu par un propriétaire unique attestant une gestion homogène, les consommations de refroidissement et d'auxiliaires de refroidissement de l'appartement i sont données par :

$$Cref\_ap\_i = Clé\_ap\_i * Cref$$

$$Caux\_ref\_ap\_i = Clé\_ap\_i * Caux\_ref$$

$$Clé\_ap\_i = \frac{Bref\_ap\_i}{\sum_i Bref\_ap\_i}$$

Avec :

- $Cref$ : consommation de refroidissement de l'immeuble (kWh)
- $Caux\_ref$ : consommation des auxiliaires de refroidissement de l'immeuble (kWh)
- $Clé\_ap\_i$ : clé de répartition du besoin de refroidissement sur l'appartement i
- $Bref\_ap\_i$ : besoin de refroidissement de l'appartement i (kWh/an)

##### 17.2.2.5 Calcul des consommations d'auxiliaires (hors auxiliaires de chauffage)

###### 17.2.2.5.1 Auxiliaires d'ECS

Les consommations d'auxiliaires d'ECS des appartements sont déterminées en multipliant les consommations d'auxiliaires d'ECS de l'immeuble par le rapport du besoin d'ECS de l'appartement à celui de l'immeuble.

###### 17.2.2.5.2 Auxiliaires de ventilation

Les consommations d'auxiliaires de ventilation des appartements sont déterminées en multipliant les consommations d'auxiliaires de ventilation de l'immeuble par le rapport de la surface habitable de l'appartement à celle de l'immeuble.

##### 17.2.2.6 Calcul des consommations d'éclairage

Le calcul des consommations d'éclairage s'effectue à partir de la surface habitable de l'appartement concerné.

### 17.3 Chauffage collectif alimentant plusieurs immeubles

Pour un groupe d'immeubles alimenté par une installation collective unique, l'installation de chauffage est traitée comme un réseau de chaleur local. Les émissions de gaz à effet de serre seront calculées à partir des énergies consommées réellement par les générateurs.

### 17.4 Immeuble collectif mixte

Dans le cas où des locaux tertiaires sont présents au sein de l'immeuble à usage principal d'habitation, et que ces locaux sont chauffés par l'installation collective de chauffage de l'immeuble, le calcul du besoin de chauffage de l'immeuble sera fait pour l'ensemble de la surface des logements et des locaux tertiaires, afin que les caractéristiques de l'installation collective de chauffage soient les bonnes.

Le besoin de chauffage des locaux tertiaires sera calculé de la même manière que pour les logements.

Une fois les caractéristiques de l'installation calculées, le besoin de chauffage de l'immeuble sera ramené aux seuls logements.
