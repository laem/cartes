import React from 'react'
import Meta from '../../components/utils/Meta'

export default () => (
	<div>
		<Meta
			title="Données personnelles"
			description="Futur.eco fonctionne sans serveur, donc vos données restent chez vous. Nous collectons anonymement des données aggregées pour améliorer le simulateur."
		/>
		<h1>Données personnelles</h1>
		<p>
			La simulation se fait sur votre navigateur, donc les réponses aux
			questions restent chez vous, nous n'en collectons aucune.
		</p>
		<p>
			Ce site collecte des données de suivi de son utilisation, dans l'unique
			but de s'améliorer. Les données collectées sont anonymes, elles ne sont
			pas envoyées à un GAFAM, mais à un serveur Européen, plausible.io, qui
			s'engage à respecter les règles de la RGPD.
		</p>
	</div>
)
