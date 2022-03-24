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
			Ce site n'a aucun suivi de son utilisation, contrairement à la majorité
			qui envoie vos données aux GAFA.{' '}
		</p>
	</div>
)
