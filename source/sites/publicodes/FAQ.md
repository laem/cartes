Voici quelques réponses aux questions très souvent posées sur les lacunes du calcul, les points surprenants ou les travaux en cours.



<h3 id="foyer">Je ne comprends pas si le calcul est fait par foyer ou par individu</h3>

Répondez simplement aux questions. Si l'on vous demande la surface ou la consommation de votre logement, répondez simplement à la question. Nous vous demanderons par la suite combien de personnes vivent sous ce toit pour en déduire votre empreinte *individuelle*. 

Même raisonnement pour la voiture : vous répondez le nombre de km que vous faites vous en tant qu'individu. Nous déduirons votre empreinte individuelle en divisant par le nombre de passagers moyens de la voiture. 

Pour le numérique et l'électroménager, il y a en effet une confusion, que nous tâcherons d'améliorer : nous ne divisons pas par le nombre de personnes du foyer. Si vous le pouvez, répondez donc pour vous en tant qu'individu. Mais comme vous le verrez, ces postes ne sont pas les plus importants en général dans l'empreinte totale.
 
Voir [113](https://github.com/betagouv/ecolab-data/issues/113).

 ### J'ai souscrit à un contrat d'électricité "verte" mais je ne vois pas cette question

Quand on est abonné à une offre de fourniture d'électricité dite "verte", l'empreinte de notre consommation d'électricité est celle du réseau électrique français, unique et partagé par tout le monde. Elle est particulièrement [peu émettrice de gaz à effet de serre en France](https://electricitymap.org) grâce à la part du nucléaire et des barrages hydrauliques. 

Les chiffres parfois fournis par les entreprises qui fournissent de l'électricité "verte" sont des chiffres théoriques, qui ne correspondent pas à notre connaissance à l'empreinte d'un client moyen. 

C'est néanmoins un bon moyen pour être en phase avec ses valeurs, participer à la création d’emplois non délocalisables en France et passer un message aux décideur·se·s en faveur du développement des énergies renouvelables. Pour aller plus loin : http://changeonsdenergie.com

### Je mange bio, local, de saison, et du poisson

Nous n'avons pas encore intégré ces paramètres, mais cela viendra. 

Voir [ici](https://github.com/betagouv/ecolab-data/issues/185). 

### Je n'ai pas de voiture mais on me demande quand même toutes les informations de la voiture
Dès que vous renseignez un kilométrage de voiture plus grand que 0, l'amortissement de la construction d'une voiture est appliqué. En effet, la fabrication d'une voiture (en moyenne 1 200 kg d'acier et matériaux divers) émet plusieurs tonnes de CO2.
Pour ceux qui possèdent une voiture, toute l'empreinte de la construction de la voiture leur est attribuée. Si vous louez ou empruntez une voiture, seule une part de cette fabrication vous est ainsi appliquée, au prorata de votre utilisation.
Une voiture reste inutilisée et à l’arrêt en moyenne 95 % du temps : vous faites donc bien de la partager !

<h3 id="déplacements-pro">Dois-je renseigner mes déplacements pro ?</h3>

Non. Par "déplacement professionnel", on entend couramment les déplacements pour vous rendre dans un lieu de travail qui n'est pas votre lieu de travail habituel. Par exemple, un employé qui interviendrait sur les rails d'une voie ferroviaire. Un consultant qui irait dans une autre région rencontrer un client. 

Ces déplacements sont inclus dans la comptabilité des entreprises ou de l'administration. Dans nos exemples, il se pourrait que le consultant travaillait sur une étude pour cette ligne de train. L'empreinte de son déplacement pro doit être incluse dans celle de l'infrastructure "train", incluse à la suite dans le poste "service public". Un déplacement pro d'un salarié de chez Breizh Cola sera *normalement* inclus dans l'empreinte moyenne du soda.

Par contre, les déplacements réguliers domicile travail sont bien à inclure dans le calcul. Nous partons du principe qu'un salarié est libre de choisir son lieu d'habitation ou son mode de déplacement. Bien évidemment, ce principe confronté à la réalité de nos vies est souvent ébranlé : prix des logements en ville en France extrêmement élevé, vie de couple ou de famille à concilier, absence de piste cyclable sécurisée sur la plupart des routes de France, lignes de train régional laissées en désuétude, fort coût initial d'achat d'une voiture électrique, ...

### On ne me demande pas les caractéristiques de ma voiture (carburant...) ?

Nous arbitrons entre simplicité et précisions. A ce jour, nous ne différencions pas les carburants par exemple car l'impact entre diesel, essence, etc. est faible ([source ADEME](https://www.bilans-ges.ademe.fr/fr/basecarbone/donnees-consulter/liste-element/idRegle?recherche=combustible%20liquide)) au regard de la hauteur de la marche à franchir (passer en moyenne de 12 à moins de 2 tonnes de CO2e). Donc en première approximation, il vaut mieux jouer sur le nombre de kilomètres parcours, le nombre d'occupants du véhicule, penser à d'autres modes de transport (voir le [simulateur transport](https://ecolab.ademe.fr/transport) pour comparer un même trajet - quand l'offre existe).

### On ne demande pas les trajets en vélo, à pieds, etc. ?

Les modes de transport qui n'émettent pas de gaz à effet de serre ne sont pas comptés. Pour en savoir plus et comparer les modes de transport, nous vous suggérons de regarder le [simulateur transport](https://ecolab.ademe.fr/transport).

 ### J'ai entendu dire que le numérique avait un gros impact sur le climat, le simulateur me dit le contraire

Nous tâchons d'estimer au mieux l'empreinte du numérique, mais c'est un travail en cours. En effet, l'empreinte dépend beaucoup de l'équipement individuel, or cet équipement peut être très varié, du home cinema à l'appareil photo réflex en passant par le frigo connecté. Voir #56 

### D'où sortent vos calculs ? 

Le calcul est *ouvert*, ce qui signifie que tout le monde peut remettre en question les calculs et les améliorer. Il est basé au mieux sur les chiffres de la [Base Carbone de l'ADEME](https://www.bilans-ges.ademe.fr). Il reprend le calcul de l'outil MicMac d'Avenir Climatique.


