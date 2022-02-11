# Modèle d'empreinte climat d'un ferry

## Introduction

**Le problème** : estimer l'empreinte d'un passager sur les Ferries qui relient la métropole à la Corse et à l'Angleterre.

Le Ferry est une alternative sérieuse à l'avion, mais il n'existe aujourd'hui aucun facteur d'émission en CO2e (ni ADEME, ni à l'international, ni dans la littérature scientifique) qui prenne en compte les paramètres suivants :

-   passager en voiture ou non
-   passager en cabine, en siège, ou au sol
-   équipement loisir du bateau : restaurant, bar, piscine, grand couloirs, etc.
-   tonnage fret
-   % de remplissage du bateau

**L'objectif** : un mini-site qui permet de calculer cette empreinte en fonction de paramètres faciles à saisir.

Le message final pourrait par exemple être l'une ou plusieurs de ces affirmations :

-   un voyage en ferry est pire que l'avion en CO2e/km
-   avec une voiture partagée pour < 3 personnes, c'est pire qu'un avion, sinon c'est mieux
-   un voyage en ferry sans voiture représente un dixième de l'empreinte d'un vol équivalent
-   peu importe le nombre de passagers sur un bateau, si on considère que le fret est nécessaire, l'ajout de passagers est négligeable

:::warning
Ceci est un document de méthode. Ce n'est pas _le calcul_ lui-même. Seul le calcul fait foi en termes de mise à jour. Il est [ici](https://futur.eco/ferry/empreinte-par-km).
:::

## Quelle méthode de répartition

### Introduction

#### Le problème

Nous connaissons la consommation d'essences d'un Ferry, nous pouvons donc en déduire les tonnes de CO2e émises pour un trajet donné en km.
Mais ce qu'on entend par Ferry, c'est souvent un bateau qui transporte beaucoup de fret.
Pire : la gamme de services de transport disponibles pour un passager est très large : cela va du passager qui dort au sol dans le couloir à celui qui embarque avec son SUV+caravane et qui profite du Jacuzzi dans l'un des 3 bars du bateau avant de rentrer dans sa cabine XXL.
Ainsi, même si l'on savait que l'empreinte moyenne d'un passager était de 300gCO2e/km (~ comme une voiture sur route), il est intolérable que le passager sobre se voie attribuer la même emprunte que notre passager de luxe.
Nous devons donc _calculer_ l'attribution de l'empreinte en fonction des caractéristiques du billet. Cela peut se faire selon au moins 2 méthodes : par poids, ou par surface.

#### La solution retenue

Nous avons déterminé que la meilleure méthode est un calcul de répartition par poids.
L'ADEME avait privilégié en 2008 une méthode par surface, mais elle a été archivée dans la base carbone, donc invalidée. Elle semblait basée sur une méthode par surface.
Le ministère britannique de l'environnement a choisi une méthode par poids.
La norme EN 16258, déjà datée, autorise les deux méthodes, mais note l'extrême divergence des deux méthodes.
La future norme ISO 14083, en cours de publication, devrait retenir la méthode par poids.
D'autres publications d'armateurs privilégient la méthode par poids.

#### Pourquoi ?

Mais pourquoi privilégier la méthode par poids ?
Tu prends un passager qui va dormir en fauteuil. Son fauteuil + toilettes pèsent 100kg. Il n'utilise pas les restaurants, etc, il reste dormir dans l'espace cinéma qui leur est alloué, tout simplement.
Tu prends une voiture, elle pèse 1500kg. Pour le même poids tu pourrais donc y mettre 15 passagers ! Donc diminuer d'autant l'empreinte du trajet _par personne_.

##### Mais quid de la surface ?

Tu me diras alors, oui mais ces passagers ils prennent plus de surface que la voiture.
D'une, ce n'est pas certain du tout (par exemple, les ponts de chargement des voitures ne font en général pas 2m de haut mais plutôt 4, pour accomoder les camions ?), et c'est difficile à calculer
De deux, ce n'est pas la surface qui coûte des kg de pétrole brulés, mais le poids du bateau : le poids fait s'enfoncer le bateau, et c'est la force de frottement de l'eau sur la partie immergée contre laquelle il faut lutter.

La surface ne semble pas manquer sur le bateau : les parties _strictement nécessaires_ que sont les salles d'habitation (cabines ou sièges) ne représentent qu'une faible partie de la surface souvent utilisée par des zones vides, des loisirs, des commerces, qui pourrait donc être utilisée pour densifier en passagers (jusqu'à une certaine limite, certes, à définir ?).

##### Mais quid du poids de l'infrastructure du bateau lui-même ?

Vous me direz, oui mais le poids des passagers / fret, bref ce qu'on met dedans pour l'opérer commercialement n'est qu'une partie du poids total : le ferry de base a sa coque, son lestage pour l'équilibrer, etc.
Eh bien si l'on peut remplacer une voiture par 15 personnes, c'est qu'on peut mieux amortir _par personne_ tout ce matériel de base pour diminuer l'empreinte par passager transporté !

On attribue donc aux passagers leur part de poids, donc aussi leur part de la consommation du matos lui-même qui fait avancer le bateau.

À titre d'exemple, quel que soit le rapport voitures / passagers, le linéaire de barrière sur les ponts est le même. D'autres éléments de poids eux dépendent du nombre de passager, il faut donc les prendre en compte dans le calcul (quantité d'eau embarquée, canots de sauvetage, etc.).

#### N'y a-t-il pas d'autres limitations à ce modèle ?

Si bien sûr. On peut voir notamment la problématique du centre de gravité du bateau, qui doit être assez bas (cf [cette vidéo très pédagogique](https://youtu.be/Y_c1UNEdEsk?t=1367)). Ces contraintes de répartition du poids sont-elles à même de mettre en cause ce modèle ? Surtout, à partir de quel seuil de densité ? Les ponts supérieurs dédiés aux passagers sont-ils volontairement peu denses ? Peut-être, seuls les armateurs ou opérateurs pourront nous répondre.

Toujours est-il que les ponts actuellement utilisés pour le fret et les véhicules passager, pourraient être convertis en "habitations" sans problème, et le poids des ponts passagers dédiés à des services accessoires et des cabines ou cabines peu remplies, pourrait être troqué pour des "habitations" plus sobres. À ce titre, voir la diversité de cabines de ce ferry japonais, de la cabine luxe au dortoir commun, dans [cette vidéo](https://youtu.be/xnXrOiG21H0?t=401).

### La base : trouver l'équation physique

La façon la plus rigoureuse pour avancer serait de modéliser la formule de consommation de carburant du bâteau. Ses paramètres, et leur poids (facteur, carré, cube) nous donneraient alors les clefs de la méthode de répartition du bateau.

Dans ce document, très bien illustré et très fourni en formule mathématiques, j'ai l'impression qu'il y a tout pour construire la formule de calcul physique.

> The total fuel power, Pfuel (power deliv-
> ered through the fuel), required for pro-
> pelling a ship through water is gov-
> erned by the fuel equation. [Page 9]

[Lien original](https://www.man-es.com/docs/default-source/marine/tools/basic-principles-of-ship-propulsion_web_links.pdf?sfvrsn=12d1b862_10) / [Sauvegarde](https://github.com/laem/futureco-data/files/7995758/basic-principles-of-ship-propulsion_web_links.pdf)

Voir notamment les illustrations suivantes :

![](https://i.imgur.com/K6DRmUc.png)

Source : une [ancienne version](https://github.com/laem/futureco-data/files/7995758/basic-principles-of-ship-propulsion_web_links.pdf) du document ci-dessus.

![](https://i.imgur.com/vzNOKWS.png)

### Première version simplifiée : le poids

Ce document permet-il d'affirmer que c'est selon le poids que nous devons faire la répartition ? J'ai l'impression que oui : les forces dominantes sont clairement celles qui sont proportionnelles au déplacement du bateau, donc au poids embarqué.

Attention : rappelons-nous l'objectif, qui n'est pas de proposer une empreinte climat parfaite, mais de donner l'estimation la moins pire, meilleure que les estimations existentes, le plus vite possible.

Je n'ai bien sûr pas la prétention d'être expert en propulsion des navires, donc si vous lisez ces lignes et trouvez le raisonnement imparfait ou problématique : faites mieux, ajoutons d'autres paramètres importants en plus du poids, ou revoyons carrément les conclusions de cette v1 du calcul 🙂.

#### Attention à la vitesse

Note importante : la 🐇 vitesse du bateau est clairement une information capitale pour le calcul de l'empreinte, car elle fait évoluer la consommation au cube ! À prendre en compte pour une v2 du calcul, surtout que le passager à parfois le choix entre des bâteaux de jour plus rapides, ou de nuit plus lents.

> Cet [article Les Echos](https://www.lesechos.fr/idees-debats/editos-analyses/les-marins-se-mettent-au-vert-1147056) contient quelques chiffres sur la réduction de la vitesse, un facteur clef pour réduire la conso :

> Often, ship power is roughly proportional to the cube of the speed, so doubling (2x) the speed of a destroyer from 15 knots to 30 knots will require 23 = 8 times as much power!

[source page 9](https://www.usna.edu/NAOE/_files/documents/Courses/EN400/02.07%20Chapter%207.pdf&page=9)

Cette information ne nous intéresse pas pour la répartition des poids, mais elle reste fondamentale pour l'utilisateur qui aurait le loisir de choisir entre deux bâteaux navigant à une vitesse différente. On pense en particulier à l'heure du voyage : comme pour le train, on peut s'attendre à ce qu'un voyage de nuit permette de baisser radicalement la vitesse, les passager s ayant une grande tolérance au temps passé sur le bateau. Cependant, le voyage de nuit peut multiplier l'espace en cabine nécessaire. Il faut donc jongler entre ces deux points contradicto ires, et voir lequel l'emporte.

#### Autres paramètres

Finalement, n'oublions pas qu'un bateau en condition réelles fait aussi face au vent, au courant et à la houle (qu'il ne faut pas confondre à la résistance des vagues créées par le bateau), qui peuvent bien sûr changer la donne.

> For a ship steaming into a 20-knot wind, ship’s resistance may be increased by up to 25-30%.

Pourtant, il est intéressant de noter que pour un aller-retour, on peut supposer a priori que ces forces sont en partie compensés dans le sens inverse. Il faudrait cependant le confirmer. On peut imaginer par exemple que les bateaux prennent consciencieusement en compte ces courants et vents, notamment en changean t de trajectoire pour optimiser la consommation de carburant.

Le taux de remplissage est aussi un paramètre super important, mais comment l'obtenir ? THETHIS nous donne les taux moyens, mais que peut-on en faire ? Aller dans un bateau au taux faible, c'est améliorer ce taux. Privilégier un bateau au taux fort, c'est envoyer un message à la compagnie dans le bon sens. A noter le taux influence forcément le prix (à choix voiture cabine constants), mais dans quel sens ? Si le bateau est plein, donc rentabilisé, l'entreprise pourrait brader les places restants. Elle pourrait aussi considérer qu'il y a bcp de demande, donc multiplier les prix...

Le plus simple est probablement de ne pas prendre en compte cette donnée pour une 1ère version du calcul.

Note : la documentation base carbone contient un tableau de taux de remplissage : https://bilans-ges.ademe.fr/documentation/UPLOAD_DOC_FR/index.htm?maritime2.htm

### Que dit la loi européenne Thetis-MRV ?

Nous avons la chance semble-t-il d'être dans l'Union Européenne qui a imposé un cadre déclaratif obligeant les compagnies de ferries à déclarer chaque année la pollution en CO2e de leurs bateaux.

Détails :

-   https://www.greenferries.org/doc/computed_stats/
-   quelques détails du calcul en annexe I https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX:02015R0757-20161216
-   et ici C.2.9. Method for determining the split of fuel consumption into freight and passenger part (for ro-pax ships only): https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=celex:32016R1927
-   qui semble renvoyer vers la norme nf-en-16258 https://www.boutique.afnor.org/fr-fr/norme/nf-en-16258/methodologie-pour-le-calcul-et-la-declaration-de-la-consommation-denergie-e/fa163709/1306#AreasStoreProductsSummaryView, donc le choix de la méthode (par m² ou par kg) doit être fait et indiqué pour pouvoir comparer les résultats

Mais face à cette grosse base de données, la question qui nous importe est celle-ci : la loi contient-elle un guide pour savoir comment faire cette répartition, ou chaque armateur est-il libre ? C'est ici :

> Note 14 : Select either ‘Mass method’ or ‘Area method’"

Ça voudrait dire que chaque compagnie pourrait faire son choix ? Ce serait aberrant. Ce tableau est un template que les armateurs doivent appliquer.

![](https://i.imgur.com/Sm4T8VA.png)

On arrive donc à la norme NF EN 16258 Décembre 2012.

Malheureusement, cette norme n'est pas disponible sur internet et coûte... 350€ !

On y apprends cependant l'existence de 2 méthodes d'allocation : par poids et par surface, et l'incohérence totale entre les résultats de ces 2 méthodes ^^

![](https://i.imgur.com/NS3QgIx.png)

![](https://i.imgur.com/pwylbVy.png)

![](https://i.imgur.com/ZV1XILe.png)

Question donc : peut-on avoir l'information de la méthode utilisée (masse ou surface) pour les différents bateaux de Theti-MRV ? Non, elle me semble inaccessible. On a posé la question aux responsables... on verra la réponse.

On lira encore une fois ici que les deux méthodes sont complètement contradictoires 😥.

![](https://i.imgur.com/JgTkvoQ.png)

Source : LIGHTHOUSE REPORTS
Transport work and emissions
in MRV; methods and potential
use of data

À noter : les voitures des passagers sont bien inclus dans la partie "passagers", et pas "freight". Heuresement ! Mais bon, on pouvait s'attendre au pire.

![](https://i.imgur.com/1K6Jq1f.png)

Source : Guidance/Best practices document on monitoring and
reporting of fuel consumption, CO2 emissions and other
relevant parameters pursuant to Regulation 2015/757 on
monitoring, reporting and verification emissions from
maritime transport

#### Les "vérificateurs" des relevés Thetis-MRV

[Ici](https://www.verifavia-shipping.com/shipping-carbon-emissions-verification/shipping-mrv-regulation-the-uk-monitoring-reporting-verification-uk-mrv-240.php) on peut voir la doc d'un des vérificateurs des données Thethis MRV. On apprend notamment qu'à partir de 2022 l'UK aura son propre clone de cette loi, mais pas grand chose de plus à propos de la méthode de répartition à privilégier.

En conclusion, à ce stade (et nous y reviendrons par la suite), Thetis-MRV ne nous aident pas dans notre calcul de répartition, même si de façon peu convainquante, la loi valide la méthode par poids comme une possibilité.

### Publication de Deltamarin confirmant la méthode poids

Un document d'un armateur qui parle en long et en large de la métrique EEDI.

Page 70, on touche presque au but sur notre question de l'allocation.

Les auteurs proposent de faire l'attribution passagers vs fret en calculant le volume de la zone passager et en déduisant le poids, à comparer au poids du fret.

> Sauf qu'ils disent "le poids des véhicules est inclus dans le calcul passager", or j'ai beau essayer de le trouver... Où est-il donc ? Ce tableau nous permet donc d'estimer une empreinte en CO2/km sur 2 exemples de bateaux mais sans différencier avec voiture / sans voiture.

[source](http://emsa.europa.eu/opr-documents/opr-reports/download/1517/1310/23.html) / [sauvegarde](https://github.com/laem/futureco-data/files/8004404/deltamarin-eedi-study-for-emsa---final-report-.1.pdf)

![](https://i.imgur.com/4o64Po9.png)

> GT Gross tonnage
> nm miles nautiques

C'est une base très intéressante pour le calcul du poids des équipements, et la comparaison du résultat final.

Comme noté page 71 dans la publication, ce principe de calcul donne des résultats très précis, _mais_ la répartition ro vs pax dépend très fortement du bateau en question.

:::info
En somme, notre travail ici consiste simplement à reprendre ce modèle d'attribution du poids, le sophistiquer, et le présenter dans une interface Web.
:::

### Publication du ministère de l'environnement / ADEME

Ici, une publication ministère environnement / ADEME qui constituait un guide pour l'affichage légal de l'empreinte

http://www.bretagne.developpement-durable.gouv.fr/IMG/pdf/guide2_information_co2_cle7a3f22.pdf

Autre source (2013) : https://www.ademe.fr/sites/default/files/assets/documents/86275_7715-guide-information-co2-transporteurs.pdf

[Autre source 2018](https://www.ecologie.gouv.fr/sites/default/files/Info%20GES_Guide%20m%C3%A9thodo.pdf) page 136, récupérée via la page d'information de l'[obligation légale d'affichage GES des transports](https://www.ecologie.gouv.fr/information-ges-des-prestations-transport)

Les chiffres page 133 sont impressionnants ! Et ils sont exactement ceux de la base carbone, qui ont donc été archivés, mais ne retenant que la composante CO2 (pas les autres GES) : ![](https://i.imgur.com/65vfTqu.png)

Or ces chiffres sont donc archivés. On comprend donc que le plus probable est que **l'ADEME ne les a pas considérés crédibles**, ou que les opérateurs de ferries les contestaient. https://bilans-ges.ademe.fr/fr/basecarbone/donnees-consulter/liste-element?recherche=ferry

Ce tableau est très intéressant, il donne une répartition selon le critère passager / voiture / fret

![](https://i.imgur.com/vydM6pr.png).

Il est aussi présent dans l'article de loi https://www.legifrance.gouv.fr/loda/id/JORFTEXT000025714522/ chercher le tableau "transport maritime"

Le fait qu'on trouve une consommation de carburant beaucoup plus élevée pour un passager qu'une voiture laisse penser que pour faire ce calcul, l'ensemble de l'empreinte du passager à bord a été utilisé (cabines, restaurant etc.), et qu'elle est conséquente !

Où est-donc ce calcul ? Page 137, on obtient plus d'informations.

> le prestataire identifie le nombre de ponts passagers et le nombre de ponts marchandises de chaque navire de la ligne. Les consommations de carburants doivent être réparties entre passagers et marchandises selon la proportion du nombre de ponts respectifs

> si les ponts marchandises sont utilisés à la fois pour des poids lourds et des véhicules légers (voitures, caravanes, camping cars, motocycles appartenant à des passagers), la consommation de carburant correspondant aux ponts marchandises peut être répartie en fonction de la surface respective utilisée par les poids lourds d’une part et par les véhicules légers d’autre part

Et en effet, on lit plus haut que `Le décret n° 2011-1336 indique que la répartition, entre marchandises (dont les véhicules) et les passagers, doit être faite en fonction du nombre de ponts.`

![](https://i.imgur.com/ZzpiUmg.png)

C'est donc une autre méthode encore qui est utilisée ici. Plutôt que de regarder le poids, ou le prix, on utilise le volume.

Raisonner en nombre de ponts, au vu du plan de ce ferry (Vizzavona) français, ça parait... aberrant 😫

![](https://i.imgur.com/ymk7nVL.jpg)

Voir aussi ce plan super détaillé de 2 ponts du Jean Nicoli

![](https://i.imgur.com/1wilp06.jpg)

Et ce 2ème plan plus général du Jean Nicoli

![](https://static.wixstatic.com/media/970e09_0e910c39b94c4431a854dec5c022a6b0~mv2.png/v1/crop/x_0,y_25,w_1013,h_1734/fill/w_831,h_1422,al_c,q_95,usm_0.66_1.00_0.01/970e09_0e910c39b94c4431a854dec5c022a6b0~mv2.webp)

Et c'est peut-être la raison pour laquelle ces facteurs d'émissions ont été archivés (donc non utilisables) dans la base carbone.

Pourtant, la suite pour les ferries entre îles fait un calcul en poids, p.140. !

On obtient alors le facteur de

> Information CO2 = 0,794 kg CO2 / t.km x (1 x 100 kg) x 40 km = 3,18 kg CO2.

#### Étude de 2009 citée par l'ADEME

On retrouve en 2009 une étude citée par l'ADEME qui semble être responsable des facteurs archivés de la base carbone. [Source](http://www.shortsea.fr/sites/default/files/fichiers/public/7ab8212041f6701b504fe3a5b66e1d78_RAPPORT-FINAL-Efficacite-energetique-et-environnementale-du-transport-maritime-Avril-09.pdf)

Page 61, on voit :

![](https://i.imgur.com/TG3ObiV.png)

Mais quel est donc de "profil optimisé" qui divise par ~5 l'empreinte !!?

> Dans les catégories de navires suivantes : porte conteneurs, ferries et roulier, les profils
> d’exploitation moyens sont issus des données fournies par les armateurs via le
> questionnaire.

> Dans le cas du profil optimisé, nous avons travaillé sur des hypothèses de chargement
> supérieures aux conditions moyennes. Ce profil montre donc les résultats en termes
> d’efficacité énergétique et environnementale, si les navires étaient chargés à limite de leur
> capacité en port en lourd (tpl).

Cela laisse entendre donc que ce sont des résultats théoriques, mais qui pourraient rendre le transport maritime incroyablement moins polluant.

p.49 on obtient le détail des profils pour les ferries, c'est intéressant, car ça parle de l'ectrême saisonnalité du transport de passagers.

![](https://i.imgur.com/WXoEuRe.png)

Ce semble être ce taux de remplissage qui donne l'empreinte en mode "optimisé". Ça me semble être un raccourci farfelu, car ajouter des voitures alourdit le bateau qui consomme donc plus...

Par contre, ce qui est intéressant pour nous, c'est que le 38% de passagers ou bien moins sur les ferries nous permettrait peut-être d'affiner le calcul des infrastructures partagées (restaurant, etc.) ?

Pas sûr, car si on prend l'empreinte des GHG factors britanniques, c'est une empreinte réelle, donc le poids non utilisé, la perte d'opportunité, est tout simplement attribuée aux passagers.

Reste donc une question centrale : pourquoi ces données d'abord acceptées par l'ADEME ont été archivées ?

Malheureusement, l'annexe 5 était sensé nous donner la méthode de répartition. Sauf qu'elle est manquante dans le document... J'ai essayé de contacter les 2 sociétés qui ont écrit le rapport, et shortsea.Fr qui l'héberge, mais elles semblent toutes disparues :/

Par contre, page 40 on lit, ceci. Ça laisse entendre une répartition sur le poids, mais pas le poids du contenu transporté, mais sur le contenant ! Ainsi il semble que le poids des ponts en acier soient l'élément clef, et donc cette méthode de répartition serait très similaire à la répartition par surface. Impossible de savoir s'ils ont par exemple considéré le poids des cabines, des restaurants, des voitures, des passagers en l'absence de l'annexe.

![](https://i.imgur.com/drCAmlh.png)

Pourtant, la page 65 nous donne la répartition des émissions. Au vu des résultats et de nos recherches précédentes, on peut donc supposer que c'est bien la méthode de la surface qui a été utilisée.

![](https://i.imgur.com/u7eAQs8.png)

On peut remarquer aussi qu'en

-   ferry de jour, véhicule = 150gCO2/tonne.km alors que 901gCO2/pax.km
-   ferry de nuit, véhicule = 241gCO2/tonne.km alors que 422gCO2/pax.km

Comment expliquer une telle inversion si la méthode était le poids, alors qu'un passager en ferry de nuit a bien sûr besoin de cabine, restauration, bar etc. ?

Comment expliquer aussi que les camions et remorques n'auraient que 28% des émissions en RoPAX, et les véhicules légers 18% ?

On lit "tonnage annuel moyen marchandises" (M de tonnes/ milles) :
Nuit 167
Jour 280
RoPax 104

Alors que TONNAGE ANNUEL MOYEN VEHICULES LEGERS (M de tonnes/milles) :
Nuit 18
Jour 48
RoPax 17

Alors que donc le rapport de poids marchandises / voitures RoPax est de plus de 6 ?

Encore un autre indice : le tableau G.2 de la norme EN 16258 qui compare les méthodes poids vs surface montre l'inversion de situation entre les deux, [ici](https://i.imgur.com/ZV1XILe.png).

Elle laisse clairement conclure que la méthode utilisée dans l'étude précédente est basée sur la surface.

--> c'est définitivement un calcul non basé sur le poids mais sur la surface.

Il semblerait d'ailleurs, d'après les informations que j'ai pu obtenir, que la future norme ISO, pour des questions de simplification et d’harmonisation entre tous les modes, prévoierait de faire une allocation entre passagers et marchandises basée sur la masse respective.

### Liens et autres méthodes intéressantes

-   dans cet article, quelqu'un se pose la même question pour son voyage en espagne. En bref, les chiffres trouvés sont incohérents. https://tomothinks.com/ferry-spain-eco-friendly-flying

-   ici une évaluation historique des émissions des flottes maritimes https://agupubs.onlinelibrary.wiley.com/doi/full/10.1029/2006JD007630

-   ici une approche par prix : les voitures coûtent plus cher, donc "consomment plus". On obtient l'énorme chiffre de > 1kg de CO2e / km voiture.

http://www.carbontracking.com/reports/irish_ferries_emissions_calculation.pdf

-   page 66 [ici](https://www.ecotransit.org/download/EcoTransIT_World_Methodology_ShortVersion_2019.pdf) on trouve une formule de calcul par Ecostransit, mais seulement destinée au fret. Donc vaguement intéressant pour nous, le problème n'est pas là.

-   ici on peut voir une comparaison sur le célèbre pont rouge de San Francisco entre traverser le goulet en voiture ou en Ferry.

Très intéressant pour confirmer les chiffres, mais ne permet pas de faire un modèle passagers - voitures - fret.

https://www.mdpi.com/1996-1073/4/2/239

12,6 passenger-miles per gallon
[1 gallon => 20 pounds CO2](https://climatekids.nasa.gov/review/carbon/gasoline.html) => 9kg CO2
1,4 pm / kgCO2
700gCO2/pm

-   peut-être une autre source à investiguer ici : https://www.marineinsight.com/naval-architecture/power-requirement-ship-estimated/

## Comment passer d'un poids à une empreinte en CO2e/km ?

Nous avons exploré 3 possibilités pour passer de tonnes à CO2e/km.

### Naïve, multiplication par un facteur unique d'efficacité

Simplement multiplier par 30g / tonne, une donnée ADEME, méthode simple mais qui ignore les particularités du transport de voyageur.

La publication Deltamarin, table 20, citée ci-dessus, laisse bien entendre qu'on peut multiplier l'EEDI par le poids. Donc qu'on pourrait peut-être le faire sur l'EIV aussi et obtenir l'empreinte d'un billet passager indépendamment du fret.

Peut-on donc carrément utiliser le facteur de "technical efficiency" (EIV) des bateaux [de Greenferries/Thetis](https://www.greenferries.org/doc/technical_efficiency/) ? Ce serait ultra simple. Le bateau [Jean Nicoli 6g](https://www.greenferries.org/ships/jean-nicoli-9161948). Probablement très lié à la vitesse et à l'âge du bateau.

> They are theoretical measures: they rely on applying formulas based on the characteristics of a ship, not on experimental measures.

Si l'on prend le Jean Nicoli à EIV (6.04 gCO2/t·nm), et qu'on considère qu'une voiture c'est 1,5 tonne + 1 tonne / passenger (deltamarin table 20 ex. 1), on obtient 12g CO2e/nm donc ~20g CO2e/km. Chiffre étonemment bas qui reflète probablement le faible EIV du Nicoli. Sans parler du passager sans cabine, qui chiffrerait alors à quelques grammes !

D'ailleurs, le graphe fait par Greenferries montre bien que soit l'EIV ne veut pas dire grand chose, soit les g/pax.km sont pétés. Je privilégie la deuxième option... due à la variation de poids des billets passager, ou à l'usage de méthodes hétérogènes par les compagnies de ferries (ici Corsica Linea) qui n'attribuent pas le poids passager vs fret selon les mêmes méthodes.

Le problème de cette méthode, c'est qu'elle ignore qu'une partie du poid est allouée ni au fret, ni aux passagers (périmètre large cabines restaus etc.) mais au bateau de base. Ce serait une mesure de tonne marginale, mais il reste à attribuer une part de la base.

Comment l'estimer ? Peut-être simplement via le tonnage à vide du bateau vs chargé :) ? Une piste, à investiguer.

➡️ Cette méthode semble donc trop simpliste au vu des connaissances actuelles.

### À partir des données Greenferries / Thetis-MRV

L'initiative greenferries.org est un site qui expose de façon salvatrice les données obligatoires de la loi Thetis-MRV. Mais reste à déterminer si les facteurs d'émission calculés et présentés sont utilisables dans notre cas d'usage. Or, la réponse est plutôt non.

Comment se fait-il qu'une telle différence sur même chemin Marseille Ajaccio ?

https://www.greenferries.org/ships/mega-andrea-8306498/
vs https://www.greenferries.org/ships/jean-nicoli-9161948/

Il suffit de prendre une route et de comparer le 1er tableau : rien ne va https://www.greenferries.org/routes/toulon-fr-ajaccio-fr, même pour la série de Mega Express.

Il semble y avoir une corrélation vitesse - kg·CO₂/n.mile.

Voir les mega express qui vont plus vite que d'autres, ou encore le [Lota](https://www.greenferries.org/ships/pascal-lota-9365398) qui va à 38 km/h.

**La vitesse** est un paramètre important qu'on dispose via greenferries pour chaque bateau ** mais qui n'explique pas l'immense variabilité** de l'attribution fret / passagers.

Qui est donc probablement due à l'application du calcul par masse vs surface. Ce serait dingue... mais possible, la loi semble, comme on l'a vu dans la section "Répartition", l'autoriser voir cadrer la possibilité d'utiliser deux méthodes contradictoires.

🔭 Peut-on récupérer l'info de la méthode utilisée ? Non, ça semble pas possible : c'est la réponse des responsables Européens : "Nous n'avons pas accès aux calculs"... et je suspecte qu'elle soit la surface. Hypothèse : peut-être pour avantager le fret, car il est plus sensible politiquement et économiquement à son empreinte, que celle des passagers ?

### À partir des chiffres de la "base carbone" britannique

Ici page 71, on a une méthodo du gouvernement britanique, basés une une étude de 2007 : https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/904215/2019-ghg-conversion-factors-methodology-v01-02.pdf.

![](https://i.imgur.com/ZEcUfZO.png)

> La source, _Best Foot Forward (BFF) work for the Passenger Shipping Association (PSA) (BFF, 2007)_, est malheureusement vieille et introuvable...

Elle semble super simpliste : elle donne aux passagers / passagers avec voiture une proportion des émissions du ferry directement liée au rapport de poids. Sauf qu'un passager n'est pas que son poids et ses bagages : il y a toute l'infrastructure (cabines : lits, ...; loisirs : restaurant, bar, personnel, piscine...; couloirs, escaliers...). Cela dit, il est déjà notable que les chiffres anglais distinguent passager sans voiture et passager en voiture.

Attention à ne pas être trompé par ces premiers chiffres _très faibles_, car ils sont en WTT pour Well To Tank, donc sans l'étape d'_utilisation_ du pétrole :

Activity Type Unit kg CO2e
WTT- ferry Foot passenger passenger.km 0,00421
Car passenger passenger.km 0,02909
Average (all passenger) passenger.km 0,02535

:::info
**Voilà les bons chiffres** de [leur tableur "full set" 2021](https://www.gov.uk/government/publications/greenhouse-gas-reporting-conversion-factors-2021) :

Type Unit kg CO2e
Foot passenger passenger.km 0,01874
Car passenger passenger.km 0,12952
Average (all passenger) passenger.km 0,11286

Ces nouveaux chiffres incluent-ils la part WTT ? Non, d'après [ce document d'explication, table 2](https://www.gov.uk/government/publications/transport-energy-and-environment-statistics-notes-and-definitions/journey-emissions-comparisons-methodology-and-guidance), il faut les ajouter aux chiffres WTT de l'onglet suivant.

> Note : je ne sais pas ce qu'on peut faire de la moyenne "all passengers"
> :::

:::info
Rappelons que notre hypothèse de travail est que l'empreinte d'un passager (ou du fret) est dépendante de son poids. Ainsi, nous attribuons un poids à un billet de transport, qui a des caractéristiques entrainant un poids.

La base britannique respecte donc le même principe mais avec une allocation de poids différente, supposément donnée dans [la notice](https://assets.publishing.service.gov.uk/government/uploads/system/uploads/attachment_data/file/904215/2019-ghg-conversion-factors-methodology-v01-02.pdf) page 71. Or, quand on veut reconstruire le facteur passager avec voiture à partir du passager, (18,74÷100)×(100+1250), on trouve 252,99g, pas 129,52g.

On peut donc conclure qu'ils attribuent non pas une voiture à un passager, mais une voiture pour x passagers, (18,74÷100)×(100+1250), ce qui donne x~2,1. Si cette hypothèse est bonne, alors selon eux on a 0.1874gCO2e/kg embarqué.

Heureusement, on a les données du fret "RoRo-Ferry" basées d'après la notice PDF sur la même étude, donc on peut supposer une linéarité du calcul.

> Large RoPax ferry Average tonne.km 0,37667 kgCO2e

> À noter, le framework GLEC donne en annexe de [son document](https://smartfreightcentre.sharepoint.com/SFC/Forms/AllItems.aspx?id=%2FSFC%2F3%20COMMUNICATION%2FPublications%2FSFC%20Publications%2FGLEC%2F2020%5FCadre%5FGLEC%5FNovembre%2Epdf&parent=%2FSFC%2F3%20COMMUNICATION%2FPublications%2FSFC%20Publications%2FGLEC&p=true) des valeurs par tonne.km. Je n'arrive pas à lire le tableau : je ne sais pas si c'est ~200gCO2e ou le double (deux carburants, deux lignes), mais l'ordre de grandeur est le même. La source serait Ecotransit et reposerait sur une allocation poids.

Donc 377gCO2e / tonne, soit 0,377gCO2e / kg. On n'est pas si loin des 0,19gCO2e/kg plus haut. On peut faire l'hypothèse que ce qu'ils considèrent une tonne de fret, c'est en considérant le poids du camion (le contenant), soit dans la notice 22.173 tonnes pour transporter 13.624 tonnes, donc 1,6 tonnes réelles en pratique pour 1 tonne transportée, et ainsi le ratio deviendrait 0.23gCO2e/kg pour le fret, ce qui nous fait retomber proche des 0.19 plus haut, malgré une différence inexpliquée.

Ainsi, les données britanniques nous donnent un ordre de grandeur de ratio de ~0.20gCO2e/kg soit 200gCO2e/tonne.

Au vu de l'incertitude importante de ces chiffres, nous négligeons la part Well to Tank évoquée plus haut qui n'augmenterait l'empreinte que de 22% sans changer l'ordre de grandeur.

:::

Cette étude, bien qu'aux chiffres imprécis et à la source manquante, confirme notre principe de calcul fondamental.

Rien ne nous empêchera d'améliorer la précision et les sources de ce chiffre en gCO2e/kg.km, notamment en se plongeant plus profondément dans la définition et les statistiques d'EEDI via la publication de Deltamarin citée plus haut.

On note notamment cette remarque :

> It is important to note that this emission factor is relevant only for ferries carrying passengers and freight and that emission factors for passenger only ferries are likely to be significantly higher. No suitable dataset has yet been identified to enable the production of a ferry emission factor for passenger-only services (which were excluded from the BFF (2007) work).

Il n'est pas aisé de comprendre pourquoi cela changerait les chiffres. Peut-être parce que le fret permet d'atteindre des poids tellement considérables que l'ajout de passagers ne fait que changer le poids marginal, un seuil initial "en perte" étant alors largement dépassé ?

## Le calcul

Maintenant la méthode définie, place au calcul du poids des différents billets !

C'est ici, et dans les autres fichiers yaml du même dossier.

C'est iné v0 du calcul, qui évoluera.

https://github.com/laem/futureco/blob/fv2/source/sites/publicodes/ferry/index.yaml
